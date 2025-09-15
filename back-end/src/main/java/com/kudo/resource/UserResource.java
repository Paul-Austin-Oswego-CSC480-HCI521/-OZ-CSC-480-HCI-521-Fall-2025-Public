package com.kudo.resource;

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
     * [{"userId":"uuid","email":"john.doe@example.com","name":"John Doe","role":"STUDENT"}]
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
     * GET /kudo-app/api/users/{id} - Retrieve a specific user by UUID
     *
     * Call: GET http://localhost:9080/kudo-app/api/users/36f6b7db-63c2-4d4a-aeac-0bf909295f7f
     *
     * Returns: 200 OK with user JSON object
     * Returns: 400 Bad Request if invalid UUID format
     * Returns: 404 Not Found if user doesn't exist
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"userId":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Doe","role":"STUDENT"}
     */
    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("id") String idStr) throws SQLException {
        UUID userId = UUID.fromString(idStr);
        Optional<User> user = userService.getUserById(userId);

        if (user.isEmpty()) {
            throw new SQLException("User not found");
        }

        return Response.ok(user.get()).build();
    }

    /**
     * POST /kudo-app/api/users - Create a new user
     *
     * Call: POST http://localhost:9080/kudo-app/api/users
     * Content-Type: application/json
     * Body: {"email":"john.doe@example.com","name":"John Doe","password":"password123","role":"STUDENT"}
     *
     * Returns: 201 Created with user JSON object (excludes password, includes generated UUID)
     * Returns: 400 Bad Request if required fields missing or invalid role
     * Returns: 409 Conflict if email already exists
     * Returns: 500 Internal Server Error for database issues
     *
     * Example response:
     * {"userId":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Doe","role":"STUDENT"}
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(@Valid UserDTO.CreateRequest userCreateDTO) throws SQLException {
        if (userService.existsByEmail(userCreateDTO.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        String hashedPassword = hashPassword(userCreateDTO.getPassword());
        User user = userService.createRequestToUser(userCreateDTO, hashedPassword);
        User createdUser = userService.createUser(user);

        return Response.status(Response.Status.CREATED).entity(createdUser).build();
    }

    /**
     * PUT /kudo-app/api/users/{id} - Update an existing user (name and role only, email is immutable)
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
     * {"userId":"36f6b7db-63c2-4d4a-aeac-0bf909295f7f","email":"john.doe@example.com","name":"John Updated Doe","role":"INSTRUCTOR"}
     */
    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") String idStr, @Valid UserDTO.UserData userUpdateDTO) throws SQLException {
        UUID userId = UUID.fromString(idStr);

        Optional<User> existingUser = userService.getUserById(userId);
        if (existingUser.isEmpty()) {
            throw new SQLException("User not found");
        }

        User user = existingUser.get();
        userService.updateUserFromUserData(user, userUpdateDTO);
        User updatedUser = userService.updateUser(userId, user);

        return Response.ok(updatedUser).build();
    }

    /**
     * DELETE /kudo-app/api/users/{id} - Delete a user (cascades to related records)
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
    @Path("{id}")
    public Response deleteUser(@PathParam("id") String idStr) throws SQLException {
        UUID userId = UUID.fromString(idStr);
        boolean deleted = userService.deleteUser(userId);

        if (!deleted) {
            throw new SQLException("User not found");
        }

        return Response.noContent().build();
    }

    // Password hashing placeholder
    private String hashPassword(String password) {
        return password;
    }
}