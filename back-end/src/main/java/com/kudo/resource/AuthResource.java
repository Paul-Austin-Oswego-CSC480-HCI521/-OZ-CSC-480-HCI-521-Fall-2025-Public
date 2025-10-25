package com.kudo.resource;

import com.kudo.dto.AuthDTO;
import com.kudo.filter.AuthenticationFilter;
import com.kudo.model.User;
import com.kudo.security.UserContext;
import com.kudo.service.OAuthService;
import com.kudo.util.JwtUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response getCurrentUser(@Context ContainerRequestContext requestContext) {
        try {
            UserContext userContext = AuthenticationFilter.getUserContext(requestContext);

            if (userContext == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("{\"error\": \"No user context found\"}")
                        .build();
            }

            AuthDTO.UserInfo userInfo = new AuthDTO.UserInfo(
                    userContext.getUser_id(),
                    userContext.getEmail(),
                    userContext.getName(),
                    userContext.getGoogle_id(),
                    userContext.getRole()
            );

            return Response.ok(userInfo).build();

        } catch (Exception e) {
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
}
