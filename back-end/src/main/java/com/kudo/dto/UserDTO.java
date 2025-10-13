package com.kudo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

// User DTOs
public class UserDTO {

    // Request DTO for creating new users
    public static class CreateRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

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
        public CreateRequest(String email, String name, String password, String role) {
            this.email = sanitize(email);
            this.name = sanitize(name);
            this.password = sanitize(password);
            this.role = sanitize(role);
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = sanitize(email);
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
        private UUID user_id;
        private String email;

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
        public UserData(UUID user_id, String email, String name, String role) {
            this.user_id = user_id;
            this.email = sanitize(email);
            this.name = sanitize(name);
            this.role = sanitize(role);
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
            this.email = sanitize(email);
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