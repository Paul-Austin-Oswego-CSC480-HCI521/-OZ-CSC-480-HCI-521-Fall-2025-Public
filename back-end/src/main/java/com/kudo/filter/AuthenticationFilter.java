package com.kudo.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.kudo.model.User;
import com.kudo.security.UserContext;
import com.kudo.util.JwtUtil;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import jakarta.ws.rs.core.SecurityContext;
import java.security.Principal;
import java.util.UUID;


/**
 * Validates JWT tokens on all requests except /api/auth/**
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String USER_CONTEXT_PROPERTY = "userContext";

    @Inject
    private JwtUtil jwtUtil;

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String path = requestContext.getUriInfo().getPath();
        if (path.equals("/auth/google") || path.equals("/auth/health")){
            return;
        }

        String authHeader = requestContext.getHeaderString(AUTHORIZATION_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            abortWithUnauthorized(requestContext, "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty()) {
            abortWithUnauthorized(requestContext, "Empty token");
            return;
        }

        try {
            DecodedJWT decodedJWT = jwtUtil.validateToken(token);

            UUID user_id = jwtUtil.getUserId(decodedJWT);
            String email = jwtUtil.getEmail(decodedJWT);
            String name = jwtUtil.getName(decodedJWT);
            String google_id = jwtUtil.getGoogleId(decodedJWT);
            User.Role role = User.Role.valueOf(jwtUtil.getRole(decodedJWT));

            final UserContext userContext = new UserContext(user_id, email, name, google_id, role);
            requestContext.setProperty(USER_CONTEXT_PROPERTY, userContext);

            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() {
                    return userContext;
                }

                @Override
                public boolean isUserInRole(String roleString) {
                    return userContext.getRole().name().equals(roleString);
                }

                @Override
                public boolean isSecure() {
                    return requestContext.getUriInfo().getRequestUri().getScheme().equals("https");
                }

                @Override
                public String getAuthenticationScheme() {
                    return "Bearer";
                }
            });

        } catch (JWTVerificationException e) {
            System.out.println("JWT verification failed: " + e.getMessage());
            abortWithUnauthorized(requestContext, "Invalid or expired token: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            abortWithUnauthorized(requestContext, "Token validation error: " + e.getMessage());
        }
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
            Response.status(Response.Status.UNAUTHORIZED)
                .entity("{\"error\": \"" + message + "\"}")
                .build()
        );
    }

    /**
     * Extract UserContext from request
     */
    public static UserContext getUserContext(ContainerRequestContext requestContext) {
        return (UserContext) requestContext.getProperty(USER_CONTEXT_PROPERTY);
    }
}
