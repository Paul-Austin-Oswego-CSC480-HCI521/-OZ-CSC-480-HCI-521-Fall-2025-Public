package com.kudo.model;

import java.util.UUID;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTypeAdapter;
import com.kudo.adapter.UserRoleAdapter;

// User entity model
public class User {
    @JsonbProperty("user_id")
    private UUID user_id;

    @JsonbProperty("email")
    private String email;

    @JsonbProperty("name")
    private String name;

    @JsonbProperty("google_id")
    private String google_id;

    @JsonbProperty("role")
    @JsonbTypeAdapter(UserRoleAdapter.class)
    private Role role;

    // User role enum
    public enum Role {
        STUDENT, INSTRUCTOR
    }

    // Default constructor
    public User() {}

    // Constructor for new OAuth users
    public User(String email, String name, String google_id, Role role) {
        this.email = email;
        this.name = name;
        this.google_id = google_id;
        this.role = role;
    }

    // Constructor with UUID (for database retrieval)
    public User(UUID user_id, String email, String name, String google_id, Role role) {
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + user_id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                '}';
    }
}