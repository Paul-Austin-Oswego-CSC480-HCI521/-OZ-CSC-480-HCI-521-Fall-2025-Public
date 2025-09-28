package com.kudo.resource;

import com.kudo.dto.ClassDTO;
import com.kudo.model.Classes;
import jakarta.annotation.Resource;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObjectBuilder;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Path("class")
public class ClassesResource {

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;

    /**
     * POST /kudo-app/api/class - Create a new class
     *
     * Call: POST http://localhost:9080/kudo-app/api/class
     *
     * Query Parameters:
     * - class_name: The name of the class
     *
     * Returns: 200 OK with the JSON representation of the created class
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":"X-X-X-X-X","class_name":"Teaching 101"}
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Classes createClass(@QueryParam("class_name") String class_name) {
        final String sql = """
        INSERT INTO CLASSES
            (class_name)
        VALUES (?)
        RETURNING *
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, class_name);

            try  (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Classes(rs.getString("class_name"));
                }
            }
            throw new InternalServerErrorException("Failed to create class");
        } catch  (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /**
     * PUT /kudo-app/api/class/{class_id} - Add students to a new class
     *
     * Call: PUT http://localhost:9080/kudo-app/api/class/{class_id}
     *
     * Query Parameters
     * - class_id: The id of the class which students are to be added to
     *
     * Request  Body
     * {
     *   user_id:[
     *     "X-X-X-X-X",
     *     "Y-Y-Y-Y-Y"
     *   ]
     * }
     *
     * Returns: 200 OK with the same JSON that was given as a parameter
     * Returns: 404 Not found if the class or one of the provided students/instructors does not exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":"X-X-X-X-X"}
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{class_id}")
    public ClassDTO.ClassId addStudents(@PathParam("class_id") String class_id,ClassDTO.UserIdList user_ids) {
        //Do a query to confirm the existence of the given class
        for (int i = 0; i < user_ids.user_id.size(); i++){
            System.out.println(user_ids.user_id.get(i));
        }
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT class_id FROM CLASSES WHERE class_id = ?;")) {
            stmt.setObject(1, UUID.fromString(class_id));
            System.out.println("f");
            try  (ResultSet rs = stmt.executeQuery()) {
                System.out.println("aftr");
                if (!rs.next()) {
                    System.out.println("2");
                    throw new NotFoundException();
                }
            }
            //Do insert with all the users
            PreparedStatement stmt1 = conn.prepareStatement("""
        INSERT INTO USER_CLASSES
            (user_id, class_id)
        VALUES (?, ?)
        RETURNING *
        """);
            conn.setAutoCommit(false);

            for(String id : user_ids.user_id) {
                stmt1.setObject(1,UUID.fromString(id));
                stmt1.setObject(2, UUID.fromString(class_id));
                stmt1.addBatch();
            }
            int[] rs = stmt1.executeBatch();

            System.out.println("b");
            conn.commit();

            if(rs.length == 0)
                throw new NotFoundException();

            System.out.println("3");
            return new ClassDTO.ClassId(class_id);
        } catch  (SQLException e) {
            System.out.println("4");
            throw new NotFoundException();
        }
    }

    /**
     * GET /kudo-app/class/classes - Retrieve a list of all classes
     *
     * Call: GET http://localhost:9080/kudo-app/api/class/classes
     *
     * Returns: JSON array of UUID class_ids
     * Returns: empty JSON array if no classes
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("classes")
    @Produces(MediaType.APPLICATION_JSON)
    public ClassDTO.ClassIdList getClassList() {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT class_id FROM CLASSES;")){//Static elements of query
            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs
            List<String> classIds = new ArrayList<>(); //List which will be filled with class_id from the result set
            while (rs.next()) {
                classIds.add(rs.getString("class_id")); //add ids to list
            }

            return new ClassDTO.ClassIdList(classIds);

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /**
     * GET /kudo-app/api/class/{class_id} - Retrieve a class
     *
     * Call: GET http://localhost:9080/kudo-app/api/class/{class_id}
     *
     * Path Parameters
     * - class_id: The UUID of the class which is desired to be obtained
     *
     * Returns: JSON array of UUID class_ids
     * Returns: empty JSON array if no classes
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class":[{"class_id":"X-X-X-X-X","class_name":"grifting"}]}
     */
    @GET
    @Path("{class_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getClass(@PathParam("class_id") UUID class_id) {
        try (Connection conn = dataSource.getConnection(); //establish database connection
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM CLASSES WHERE class_id = ?;")){//Static elements of query
            stmt.setObject(1, class_id);
            ResultSet rs = stmt.executeQuery(); //execute query to obtain list of IDs

            //Json builder is the lazy way to do this
            //If CLASSES table had more fields, A DTO would be a better solution
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            while (rs.next()) {
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("class_id", rs.getString("class_id"));
                objectBuilder.add("class_name", rs.getString("class_name"));
                arrayBuilder.add(objectBuilder);
            }

            return Response.status(Response.Status.CREATED).entity(Json.createObjectBuilder().add("class", arrayBuilder).build()).build();

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /**
     * DELETE /kudo-app/api/class/{class_id} - Delete a class by ID
     *
     * Call: DELETE http://localhost:9080/kudo-app/api/class/{class_id}
     *
     * Path Parameters
     * - class_id: The UUID of the class to delete
     *
     * Returns: 200 OK if deleted
     * Returns: 404 Not Found if the class does not exist
     * Returns: 500 Internal Server Error for database issues
     */
    @DELETE
    @Path("{class_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteClass(@PathParam("class_id") UUID class_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM CLASSES WHERE class_id = ?")) {

            stmt.setObject(1, class_id);

            if (stmt.executeUpdate() == 0) {
                throw new NotFoundException();
            }

            return Response.ok().build();

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    /**
     * DELETE /kudo-app/api/class/{class_id} - Remove a user from a class
     *
     * Call: DELETE http://localhost:9080/kudo-app/api/class/{class_id}
     *
     * Path Parameters
     * - class_id: The UUID of the class
     * - user_id: The UUID of the user
     *
     * Returns: 200 OK if the user was removed from the class
     * Returns: 404 Not Found if the user was not in the class
     * Returns: 500 Internal Server Error for database issues
     */
    @DELETE
    @Path("{class_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUserFromClass(@PathParam("class_id") UUID class_id,
                                        @QueryParam("user_id") UUID user_id) {
        final String sql = "DELETE FROM USER_CLASSES WHERE class_id = ? AND user_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, class_id);
            stmt.setObject(2, user_id);

            if (stmt.executeUpdate() == 0) {
                throw new NotFoundException();
            }

            return Response.ok().build();

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

}
