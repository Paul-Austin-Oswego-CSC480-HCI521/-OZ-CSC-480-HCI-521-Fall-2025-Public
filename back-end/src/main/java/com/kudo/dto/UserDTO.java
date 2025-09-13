package com.kudo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

// User DTOs
public class UserDTO {

    // Request DTO for creating new users
    public static class CreateRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        private String name;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "STUDENT|INSTRUCTOR", message = "Role must be STUDENT or INSTRUCTOR")
        private String role;

        // Default constructor
        public CreateRequest() {}

        // Full constructor
        public CreateRequest(String username, String name, String password, String role) {
            this.username = sanitize(username);
            this.name = sanitize(name);
            this.password = sanitize(password);
            this.role = sanitize(role);
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = sanitize(username);
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = sanitize(name);
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = sanitize(password);
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = sanitize(role);
        }

    }

    //  DTO for both update requests and responses
    public static class UserData {
        private UUID userId;
        private String username;

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        private String name;

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "STUDENT|INSTRUCTOR", message = "Role must be STUDENT or INSTRUCTOR")
        private String role;

        // Default constructor
        public UserData() {}

        // Update constructor
        public UserData(String name, String role) {
            this.name = sanitize(name);
            this.role = sanitize(role);
        }

        // Full data constructor
        public UserData(UUID userId, String username, String name, String role) {
            this.userId = userId;
            this.username = sanitize(username);
            this.name = sanitize(name);
            this.role = sanitize(role);
        }


        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = sanitize(username);
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = sanitize(name);
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = sanitize(role);
        }
    }

    // Standardized input sanitization
    private static String sanitize(String input) {
        return input != null ? input.trim() : null;
    }
}