package com.kudo.dto;

import com.kudo.model.User;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

/**
 * Authentication data transfer objects
 */
public class AuthDTO {

    public static class GoogleAuthRequest {
        @NotBlank(message = "Google token is required")
        @JsonbProperty("google_token")
        private String google_token;

        @JsonbProperty("role")
        private String role;

        @JsonbProperty("name")
        private String name;

        public GoogleAuthRequest() {}

        public GoogleAuthRequest(String google_token) {
            this.google_token = google_token;
        }

        public String getGoogle_token() {
            return google_token;
        }

        public void setGoogle_token(String google_token) {
            this.google_token = google_token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class AuthResponse {
        @JsonbProperty("token")
        private String token;

        @JsonbProperty("user")
        private UserInfo user;

        public AuthResponse() {}

        public AuthResponse(String token, User user) {
            this.token = token;
            this.user = new UserInfo(
                    user.getUser_id(),
                    user.getEmail(),
                    user.getName(),
                    user.getGoogle_id(),
                    user.getRole()
            );
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public UserInfo getUser() {
            return user;
        }

        public void setUser(UserInfo user) {
            this.user = user;
        }
    }

    public static class UserInfo {
        @JsonbProperty("user_id")
        private UUID user_id;

        @JsonbProperty("email")
        private String email;

        @JsonbProperty("name")
        private String name;

        @JsonbProperty("google_id")
        private String google_id;

        @JsonbProperty("role")
        private User.Role role;

        public UserInfo() {}

        public UserInfo(UUID user_id, String email, String name, String google_id, User.Role role) {
            this.user_id = user_id;
            this.email = email;
            this.name = name;
            this.google_id = google_id;
            this.role = role;
        }

        public UUID getUser_id() {
            return user_id;
        }

        public void setUser_id(UUID user_id) {
            this.user_id = user_id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getGoogle_id() {
            return google_id;
        }

        public void setGoogle_id(String google_id) {
            this.google_id = google_id;
        }

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
        }
    }
}
