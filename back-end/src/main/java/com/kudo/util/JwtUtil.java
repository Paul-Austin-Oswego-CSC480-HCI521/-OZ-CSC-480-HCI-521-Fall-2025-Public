package com.kudo.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.kudo.model.User;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Date;
import java.util.UUID;

/**
 * JWT token generation and validation utility
 */
@ApplicationScoped
public class JwtUtil {

    private static final String SECRET = getRequiredSecret();
    private static final long EXPIRATION_HOURS = Long.parseLong(System.getenv().getOrDefault("JWT_EXPIRATION_HOURS", "24"));
    private static final String ISSUER = "kudo-app";
    private static final int MIN_SECRET_LENGTH = 32;

    private final Algorithm algorithm;
    private final JWTVerifier verifier;

    private static String getRequiredSecret() {
        String secret = System.getenv("JWT_SECRET");

        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalStateException(
                "FATAL: JWT_SECRET environment variable not set. " +
                "Please set JWT_SECRET with minimum " + MIN_SECRET_LENGTH + " characters."
            );
        }

        if (secret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException(
                "FATAL: JWT_SECRET too short (" + secret.length() + " chars). " +
                "Minimum " + MIN_SECRET_LENGTH + " characters required for HS256."
            );
        }

        String lowerSecret = secret.toLowerCase();
        if (lowerSecret.contains("default") ||
            lowerSecret.contains("secret") ||
            lowerSecret.contains("change") ||
            lowerSecret.contains("test") ||
            lowerSecret.contains("example")) {
            System.err.println("WARNING: JWT_SECRET appears to be a placeholder. Use a random secret in production.");
        }

        return secret;
    }

    public JwtUtil() {
        this.algorithm = Algorithm.HMAC256(SECRET);
        this.verifier = JWT.require(algorithm)
                .withIssuer(ISSUER)
                .acceptExpiresAt(0)
                .build();
    }

    /**
     * Generate JWT token for authenticated user
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + (EXPIRATION_HOURS * 60 * 60 * 1000));
        //Date expiresAt = new Date(now.getTime() + (60 * 1000));

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(user.getUser_id().toString())
                .withClaim("user_id", user.getUser_id().toString())
                .withClaim("email", user.getEmail())
                .withClaim("name", user.getName())
                .withClaim("google_id", user.getGoogle_id())
                .withClaim("role", user.getRole().name())
                .withIssuedAt(now)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        return verifier.verify(token);
    }

    public UUID getUserId(DecodedJWT decodedJWT) {
        return UUID.fromString(decodedJWT.getClaim("user_id").asString());
    }

    public String getEmail(DecodedJWT decodedJWT) {
        return decodedJWT.getClaim("email").asString();
    }

    public String getRole(DecodedJWT decodedJWT) {
        return decodedJWT.getClaim("role").asString();
    }

    public String getGoogleId(DecodedJWT decodedJWT) {
        return decodedJWT.getClaim("google_id").asString();
    }

    public String getName(DecodedJWT decodedJWT) {
        return decodedJWT.getClaim("name").asString();
    }
}
