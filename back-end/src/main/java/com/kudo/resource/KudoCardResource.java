package com.kudo.resource;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import com.kudo.dto.KudocardDTO;
import com.kudo.dto.KudocardDTO.CreateKudoRequest;
import com.kudo.model.CardIdList;
import com.kudo.model.Kudocard;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NoContentException;
import jakarta.ws.rs.core.Response;
import javax.sql.DataSource;
import java.sql.*;
import java.util.UUID;

@ApplicationScoped
@Path("kudo-card")
public class KudoCardResource {

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;

    @Context
    private HttpServletResponse response;

    //Endpoints go here...

    //Test Resource
    @GET
    @Path("test")
    @Produces(MediaType.TEXT_PLAIN)
    public String test() {
        return "Hello World!";
    }

    //Takes a JSON which represents a Kudocard object and Creates a new entry in the KUDOS_CARD table of the database
    //Using the supplied information

    //Returns list of all IDs pertaining to Kudos which are owned by this user
    //UUID should be in the format X-X-X-X-X where each X is a string of alphanumerics
    @GET
    @Path("list")
    @Produces(MediaType.APPLICATION_JSON)
    public CardIdList getKudoList(@QueryParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE recipient_id = ?;");){//Static elements of query
            stmt.setObject(1,user_id); //form the query

            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs

            List<String> cardIds = new ArrayList<>(); //List which will be filled with card_ids from the result set
            while (rs.next()) {
                cardIds.add(rs.getString("card_id")); //add ids to list
            }

            //Wrap list as CardIdList
            //CardIdList should automatically be converted to JSON due to the MIME type?
            return new CardIdList(cardIds);

        } catch (SQLException e) {
            throw new NotFoundException();
        }
    }

    //Returns the kudos card of the given ID if the given user is the recipient of that Kudos
    //UUID should be in the format X-X-X-X-X where each X is a string of alphanumerics
    @GET
    @Path("{card_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Kudocard getCard(@PathParam("card_id") UUID card_id, @QueryParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM KUDOS_CARDS WHERE card_id = ? AND recipient_id = ?;");){//Static elements of query
            stmt.setObject(1,card_id); //form the query
            stmt.setObject(2,user_id); //form the query

            ResultSet rs = stmt.executeQuery(); //execute query to obtain the kudo if it exists

            if (rs.next()) {
                //TODO: If the user is not a professor and the card is set to be anonymous,
                //      The sender_id should be expunged

                return ResultSetToKudocard(rs);
            } else { //Card not found; 404
                throw new NotFoundException();
            }

        } catch (SQLException e) {
            throw new NotFoundException();
        }
    }

    /*
     * POST /kudo-app/api/kudo-card - create new kudo card
     * Content-type: JSON
     * Request Body: 
     * {
        "senderId": "SENDER-UUID",
        "recipientId": "RECIPIENT-UUID",
        "classId": "CLASS-UUID",
        "title": "{card title}",
        "content": "{card content}",
        "isAnonymous": true (DEFAULT)
        }   
     * If succesful, should return saved Kudo card response, status:CREATED
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createKudo(@Valid CreateKudoRequest req) {
        //quick check: sender !== recipient
        if (req.getSenderId().equals(req.getRecipientId())) {
            throw new BadRequestException("sender and recip. UUID must be different");
        }

        final String sql = """
        INSERT INTO KUDOS_CARDS
            (sender_id, recipient_id, class_id, title, content, is_anonymous)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *
        """;

        try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, req.getSenderId());
            stmt.setObject(2, req.getRecipientId());
            stmt.setObject(3, req.getClassId());
            stmt.setString(4, req.getTitle());
            stmt.setString(5, req.getContent());
            stmt.setBoolean(6, Boolean.TRUE.equals(req.getIsAnonymous()));
            
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
                        UUID.fromString(rs.getString("approved_by")) : null
        );
    }




}
