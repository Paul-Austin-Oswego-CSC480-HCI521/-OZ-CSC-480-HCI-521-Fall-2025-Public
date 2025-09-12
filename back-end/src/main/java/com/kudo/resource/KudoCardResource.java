package com.kudo.resource;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.kudo.model.CardIdList;
import com.kudo.model.Kudocard;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.servlet.http.HttpServletResponse;
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
    //TODO: Implement POST for creating Kudos card

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
                rs.getBoolean("isAnonymous"),
                Kudocard.Status.valueOf(rs.getString("status")),
                rs.getString("approvedBy")!=null ? //approvedBy will be null if the card is not approved
                        UUID.fromString(rs.getString("approvedBy")) : null
        );
    }




}
