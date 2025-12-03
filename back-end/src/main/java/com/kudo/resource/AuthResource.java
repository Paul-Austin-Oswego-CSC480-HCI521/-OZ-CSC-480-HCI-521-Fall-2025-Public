package com.kudo.resource;

import com.kudo.dto.AuthDTO;
import com.kudo.filter.AuthenticationFilter;
import com.kudo.model.User;
import com.kudo.security.UserContext;
import com.kudo.service.OAuthService;
import com.kudo.service.UserService;
import com.kudo.util.JwtUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.Optional;
import java.util.UUID;

/**
 * Authentication REST API endpoints
 */
@ApplicationScoped
@Path("auth")
public class AuthResource {

    @Inject
    private OAuthService oauthService;

    @Inject
    private JwtUtil jwtUtil;

    @Inject
    private UserService userService;

    /**
     * Authenticate with Google OAuth and return JWT token
     * POST /kudo-app/api/auth/google
     * Body: {"google_token": "...", "role": "STUDENT|INSTRUCTOR", "name": "..."}
     */
    @POST
    @Path("google")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticateWithGoogle(@Valid AuthDTO.GoogleAuthRequest request) {
        try {
            User user = oauthService.verifyAndGetUser(
                request.getGoogle_token(),
                request.getRole(),
                request.getName()
            );

            String jwtToken = jwtUtil.generateToken(user);
            AuthDTO.AuthResponse response = new AuthDTO.AuthResponse(jwtToken, user);

            return Response.ok(response).build();

        } catch (SecurityException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Authentication failed: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Get current authenticated user from JWT token
     * GET /kudo-app/api/auth/me
     * Headers: Authorization: Bearer <JWT token>
     */
    @GET
    @Path("me")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUser(@Context SecurityContext securityContext) {
        try {
            UserContext userContext = (UserContext) securityContext.getUserPrincipal();
            if (userContext == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("{\"error\": \"No user context found\"}")
                        .build();
            }
            
            AuthDTO.UserInfo userInfo = new AuthDTO.UserInfo(
                    userContext.getUser_id(),
                    userContext.getEmail(),
                    userContext.getUserName(),
                    userContext.getGoogle_id(),
                    userContext.getRole()
            );

            return Response.ok(userInfo).build();

        } catch (Exception e) {
            System.out.println(e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to retrieve user info: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Health check endpoint (no auth required)
     * GET /kudo-app/api/auth/health
     */
    @GET
    @Path("health")
    @Produces(MediaType.APPLICATION_JSON)
    public Response healthCheck() {
        return Response.ok("{\"status\": \"OK\", \"service\": \"OAuth Authentication\"}").build();
    }

    /**
     * Generate test JWT token for a given user ID (testing only)
     * POST /kudo-app/api/auth/test-token?user_id=<UUID>
     *
     * This endpoint is for testing purposes only.
     * Returns a JWT token for the specified user without requiring Google OAuth.
     */
    @POST
    @Path("test-token")
    @Produces(MediaType.TEXT_PLAIN)
    public Response generateTestToken(@QueryParam("user_id") String userId) {
        try {
            if (userId == null || userId.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("user_id query parameter is required")
                        .build();
            }

            UUID userUuid = UUID.fromString(userId);
            Optional<User> userOpt = userService.getUserById(userUuid);

            if (userOpt.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("User not found with ID: " + userId)
                        .build();
            }

            User user = userOpt.get();
            String jwtToken = jwtUtil.generateToken(user);

            return Response.ok(jwtToken).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid user_id format: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to generate token: " + e.getMessage())
                    .build();
        }
    }
}
