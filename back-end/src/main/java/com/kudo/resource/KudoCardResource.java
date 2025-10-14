package com.kudo.resource;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.kudo.dto.KudocardDTO;
import com.kudo.dto.KudocardDTO.CreateKudoRequest;
import com.kudo.model.CardIdList;
import com.kudo.model.Kudocard;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import javax.sql.DataSource;
import java.sql.*;
import java.util.UUID;

@ApplicationScoped
@Path("kudo-card")
public class KudoCardResource {

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;

    //Endpoints go here...

    //Test Resource
    @GET
    @Path("test")
    @Produces(MediaType.TEXT_PLAIN)
    public String test() {
        return "Hello World!";
    }

     /**
     * GET /kudo-app/kudo-card/list/sent - Retrieve all card_ids which correspond to cards sent by a given user
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/list/sent?user_id=X-X-X-X-X
     *
     * Query Parameters:
     * - user_id: the UUID of the user who's sent card's card_ids are to be queried
     *
     * Returns: 200 OK with JSON array of UUID card_ids
     * Returns: 200 OK with empty JSON array if no cards sent by the given user are found
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"card_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("list/sent")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getSentKudoList(@QueryParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE sender_id = ?;");){//Static elements of query
            stmt.setObject(1,user_id); //form the query
            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs
            List<String> cardIds = new ArrayList<>(); //List which will be filled with card_ids from the result set
            while (rs.next()) {
                cardIds.add(rs.getString("card_id")); //add ids to list
            }
            //Wrap list as CardIdList
            //CardIdList is automatically converted to JSON due to the MIME type
            CardIdList cardIdList = new CardIdList(cardIds);
            return cardIdList;

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    //Returns list of all IDs pertaining to Kudos which are received by this user
    //UUID should be in the format X-X-X-X-X where each X is a string of alphanumerics

    /**
     * GET /kudo-app/kudo-card/list/received - Retrieve all card_ids which correspond to cards received by a given user
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/list/received?user_id=X-X-X-X-X
     *
     * Query Parameters:
     * - user_id: the UUID of the user who's received card's card_ids are to be queried
     *
     * Returns: JSON array of UUID card_ids
     * Returns: empty JSON array if no cards received by the given user are found
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"card_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("list/received")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getReceivedKudoList(@QueryParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE recipient_id = ?;");){//Static elements of query
            stmt.setObject(1,user_id); //form the query
            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs
            List<String> cardIds = new ArrayList<>(); //List which will be filled with card_ids from the result set
            while (rs.next()) {
                cardIds.add(rs.getString("card_id")); //add ids to list
            }
            //Wrap list as CardIdList
            //CardIdList is automatically converted to JSON due to the MIME type
            CardIdList cardIdList = new CardIdList(cardIds);
            return cardIdList;

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /**
     * GET /kudo-app/kudo-card/{card_id} - retrieve the card which has the given card_id if it is accessible to the user with the given user_id
     *
     * Call: GET http://localhost:9080/kudo-app/kudo-card/{W-W-W-W-W}?user_id=Y-Y-Y-Y-Y
     *
     * Path Parameters:
     * - card_id: the UUID card_id of the card which is requested
     *
     * Query Parameters:
     * - user_id: the UUID of the user who has access to the card with the given card_id
     *
     * Returns: Returns JSON representation of a Kudos card. If anonymous is set to true, and the given user_id is not an instructor,
     *          The sender_id is expunged from the returned JSON
     * Returns: 404 Not Found if a card with the given card_id does not exist or if the given user_id does not have permission
     *          to access the card with the given card_id
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {
     *  "anonymous":false,
     *  "card_id":"W-W-W-W-W",
     *  "class_id":"X-X-X-X-X",
     *  "content":"Good work today!",
     *  "recipient_id":"Y-Y-Y-Y-Y",
     *  "sender_id":"Z-Z-Z-Z-Z",
     *  "status":"PENDING",
     *  "title":"Good work!",
     *  "created_at":"date",
     *  "professor_note":null
     * }
     */
    @GET
    @Path("{card_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Kudocard getCard(@PathParam("card_id") UUID card_id, @QueryParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmtCard = conn.prepareStatement("SELECT * FROM KUDOS_CARDS WHERE card_id = ?;");){ //establish database connection
            stmtCard.setObject(1,card_id); //form the query
            ResultSet rs = stmtCard.executeQuery(); //execute query to obtain the kudo if it exists
            if (rs.next()) {
                Kudocard kudocard = ResultSetToKudocard(rs);

                //Check if the user is the recipient
                //(assume that the user is not their professor if they are the recipient)
                //Putting the most likely case first
                if(user_id.equals(kudocard.getRecipient_id())) {
                    if(kudocard.isIs_anonymous()) { //hide the sender if the card is anonymous
                        kudocard.setSender_id(null);
                    }
                    return kudocard;
                }
                //Check if the user is the sender
                else if(user_id.equals(kudocard.getSender_id())) {
                    return kudocard;
                } else {
                    //Check if the user is the professor of the sender
                   if(isInstructorOf(user_id, kudocard.getSender_id())) {
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

    /*
     * POST /kudo-app/api/kudo-card - create new kudo card
     * Content-type: JSON
     * Request Body: 
     * {
        "sender_id": "SENDER-UUID",
        "recipient_id": "RECIPIENT-UUID",
        "class_id": "CLASS-UUID",
        "title": "{card title}",
        "content": "{card content}",
        "is_anonymous": true (DEFAULT)
        }   
     * If successful, should return saved Kudos card response, status:CREATED
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createKudo(@Valid CreateKudoRequest req) {
        //quick check: sender !== recipient
        if (req.getSender_id().equals(req.getRecipient_id())) {
            throw new BadRequestException("sender and recip. UUID must be different");
        }
        final String sql = """
        INSERT INTO KUDOS_CARDS
            (sender_id, recipient_id, class_id, title, content, is_anonymous, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING *
        """;

        try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, req.getSender_id());
            stmt.setObject(2, req.getRecipient_id());
            stmt.setObject(3, req.getClass_id());
            stmt.setString(4, req.getTitle());
            stmt.setString(5, req.getContent());
            stmt.setBoolean(6, Boolean.TRUE.equals(req.getIs_anonymous()));
            stmt.setTimestamp(7, Timestamp.from(Instant.now()));
            try  (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Kudocard created = ResultSetToKudocard(rs);
                    return Response.status(Response.Status.CREATED).entity(created).build();

                }
            }
            throw new InternalServerErrorException("Failed to create Kudocard");
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /*
 * PATCH /kudo-app/api/kudo-card - update a kudos card to change its status
 * Content-type: JSON
 * Request Body:
 * {
    "card_id":"X-X-X-X-X",
    "status":"PENDING|APPROVED|DENIED|RECEIVED",
    "approvedBy":"Y-Y-Y-Y-Y",
    "professor_note":"abcdefg123456"|null
    *
    }
 * If successful, returns the request
 */
    @PATCH
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateKudoStatus(@Valid KudocardDTO.UpdateStatusRequest req) {

        //get the user_id of the card sender
       Kudocard kudocard = getCard(req.getCard_id(), req.getApproved_by());

       UUID sender_id = kudocard.getSender_id();

       //Check if the approvedBy is the professor of the user
        if(!isInstructorOf(req.getApproved_by(), sender_id)) {
            throw new NotFoundException();
        }

        //Update the card status to approved
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
            try  (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Response.status(Response.Status.CREATED).entity(req).build();
                }
            }
            throw new InternalServerErrorException("Failed to update Kudocard");
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }


    /**
     * DELETE /kudo-app/kudo-card/{card_id} - delete the card which has the given card_id if it is accessible to the user with the given user_id
     *
     * Call: DELETE http://localhost:9080/kudo-app/kudo-card/{W-W-W-W-W}?user_id=Y-Y-Y-Y-Y
     *
     * Path Parameters:
     * - card_id: the UUID card_id of the card which is requested
     *
     * Query Parameters:
     * - user_id: the UUID of the user who has access to the card with the given card_id
     *
     * Returns: 200 ok if the deletion was successful
     * Returns: 404 Not Found if a card with the given card_id does not exist or if the given user_id does not have permission
     *          to access the card with the given card_id
     * Returns: 500 Internal Server Error for database issues
     *
     */
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{card_id}")
    public Response deleteKudo(@PathParam("card_id") UUID card_id, @QueryParam("user_id") UUID user_id) {
        //Get
        try (Connection conn = dataSource.getConnection();) {
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM KUDOS_CARDS WHERE card_id = ? AND recipient_id = ?;");
            stmt.setObject(1, card_id);
            stmt.setObject(2, user_id);

            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    //Takes a ResultSet from a query and returns a Kudocard object created from the current result in the set.
    //Current result must be well-formed and my not be empty
    public Kudocard ResultSetToKudocard(ResultSet rs) throws SQLException {
        return new Kudocard(
                UUID.fromString(rs.getString("card_id")),
                UUID.fromString(rs.getString("sender_id")),
                UUID.fromString(rs.getString("recipient_id")),
                UUID.fromString(rs.getString("class_id")),
                rs.getString("title"),
                rs.getString("content"),
                rs.getBoolean("is_anonymous"),
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
        try (Connection conn = dataSource.getConnection();) {
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
        try (Connection conn = dataSource.getConnection();) {
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

}
