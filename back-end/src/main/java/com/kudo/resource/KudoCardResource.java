package com.kudo.resource;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.sql.DataSource;
import java.sql.*;

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

    //Returns list of all IDs pertaining to Kudos which are owned by this user
    @GET
    @Path("{username}/kudo-list")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Integer> getKudoList(@PathParam("username") String username) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT card_id FROM KUDOS_CARDS WHERE recipient_id = ?;");){//Static elements of query
            stmt.setString(1,username); //form the query

            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs

            List<Integer> card_ids = new ArrayList<>(); //List which will be filled with card_ids from the result set
            while (rs.next()) {
                card_ids.add(rs.getInt("card_id")); //add ids to list
            }

            //List should automatically be converted to JSON?
            return card_ids;

        } catch (SQLException e) {
            //TODO: Handle SQLException (probably return 404)
            throw new RuntimeException(e);
        }


    }


}
