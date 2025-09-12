package com.kudo.resource;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.kudo.model.CardIdList;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
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

            List<Integer> cardIds = new ArrayList<>(); //List which will be filled with card_ids from the result set
            while (rs.next()) {
                cardIds.add(rs.getInt("card_id")); //add ids to list
            }

            //Wrap list as CardIdList
            //CardIdList should automatically be converted to JSON due to the MIME type?
            return new CardIdList(cardIds);

        } catch (SQLException e) {
            //TODO: Handle SQLException (probably return 404)
            throw new RuntimeException(e);
        }


    }


}
