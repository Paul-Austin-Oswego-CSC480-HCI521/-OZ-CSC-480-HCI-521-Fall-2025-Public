package com.kudo.resource;

import com.kudo.dto.ClassDTO;
import com.kudo.dto.UserDTO;
import com.kudo.model.User;
import com.kudo.service.UserService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// User REST API
@ApplicationScoped
@Path("users")
public class UserResource {

    @Inject
    private UserService userService;

    /**
     * GET /kudo-app/api/users - Retrieve all users with optional filtering and pagination
     *
     * Call: GET http://localhost:9080/kudo-app/api/users
     * Call: GET http://localhost:9080/kudo-app/api/users?role=STUDENT
     * Call: GET http://localhost:9080/kudo-app/api/users?role=INSTRUCTOR
     * Call: GET http://localhost:9080/kudo-app/api/users?limit=50&offset=100
     * Call: GET http://localhost:9080/kudo-app/api/users?role=STUDENT&limit=25&offset=0
     *
     * Query Parameters:
     * - role: Filter by user role (STUDENT or INSTRUCTOR)
     * - limit: Maximum number of users to return (default: 100)
     * - offset: Number of users to skip for pagination (default: 0)
     *
     * Returns: 200 OK with JSON array of user objects
     * Returns: 400 Bad Request if invalid role provided
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * [{"user_id":"uuid","email":"john.doe@example.com","name":"John Doe","role":"STUDENT"}]
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers(
            @QueryParam("role") String role,
            @QueryParam("limit") @DefaultValue("100") int limit,
            @QueryParam("offset") @DefaultValue("0") int offset) throws SQLException {

        List<User> users = (role != null && !role.isEmpty())
            ? userService.getUsersByRole(User.Role.valueOf(role.toUpperCase()))
            : userService.getAllUsers();

        int fromIndex = Math.min(offset, users.size());
        int toIndex = Math.min(offset + limit, users.size());
        List<User> pagedUsers = users.subList(fromIndex, toIndex);

        return Response.ok(pagedUsers).build();
    }

    /**
 * GET /kudo-app/api/users/by-email?email=...
 * Retrieve a user by email
 *
 * Example:
 * GET http://localhost:9080/kudo-app/api/users/by-email?email=test@example.com
 */
@GET
@Path("by-email")
@Produces(MediaType.APPLICATION_JSON)
public Response getUserByEmail(@QueryParam("email") String email) throws SQLException {
    if (email == null || email.isBlank()) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Email query parameter is required").build();
    }

    Optional<User> userOpt = userService.getUserByEmail(email.trim());

    if (userOpt.isEmpty()) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity("User not found").build();
    }

    return Response.ok(userOpt.get()).build();
}


    /**
     * GET /kudo-app/api/users/{user_id} - Retrieve a specific user by UUID
     *
     * Call: GET http://localhost:9080/kudo-app/api/users/36f6b7db-63c2-4d4a-aeac-0bf909295f7f
     *
     * Returns: 200 OK with user JSON object
     * Returns: 400 Bad Request if invalid UUID format
     * Returns: 404 Not Found if user doesn't exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"user_id":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Doe","role":"STUDENT"}
     */
    @GET
    @Path("{user_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("user_id") String idStr) throws SQLException {
        UUID userId = UUID.fromString(idStr);
        Optional<User> user = userService.getUserById(userId);

        if (user.isEmpty()) {
            throw new SQLException("User not found");
        }

        return Response.ok(user.get()).build();
    }

    /**
     * POST /kudo-app/api/users - Create a new user (Admin only - normally users are created via OAuth)
     *
     * Call: POST http://localhost:9080/kudo-app/api/users
     * Content-Type: application/json
     * Body: {"email":"john.doe@example.com","name":"John Doe","google_id":"1234567890","role":"STUDENT"}
     *
     *
     * Returns: 201 Created with user JSON object (includes generated UUID)
     * Returns: 400 Bad Request if required fields missing or invalid role
     * Returns: 409 Conflict if email already exists
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"user_id":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Doe","google_id":"1234567890","role":"STUDENT"}
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(@Valid UserDTO.CreateRequest userCreateDTO) throws SQLException {
        if (userService.existsByEmail(userCreateDTO.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        User.Role role = User.Role.valueOf(userCreateDTO.getRole().toUpperCase());
        User user = new User(
            userCreateDTO.getEmail(),
            userCreateDTO.getName(),
            userCreateDTO.getGoogle_id(),
            role
        );
        User createdUser = userService.createOAuthUser(user);

        return Response.status(Response.Status.CREATED).entity(createdUser).build();
    }

    /**
     * PUT /kudo-app/api/users/{user_id} - Update an existing user (name and role only, email is immutable)
     *
     * Call: PUT http://localhost:9080/kudo-app/api/users/36f6b7db-63c2-4d4a-aeac-0bf909295f7f
     * Content-Type: application/json
     * Body: {"name":"John Updated Doe","role":"INSTRUCTOR"}
     *
     * Returns: 200 OK with updated user JSON object (excludes password)
     * Returns: 400 Bad Request if invalid UUID format, missing fields, or invalid role
     * Returns: 404 Not Found if user doesn't exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"user_id":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Updated Doe","role":"INSTRUCTOR"}
     */
    @PUT
    @Path("{user_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("user_id") String idStr, @Valid UserDTO.UserData userUpdateDTO) throws SQLException {
        UUID user_id = UUID.fromString(idStr);

        Optional<User> existingUser = userService.getUserById(user_id);
        if (existingUser.isEmpty()) {
            throw new SQLException("User not found");
        }

        User user = existingUser.get();
        userService.updateUserFromUserData(user, userUpdateDTO);
        User updatedUser = userService.updateUser(user_id, user);

        return Response.ok(updatedUser).build();
    }

    /**
     * DELETE /kudo-app/api/users/{user_id} - Delete a user (cascades to related records)
     *
     * Call: DELETE http://localhost:9080/kudo-app/api/users/36f6b7db-63c2-4d4a-aeac-0bf909295f7f
     *
     * Returns: 204 No Content if user successfully deleted (no response body)
     * Returns: 400 Bad Request if invalid UUID format
     * Returns: 404 Not Found if user doesn't exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Note: Deletion cascades to USER_CLASSES and KUDOS_CARDS per database schema
     */
    @DELETE
    @Path("{user_id}")
    public Response deleteUser(@PathParam("user_id") String idStr) throws SQLException {
        UUID userId = UUID.fromString(idStr);
        boolean deleted = userService.deleteUser(userId);

        if (!deleted) {
            throw new SQLException("User not found");
        }

        return Response.noContent().build();
    }

    /**
     * GET /kudo-app/api/users/{user_id}/classes - Retrieve a list of all classes which the user is enrolled in
     *
     * Call: GET http://localhost:9080/kudo-app/api/users/{user_id}/classes
     *
     * Path Parameters:
     * - user_id: the UUID of the user who's enrolled classes are to be queried
     *
     * Returns: JSON array of UUID class_ids
     * Returns: empty JSON array if no classes received by the given user are found
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"class_id":["X-X-X-X-X"]}
     */
    @GET
    @Path("{user_id}/classes")
    @Produces(MediaType.APPLICATION_JSON)
    public ClassDTO.ClassIdList getUserClasses(@PathParam("user_id") UUID user_id,
                                               @QueryParam("enrollment_status") String enrollmentStatus) {
        return userService.getUserClasses(user_id, enrollmentStatus);
    }

}