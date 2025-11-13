package com.kudo.service;

import com.kudo.dto.FlexibleDTO;
import com.kudo.dto.KudocardDTO;
import com.kudo.model.CardIdList;
import com.kudo.model.Kudocard;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@ApplicationScoped
public class KudoService {
    //Contains all columns except for is_anonymous (deprecated)
    private static final Set<String> VALID_VAL_SET_1 = Set.of("card_id","sender_id","recipient_id","class_id","title",
            "content","status","approved_by","created_at","professor_note");

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;

    public List<FlexibleDTO> getCardListBy(ArrayList<String> select, Map<String, Object> match) {
        //Get intersection of provided values
        ArrayList<String> validSelect =  intersect(select, VALID_VAL_SET_1);
        if(validSelect.isEmpty()) {
            validSelect.add("card_id"); //Default value
        }
        ArrayList<String> validMatch = intersect(match.keySet().stream().toList(), VALID_VAL_SET_1);

        //example: "SELECT values FROM KUDOS_CARDS WHERE recipient_id = ?;"
        String sql = (validMatch.isEmpty()) ? SqlGenerator.getSelect(validSelect, "KUDOS_CARDS")
                : SqlGenerator.getSelect(validSelect, "KUDOS_CARDS", validMatch);//Static elements of query
        try(Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {
            for(int i = 0; i < validMatch.size(); i++) {
                stmt.setObject(i+1,match.get(validMatch.get(i))); //form the query
            }

            ResultSet rs = stmt.executeQuery();
            List<FlexibleDTO> cards = new ArrayList<>(); //List which will be filled with card values from the result set
            while (rs.next()) {
                FlexibleDTO card = new FlexibleDTO();
                for(String s : validSelect){
                    card.set(s, rs.getObject(s));
                }
                cards.add(card);
            }
            return cards;

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    // Get all submitted kudos for a professor (status = PENDING)
    public CardIdList getSubmittedCards(UUID professor_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     """
                     SELECT c.card_id
                     FROM KUDOS_CARDS c
                     JOIN USERS u ON c.sender_id = u.user_id
                     JOIN USER_CLASSES uc ON u.user_id = uc.user_id
                     WHERE uc.class_id IN (
                         SELECT class_id FROM USER_CLASSES WHERE user_id = ?
                     )
                     AND c.status = 'PENDING';
                     """
             )) {
            stmt.setObject(1, professor_id);
            ResultSet rs = stmt.executeQuery();
            List<String> ids = new ArrayList<>();
            while (rs.next()) ids.add(rs.getString("card_id"));
            return new CardIdList(ids);
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    // Get all reviewed kudos for a professor (status != PENDING)
    public CardIdList getReviewedCards(UUID professor_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     """
                     SELECT c.card_id
                     FROM KUDOS_CARDS c
                     JOIN USERS u ON c.sender_id = u.user_id
                     JOIN USER_CLASSES uc ON u.user_id = uc.user_id
                     WHERE uc.class_id IN (
                         SELECT class_id FROM USER_CLASSES WHERE user_id = ?
                     )
                     AND c.status != 'PENDING';
                     """
             )) {
            stmt.setObject(1, professor_id);
            ResultSet rs = stmt.executeQuery();
            List<String> ids = new ArrayList<>();
            while (rs.next()) ids.add(rs.getString("card_id"));
            return new CardIdList(ids);
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public CardIdList getCardListBySender(UUID sender_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE sender_id = ?;")) {
            stmt.setObject(1,sender_id);
            ResultSet rs = stmt.executeQuery();
            List<String> cardIds = new ArrayList<>();
            while (rs.next()) {
                cardIds.add(rs.getString("card_id"));
            }
            return new CardIdList(cardIds);

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public CardIdList getCardListByReceived(UUID received_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE recipient_id = ?;")) {
            stmt.setObject(1,received_id);
            ResultSet rs = stmt.executeQuery();
            List<String> cardIds = new ArrayList<>();
            while (rs.next()) {
                cardIds.add(rs.getString("card_id"));
            }
            return new CardIdList(cardIds);

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public Kudocard getCard(UUID card_id,  UUID user_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmtCard = conn.prepareStatement("SELECT * FROM KUDOS_CARDS WHERE card_id = ?;")) { //establish database connection
            stmtCard.setObject(1,card_id); //form the query
            ResultSet rs = stmtCard.executeQuery(); //execute query to obtain the kudo if it exists
            if (rs.next()) {
                Kudocard kudocard = ResultSetToKudocard(rs);

                // Check access: sender or recipient can see; otherwise professor of sender can see
                if (user_id.equals(kudocard.getSender_id()) || user_id.equals(kudocard.getRecipient_id())) {

                    // --- NEW: If the caller is the RECIPIENT and the card is not yet RECEIVED, mark it RECEIVED (idempotent) ---
                    if (user_id.equals(kudocard.getRecipient_id())
                            && kudocard.getStatus() != Kudocard.Status.RECEIVED) {
                        try (PreparedStatement up = conn.prepareStatement(
                                "UPDATE KUDOS_CARDS SET status = 'RECEIVED' WHERE card_id = ? AND status <> 'RECEIVED'")) {
                            up.setObject(1, kudocard.getCard_id());
                            up.executeUpdate();
                        }
                        // reflect change in the returned object
                        kudocard.setStatus(Kudocard.Status.RECEIVED);
                    }

                    return kudocard;
                } else {
                    //Check if the user is the professor of the sender
                    if (isInstructorOf(user_id, kudocard.getSender_id())) {
                        return kudocard;
                    } else {
                        throw new NotFoundException();
                    }
                }

            } else { //Card not found; 404
                throw new NotFoundException();
            }

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public Kudocard createCard(KudocardDTO.CreateKudoRequest req) throws SQLException {
        String outStatus = "PENDING";
        if (isInstructorOf(req.getSender_id(), req.getRecipient_id()))
            outStatus = "APPROVED";
        final String sql = """
        INSERT INTO KUDOS_CARDS
            (sender_id, recipient_id, class_id, title, content, status)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *
        """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, req.getSender_id());
            stmt.setObject(2, req.getRecipient_id());
            stmt.setObject(3, req.getClass_id());
            stmt.setString(4, req.getTitle());
            stmt.setString(5, req.getContent());
            stmt.setString(6, outStatus);
            try  (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return ResultSetToKudocard(rs);
                }
            }
            throw new InternalServerErrorException("Failed to create Kudocard");
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public void updateCard(KudocardDTO.UpdateStatusRequest req) {
        //Update the card status to approved/denied/received & notes/approver
        final String sql = """
        UPDATE KUDOS_CARDS
        SET status = ?, approved_by = ?, professor_note = ?
        WHERE card_id = ?;
        """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, req.getStatus());
            stmt.setObject(2, req.getApproved_by());
            stmt.setObject(3, req.getProfessor_note());
            stmt.setObject(4, req.getCard_id());
            stmt.executeUpdate();
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public void setCardStatus(UUID card_id, String status) {
        //Update the card status to approved
        final String sql = """
        UPDATE KUDOS_CARDS
        SET status = ?
        WHERE card_id = ?;
        """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1,status);
            stmt.setObject(2,card_id);
            stmt.executeUpdate();
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    public void deleteCard(UUID card_id, UUID user_id) {
        try (Connection conn = dataSource.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM KUDOS_CARDS WHERE card_id = ? AND recipient_id = ?;");
            stmt.setObject(1, card_id);
            stmt.setObject(2, user_id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    //Takes a ResultSet from a query and returns a Kudocard object created from the current result in the set.
    //Current result must be well-formed and may not be empty
    public Kudocard ResultSetToKudocard(ResultSet rs) throws SQLException {
        return new Kudocard(
                UUID.fromString(rs.getString("card_id")),
                UUID.fromString(rs.getString("sender_id")),
                UUID.fromString(rs.getString("recipient_id")),
                UUID.fromString(rs.getString("class_id")),
                rs.getString("title"),
                rs.getString("content"),
                // rs.getBoolean("is_anonymous"),
                Kudocard.Status.valueOf(rs.getString("status")),
                rs.getString("approved_by")!=null ? //approved_by will be null if the card is not approved
                        UUID.fromString(rs.getString("approved_by")) : null,
                rs.getTimestamp("created_at"),
                rs.getString("professor_note")
        );
    }

    //returns true if instructor_id is an instructor and is in the same class as user_id
    public boolean isInstructorOf(UUID instructor_id, UUID user_id) throws InternalServerErrorException {
        return isInstructor(instructor_id) && inSameClass(instructor_id, user_id);
    }

    //returns true if instructor_id is an instructor and is in the same class as user_id
    public boolean inSameClass(UUID user_1, UUID user_2) throws InternalServerErrorException {
        try (Connection conn = dataSource.getConnection()) {
            //Check if they are both in the class
            PreparedStatement stmt1 = conn.prepareStatement("""
                    SELECT COUNT(DISTINCT user_id) AS cnt
                    FROM USER_CLASSES
                    WHERE user_id IN (?, ?);
                    """);
            stmt1.setObject(1, user_1);
            stmt1.setObject(2, user_2);
            ResultSet rs = stmt1.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    //returns true if instructor_id is an instructor
    public boolean isInstructor(UUID instructor_id) throws InternalServerErrorException {
        try (Connection conn = dataSource.getConnection()) {
            //Check if they are both in the class
            PreparedStatement stmt1 = conn.prepareStatement("""
                    SELECT user_id
                    FROM USERS
                    WHERE user_id = ?
                      AND role = 'INSTRUCTOR';
                    """);
            stmt1.setObject(1, instructor_id);
            ResultSet rs = stmt1.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    //Intersect values with a set of valid values. Invalid values are removed
    private ArrayList<String> intersect(List<String> values, final Set<String> valid) {
        return new ArrayList<>(values.stream()
                .filter(valid::contains)
                .toList());
    }
}
