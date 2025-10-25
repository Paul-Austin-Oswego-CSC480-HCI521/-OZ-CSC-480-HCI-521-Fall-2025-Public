package com.kudo.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.kudo.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.Optional;

/**
 * Service for handling Google OAuth authentication
 */
@ApplicationScoped
public class OAuthService {

    private static final String CLIENT_ID = getRequiredClientId();

    @Inject
    private UserService userService;

    private final GoogleIdTokenVerifier verifier;

    private static String getRequiredClientId() {
        String clientId = System.getenv("GOOGLE_CLIENT_ID");

        if (clientId == null || clientId.trim().isEmpty()) {
            throw new IllegalStateException(
                "FATAL: GOOGLE_CLIENT_ID environment variable not set. " +
                "Please set GOOGLE_CLIENT_ID from Google Cloud Console."
            );
        }

        if (!clientId.endsWith(".apps.googleusercontent.com")) {
            System.err.println(
                "WARNING: GOOGLE_CLIENT_ID does not match expected format (*.apps.googleusercontent.com)."
            );
        }

        return clientId.trim();
    }

    public OAuthService() {
        try {
            this.verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();
        } catch (GeneralSecurityException | IOException e) {
            throw new IllegalStateException(
                "FATAL: Failed to initialize Google OAuth verifier. " +
                "Cannot verify Google ID tokens.", e);
        }
    }

    /**
     * Verify Google ID token and create/retrieve user
     */
    public User verifyAndGetUser(String idTokenString, String requestedRole, String requestedName)
            throws GeneralSecurityException, IOException, SQLException {
        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new SecurityException("Invalid Google ID token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String googleId = payload.getSubject();
        String email = payload.getEmail();

        Boolean emailVerified = payload.getEmailVerified();
        if (emailVerified == null || !emailVerified) {
            throw new SecurityException("Email not verified by Google");
        }

        Optional<User> existingUser = userService.getUserByGoogleId(googleId);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        Optional<User> userByEmail = userService.getUserByEmail(email);
        if (userByEmail.isPresent()) {
            User user = userByEmail.get();
            user.setGoogle_id(googleId);
            return userService.updateUserGoogleId(user.getUser_id(), googleId);
        }

        String name = (requestedName != null && !requestedName.trim().isEmpty())
            ? requestedName.trim()
            : (String) payload.get("name");

        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name is required for new user registration");
        }

        if (requestedRole == null || requestedRole.trim().isEmpty()) {
            throw new IllegalArgumentException("Role is required for new user registration. Valid roles: STUDENT, INSTRUCTOR");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(requestedRole.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + requestedRole + ". Valid roles: STUDENT, INSTRUCTOR");
        }

        User newUser = new User(email, name, googleId, role);
        return userService.createOAuthUser(newUser);
    }

    /**
     * Extract user info from Google token without database operations
     */
    public GoogleUserInfo extractUserInfo(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new SecurityException("Invalid Google ID token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        return new GoogleUserInfo(
            payload.getSubject(),
            payload.getEmail(),
            (String) payload.get("name"),
            payload.getEmailVerified()
        );
    }

    public static class GoogleUserInfo {
        private final String googleId;
        private final String email;
        private final String name;
        private final Boolean emailVerified;

        public GoogleUserInfo(String googleId, String email, String name, Boolean emailVerified) {
            this.googleId = googleId;
            this.email = email;
            this.name = name;
            this.emailVerified = emailVerified;
        }

        public String getGoogleId() {
            return googleId;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public Boolean getEmailVerified() {
            return emailVerified;
        }
    }
}
