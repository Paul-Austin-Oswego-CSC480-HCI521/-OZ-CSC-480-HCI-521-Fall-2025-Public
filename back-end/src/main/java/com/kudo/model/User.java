package com.kudo.model;

import java.util.UUID;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.json.bind.annotation.JsonbTypeAdapter;
import com.kudo.adapter.UserRoleAdapter;

// User entity model
public class User {
    @JsonbProperty("user_id")
    private UUID userId;
    
    @JsonbProperty("email")
    private String email;
    
    @JsonbProperty("name")
    private String name;
    
    @JsonbTransient
    private String passwordHash;
    
    @JsonbProperty("role")
    @JsonbTypeAdapter(UserRoleAdapter.class)
    private Role role;

    // User role enum
    public enum Role {
        STUDENT, INSTRUCTOR
    }

    // Default constructor
    public User() {}

    // Constructor for new users
    public User(String email, String name, String passwordHash, Role role) {
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // Constructor with UUID
    public User(UUID userId, String email, String name, String passwordHash, Role role) {
        this.userId = userId;
        this.email = email;
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
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                '}';
    }
}