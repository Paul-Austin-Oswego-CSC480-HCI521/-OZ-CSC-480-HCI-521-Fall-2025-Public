package com.kudo.resource;

import com.kudo.dto.ClassDTO;
import com.kudo.dto.KudocardDTO;
import com.kudo.model.Classes;
import com.kudo.model.Kudocard;
import jakarta.annotation.Resource;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObjectBuilder;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@Path("class")
public class ClassesResource {

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;



    /**
     * POST /kudo-app/api/class - Create a new class
     *
     * Accepts JSON payload with:
     * - class_name (required)
     * - closed_at (optional)
     *
     * Request Body:
     * {
     *   "class_name": "Teaching 101",
     *   "closed_at": "2026-08-24T14:00:00" | optional
     * }
     *
     * Example Response:
     * {
     *   "class_id": "X-X-X-X-X",
     *   "class_name": "Teaching 101",
     *   "class_code": 123456,
     *   "created_at": "2025-12-27T14:00:00",
     *   "closed_at": "2026-08-24T14:00:00"
     * }
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Classes createClass(ClassDTO.ClassCreate dto) {
        if (dto.getClass_name() == null || dto.getClass_name().isBlank()) {
            throw new NotFoundException("class_name is required");
        }

        final String sql = """
            INSERT INTO CLASSES (class_name, closed_at)
            VALUES (?, ?)
            RETURNING *
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, dto.getClass_name());

            if (dto.getClosed_at() != null) {
                stmt.setTimestamp(2, Timestamp.valueOf(dto.getClosed_at()));
            } else {
                stmt.setNull(2, Types.TIMESTAMP);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Classes(
                            (UUID) rs.getObject("class_id"),
                            rs.getString("class_name"),
                            rs.getInt("class_code"),
                            rs.getTimestamp("created_at"),
                            rs.getTimestamp("closed_at")
                    );
                }
            }

            throw new InternalServerErrorException("Failed to create class");
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    @PATCH
    @Path("{class_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateClass(@PathParam("class_id") UUID class_id, ClassDTO.ClassUpdate update) {

        final String sql = """
        UPDATE CLASSES
        SET closed_at = ?
        WHERE class_id = ?
        RETURNING class_id, class_name, class_code, created_at, closed_at
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setTimestamp(1, update.getClosedAtAsTimestamp());
            stmt.setObject(2, class_id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new NotFoundException("Class not found");
                }

                // You already have a DTO for classes, so reuse it if available.
                Classes updated = new Classes(
                        (UUID) rs.getObject("class_id"),
                        rs.getString("class_name"),
                        rs.getInt("class_code"),
                        rs.getTimestamp("created_at"),
                        rs.getTimestamp("closed_at")
                );

                return Response.ok(updated).build();
            }

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
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
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT class_id FROM CLASSES WHERE class_id = ?;")) {
            stmt.setObject(1, UUID.fromString(class_id));
            try  (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
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

            conn.commit();

            if(rs.length == 0)
                throw new NotFoundException();
            return new ClassDTO.ClassId(class_id);
        } catch  (SQLException e) {
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
                objectBuilder.add("class_code", rs.getInt("class_code"));
                objectBuilder.add("created_at", rs.getTimestamp("created_at").toString());
                objectBuilder.add("closed_at", rs.getTimestamp("closed_at").toString());
                arrayBuilder.add(objectBuilder);
            }

            return Response.status(Response.Status.CREATED).entity(Json.createObjectBuilder().add("class", arrayBuilder).build()).build();

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    @GET
    @Path("{class_id}/users")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, String>> getClassRoster(@PathParam("class_id") UUID class_id) {
    try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement("""
        SELECT u.user_id, u.name
        FROM USER_CLASSES uc
        JOIN USERS u ON uc.user_id = u.user_id
        WHERE uc.class_id = ?""")) {
        stmt.setObject(1, class_id);
        ResultSet rs = stmt.executeQuery(); 
        List<Map<String, String>> users = new ArrayList<>();
        while (rs.next()) {
            Map<String, String> user = new HashMap<>();
            user.put("id", rs.getString("user_id"));
            user.put("name", rs.getString("name"));
            users.add(user);
        }
        return users;
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
