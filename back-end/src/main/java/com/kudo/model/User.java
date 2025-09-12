package com.kudo.model;

import java.util.UUID;

public class User {
    private UUID userId;
    private String username;
    private String name;
    private String passwordHash;
    private Role role;

    public enum Role {
        STUDENT, INSTRUCTOR
    }

    public User() {}

    public User(String username, String name, String passwordHash, Role role) {
        this.username = username;
        this.name = name;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public User(UUID userId, String username, String name, String passwordHash, Role role) {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.passwordHash = passwordHash;
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                '}';
    }
}