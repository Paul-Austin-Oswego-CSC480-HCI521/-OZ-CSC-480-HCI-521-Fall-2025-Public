package com.kudo.resource;

import com.kudo.dto.ClassDTO;
import com.kudo.model.Classes;
import jakarta.annotation.Resource;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObjectBuilder;
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
import java.util.HashMap;
import java.util.Map;
import java.sql.Timestamp;

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
     * - created_by: The UUID of the instructor creating the class
     * - end_date (optional): The end date for the class in ISO format
     *
     * Returns: 200 OK with the JSON representation of the created class including join_code
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":"X-X-X-X-X","class_name":"Teaching 101","join_code":123456}
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response createClass(@QueryParam("class_name") String class_name,
                                @QueryParam("created_by") String created_by,
                                @QueryParam("end_date") String end_date) {
        final String sql = """
        INSERT INTO CLASSES
            (class_name, created_by, end_date)
        VALUES (?, ?, ?::timestamp)
        RETURNING *
        """;

        final String addCreatorSql = """
        INSERT INTO USER_CLASSES
            (user_id, class_id, enrollment_status)
        VALUES (?, ?, 'APPROVED')
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            conn.setAutoCommit(false);
            stmt.setString(1, class_name);
            UUID creatorUuid = created_by != null ? UUID.fromString(created_by) : null;
            stmt.setObject(2, creatorUuid);
            stmt.setString(3, end_date);

            try  (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    JsonObjectBuilder jsonBuilder = Json.createObjectBuilder()
                        .add("class_id", rs.getString("class_id"))
                        .add("class_name", rs.getString("class_name"))
                        .add("join_code", rs.getString("join_code"));

                    if (rs.getString("end_date") != null) {
                        jsonBuilder.add("end_date", rs.getString("end_date"));
                    }

                    // add creator to the class if created_by is provided
                    if (creatorUuid != null) {
                        try (PreparedStatement addCreatorStmt = conn.prepareStatement(addCreatorSql)) {
                            addCreatorStmt.setObject(1, creatorUuid);
                            addCreatorStmt.setObject(2, UUID.fromString(rs.getString("class_id")));
                            addCreatorStmt.executeUpdate();
                        }
                    }

                    conn.commit();

                    return Response.ok(jsonBuilder.build()).build();
                }

            } catch (SQLException e) {
                throw new InternalServerErrorException("Database error: " + e.getMessage());
            }
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
        }
        throw new InternalServerErrorException("Failed to create class");
    }



    /**
     * Patch /kudo-app/api/class/X-X-X-X-X - Update a class's values
     *
     * Call: PATCH http://localhost:9080/kudo-app/api/class/X-X-X-X-X
     *
     * Query Parameters:
     * - class_id: The id of the class to update
     *
     * Request Body:
     *   {
     *     "end_date":"2025-01-15T10:30:00"
     *   }
     *
     * Returns: 200 OK with the JSON representation of the updated class
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":"X-X-X-X-X","class_name":"Teaching 101","join_code":"123456"}
     */
    @PATCH
    @Path("{class_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateClass(@PathParam("class_id") UUID class_id, ClassDTO.ClassUpdate update) {

        final String sql = """
        UPDATE CLASSES
        SET closed_at = ?
        WHERE class_id = ? AND end_date > CURRENT_TIMESTAMP
        RETURNING class_id, class_name, join_code, created_at, closed_at
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
                        rs.getInt("join_code"),
                        rs.getTimestamp("created_date"),
                        (UUID) rs.getObject("created_by"),
                        rs.getTimestamp("end_date")
                );

                return Response.ok(updated).build();
            }

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
        }
    }

    /**
     * Patch /kudo-app/api/class/X-X-X-X-X/regenerateJoinCode - regenerate a class's join code
     *
     * Call: PATCH http://localhost:9080/kudo-app/api/class/X-X-X-X-X/regenerateJoinCode
     *
     * Query Parameters:
     * - class_id: The id of the class to update
     *
     * Request Body:
     *   {
     *     "end_date":"2025-01-15T10:30:00"
     *   }
     *
     * Returns: 200 OK with the JSON representation of the updated class
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":"X-X-X-X-X","class_name":"Teaching 101","join_code":"ABC123"}
     */
    @PATCH
    @Path("{class_id}/regenerateJoinCode")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response regenerateJoinCode(@PathParam("class_id") UUID class_id) {

        final String sql = """
        UPDATE CLASSES
        SET join_code = gen_unique_n_digit_code(6)
        WHERE class_id = ? AND end_date > CURRENT_TIMESTAMP
        RETURNING class_id, join_code
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, class_id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new NotFoundException("Class not found");
                }

                JsonObjectBuilder jsonBuilder = Json.createObjectBuilder()
                        .add("class_id", rs.getString("class_id"))
                        .add("join_code", rs.getString("join_code"));

                return Response.ok(jsonBuilder.build()).build();
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
             PreparedStatement stmt = conn.prepareStatement("SELECT class_id FROM CLASSES WHERE class_id = ? AND end_date > CURRENT_TIMESTAMP;")) {
            stmt.setObject(1, UUID.fromString(class_id));
            try  (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new NotFoundException();
                }
            }
            //Do insert with all the users - explicitly set enrollment_status to APPROVED
            PreparedStatement stmt1 = conn.prepareStatement("""
        INSERT INTO USER_CLASSES
            (user_id, class_id, enrollment_status)
        VALUES (?, ?, 'APPROVED')
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
     * POST /kudo-app/api/class/enrollment/request - Student requests enrollment via join code
     *
     * Call: POST http://localhost:9080/kudo-app/api/class/enrollment/request
     *
     * Query Parameters:
     * - join_code: The join code for the class
     * - user_id: The UUID of the student requesting enrollment
     *
     * Returns: 200 OK with enrollment confirmation
     * Returns: 404 Not Found if join code is invalid
     * Returns: 400 Bad Request if class has ended or student already enrolled
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"message":"Enrollment request submitted successfully","class_name":"Teaching 101","status":"PENDING"}
     */
    @POST
    @Path("enrollment/request")
    @Produces(MediaType.APPLICATION_JSON)
    public Response requestEnrollment(@QueryParam("join_code") Integer joinCode,
                                      @QueryParam("user_id") String userId) {
        if (joinCode == null || userId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Json.createObjectBuilder()
                    .add("error", "join_code and user_id are required")
                    .build())
                .build();
        }

        final String validateSql = """
            SELECT class_id, class_name, end_date
            FROM CLASSES
            WHERE join_code = ? AND end_date > CURRENT_TIMESTAMP;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement validateStmt = conn.prepareStatement(validateSql)) {

            validateStmt.setInt(1, joinCode);

            try (ResultSet rs = validateStmt.executeQuery()) {
                if (!rs.next()) {
                    return Response.status(Response.Status.NOT_FOUND)
                        .entity(Json.createObjectBuilder()
                            .add("error", "Invalid or expired join code")
                            .build())
                        .build();
                }

                UUID classId = UUID.fromString(rs.getString("class_id"));
                String className = rs.getString("class_name");

                final String checkExistingSql = """
                    SELECT enrollment_status
                    FROM USER_CLASSES
                    WHERE user_id = ? AND class_id = ?
                """;

                try (PreparedStatement checkStmt = conn.prepareStatement(checkExistingSql)) {
                    checkStmt.setObject(1, UUID.fromString(userId));
                    checkStmt.setObject(2, classId);

                    try (ResultSet existingRs = checkStmt.executeQuery()) {
                        if (existingRs.next()) {
                            String status = existingRs.getString("enrollment_status");
                            if ("APPROVED".equals(status)) {
                                return Response.status(Response.Status.CONFLICT)
                                    .entity(Json.createObjectBuilder()
                                        .add("error", "You are already enrolled in this class")
                                        .build())
                                    .build();
                            } else if ("PENDING".equals(status)) {
                                return Response.status(Response.Status.CONFLICT)
                                    .entity(Json.createObjectBuilder()
                                        .add("error", "You already have a pending enrollment request for this class")
                                        .build())
                                    .build();
                            } else if ("DENIED".equals(status)) {
                                return Response.status(Response.Status.CONFLICT)
                                    .entity(Json.createObjectBuilder()
                                        .add("error", "Your previous enrollment request was denied. Please contact the instructor.")
                                        .build())
                                    .build();
                            }
                        }
                    }
                }

                final String insertSql = """
                    INSERT INTO USER_CLASSES
                        (user_id, class_id, enrollment_status)
                    VALUES (?, ?, 'PENDING')
                """;

                try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                    insertStmt.setObject(1, UUID.fromString(userId));
                    insertStmt.setObject(2, classId);

                    int rowsAffected = insertStmt.executeUpdate();

                    if (rowsAffected > 0) {
                        return Response.status(Response.Status.CREATED)
                            .entity(Json.createObjectBuilder()
                                .add("message", "Enrollment request submitted successfully")
                                .add("class_name", className)
                                .add("status", "PENDING")
                                .build())
                            .build();
                    } else {
                        throw new InternalServerErrorException("Failed to create enrollment request");
                    }
                }
            }
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
        }
    }

    /**
     * GET /kudo-app/api/class/pending-requests - Get pending enrollment requests for instructor's classes
     *
     * Call: GET http://localhost:9080/kudo-app/api/class/pending-requests?instructor_id={uuid}
     *
     * Query Parameters:
     * - instructor_id: The UUID of the instructor
     *
     * Returns: JSON array of pending enrollment requests with student and class details
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * [
     *   {
     *     "user_id":"X-X-X-X-X",
     *     "class_id":"Y-Y-Y-Y-Y",
     *     "student_name":"John Doe",
     *     "student_email":"john@example.com",
     *     "class_name":"Teaching 101",
     *     "requested_at":"2025-01-15T10:30:00"
     *   }
     * ]
     */
    @GET
    @Path("pending-requests")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPendingRequests(@QueryParam("instructor_id") String instructorId) {
        if (instructorId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Json.createObjectBuilder()
                    .add("error", "instructor_id is required")
                    .build())
                .build();
        }

        final String sql = """
            SELECT uc.user_id, uc.class_id,
                   u.name as student_name, u.email as student_email,
                   c.class_name
            FROM USER_CLASSES uc
            JOIN USERS u ON uc.user_id = u.user_id
            JOIN CLASSES c ON uc.class_id = c.class_id
            WHERE uc.enrollment_status = 'PENDING'
              AND c.created_by = ?
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setObject(1, UUID.fromString(instructorId));

            try (ResultSet rs = stmt.executeQuery()) {
                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

                while (rs.next()) {
                    JsonObjectBuilder requestBuilder = Json.createObjectBuilder()
                        .add("user_id", rs.getString("user_id"))
                        .add("class_id", rs.getString("class_id"))
                        .add("student_name", rs.getString("student_name"))
                        .add("student_email", rs.getString("student_email"))
                        .add("class_name", rs.getString("class_name"));

                    arrayBuilder.add(requestBuilder);
                }

                return Response.ok(arrayBuilder.build()).build();
            }
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
        }
    }

    /**
     * PATCH /kudo-app/api/class/enrollment/{user_id}/{class_id} - Approve or deny enrollment request
     *
     * Call: PATCH http://localhost:9080/kudo-app/api/class/enrollment/{user_id}/{class_id}?action=approve&instructor_id={uuid}
     *
     * Path Parameters:
     * - user_id: The UUID of the student
     * - class_id: The UUID of the class
     *
     * Query Parameters:
     * - action: Either "approve" or "deny"
     * - instructor_id: The UUID of the instructor performing the action
     *
     * Returns: 200 OK with confirmation message
     * Returns: 400 Bad Request if action is invalid
     * Returns: 404 Not Found if enrollment request doesn't exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"message":"Enrollment request approved successfully","student_name":"John Doe","class_name":"Teaching 101"}
     */
    @PATCH
    @Path("enrollment/{user_id}/{class_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEnrollmentStatus(@PathParam("user_id") String userId,
                                           @PathParam("class_id") String classId,
                                           @QueryParam("action") String action,
                                           @QueryParam("instructor_id") String instructorId) {
        if (action == null || (!action.equals("approve") && !action.equals("deny"))) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Json.createObjectBuilder()
                    .add("error", "action must be 'approve' or 'deny'")
                    .build())
                .build();
        }

        if (instructorId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Json.createObjectBuilder()
                    .add("error", "instructor_id is required")
                    .build())
                .build();
        }

        String newStatus = action.equals("approve") ? "APPROVED" : "DENIED";

        try (Connection conn = dataSource.getConnection()) {

            // First, verify instructor authorization
            final String checkAuthSql = """
                SELECT created_by, class_name
                FROM CLASSES
                WHERE class_id = ? AND end_date > CURRENT_TIMESTAMP;
            """;

            String className = null;

            try (PreparedStatement authStmt = conn.prepareStatement(checkAuthSql)) {
                authStmt.setObject(1, UUID.fromString(classId));

                try (ResultSet authRs = authStmt.executeQuery()) {
                    if (!authRs.next()) {
                        return Response.status(Response.Status.NOT_FOUND)
                            .entity(Json.createObjectBuilder()
                                .add("error", "Class not found")
                                .build())
                            .build();
                    }

                    className = authRs.getString("class_name");
                    UUID classCreatedBy = (UUID) authRs.getObject("created_by");

                    // Check authorization FIRST
                    if (classCreatedBy == null || !classCreatedBy.equals(UUID.fromString(instructorId))) {
                        return Response.status(Response.Status.FORBIDDEN)
                            .entity(Json.createObjectBuilder()
                                .add("error", "Only the class instructor can approve/deny enrollment requests")
                                .build())
                            .build();
                    }
                }
            }

            final String getDetailsSql = """
                SELECT u.name as student_name
                FROM USER_CLASSES uc
                JOIN USERS u ON uc.user_id = u.user_id
                WHERE uc.user_id = ? AND uc.class_id = ? AND uc.enrollment_status = 'PENDING'
            """;

            String studentName = null;

            try (PreparedStatement getStmt = conn.prepareStatement(getDetailsSql)) {
                getStmt.setObject(1, UUID.fromString(userId));
                getStmt.setObject(2, UUID.fromString(classId));

                try (ResultSet rs = getStmt.executeQuery()) {
                    if (rs.next()) {
                        studentName = rs.getString("student_name");
                    } else {
                        return Response.status(Response.Status.NOT_FOUND)
                            .entity(Json.createObjectBuilder()
                                .add("error", "Pending enrollment request not found")
                                .build())
                            .build();
                    }
                }
            }

            final String updateSql = """
                UPDATE USER_CLASSES
                SET enrollment_status = ?
                WHERE user_id = ? AND class_id = ? AND enrollment_status = 'PENDING'
            """;

            try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                updateStmt.setString(1, newStatus);
                updateStmt.setObject(2, UUID.fromString(userId));
                updateStmt.setObject(3, UUID.fromString(classId));

                int rowsUpdated = updateStmt.executeUpdate();

                if (rowsUpdated > 0) {
                    String message = action.equals("approve")
                        ? "Enrollment request approved successfully"
                        : "Enrollment request denied successfully";

                    return Response.ok(Json.createObjectBuilder()
                        .add("message", message)
                        .add("student_name", studentName)
                        .add("class_name", className)
                        .add("status", newStatus)
                        .build())
                        .build();
                } else {
                    return Response.status(Response.Status.NOT_FOUND)
                        .entity(Json.createObjectBuilder()
                            .add("error", "Failed to update enrollment status")
                            .build())
                        .build();
                }
            }
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error: " + e.getMessage());
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
                objectBuilder.add("created_date", rs.getTimestamp("created_date").toString());
                objectBuilder.add("end_date", rs.getTimestamp("end_date").toString());
                objectBuilder.add("join_code", rs.getString("join_code"));
                objectBuilder.add("is_archived", rs.getTimestamp("end_date").before(new Timestamp(System.currentTimeMillis())));
                arrayBuilder.add(objectBuilder);
            }

            return Response.ok(Json.createObjectBuilder().add("class", arrayBuilder).build()).build();

        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }


    @GET
    @Path("{class_id}/users")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Map<String, String>> getClassRoster(@PathParam("class_id") UUID class_id,
                                                     @QueryParam("enrollment_status") String enrollmentStatus) {
        // Validate enrollment_status if provided
        if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
            if (!enrollmentStatus.equals("PENDING") && !enrollmentStatus.equals("APPROVED") && !enrollmentStatus.equals("DENIED")) {
                throw new BadRequestException("Invalid enrollment_status. Must be PENDING, APPROVED, or DENIED");
            }
        }

        try (Connection conn = dataSource.getConnection()) {
            String sql;
            if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
                sql = """
                SELECT u.user_id, u.name, u.email, u.role
                FROM USER_CLASSES uc
                JOIN USERS u ON uc.user_id = u.user_id
                WHERE uc.class_id = ? AND uc.enrollment_status = ?""";
            } else {
                // Default to APPROVED for backward compatibility
                sql = """
                SELECT u.user_id, u.name, u.email, u.role
                FROM USER_CLASSES uc
                JOIN USERS u ON uc.user_id = u.user_id
                WHERE uc.class_id = ? AND uc.enrollment_status = 'APPROVED'""";
            }

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setObject(1, class_id);
                if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
                    stmt.setString(2, enrollmentStatus);
                }

                try (ResultSet rs = stmt.executeQuery()) {
                    List<Map<String, String>> users = new ArrayList<>();
                    while (rs.next()) {
                        Map<String, String> user = new HashMap<>();
                        user.put("id", rs.getString("user_id"));
                        user.put("name", rs.getString("name"));
                        user.put("email", rs.getString("email"));
                        user.put("role", rs.getString("role"));
                        users.add(user);
                    }
                    return users;
                }
            }
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
     * Call: DELETE http://localhost:9080/kudo-app/api/class/{class_id}/(user_id}
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
    @Path("{class_id}/{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUserFromClass(@PathParam("class_id") UUID class_id,
                                        @PathParam("user_id") UUID user_id) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT class_id FROM CLASSES WHERE class_id = ? AND end_date > CURRENT_TIMESTAMP;")) {
            stmt.setObject(1, class_id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new NotFoundException();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

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
