package com.kudo.dto;

import java.util.UUID;

public class UserDTO {

    // Request DTO for creating new users
    public static class CreateRequest {
        private String username;
        private String name;
        private String password;
        private String role;

        public CreateRequest() {}

        public CreateRequest(String username, String name, String password, String role) {
            this.username = username;
            this.name = name;
            this.password = password;
            this.role = role;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

    }

    //  DTO for both update requests and responses
    public static class UserData {
        private UUID userId;
        private String username;
        private String name;
        private String role;

        public UserData() {}

        public UserData(String name, String role) {
            this.name = name;
            this.role = role;
        }

        public UserData(UUID userId, String username, String name, String role) {
            this.userId = userId;
            this.username = username;
            this.name = name;
            this.role = role;
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
            this.username = username;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}