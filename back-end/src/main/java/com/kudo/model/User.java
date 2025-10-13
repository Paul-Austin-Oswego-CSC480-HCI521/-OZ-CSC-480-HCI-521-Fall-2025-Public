package com.kudo.model;

import java.util.UUID;
import jakarta.json.bind.annotation.JsonbProperty;
import jakarta.json.bind.annotation.JsonbTransient;
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
    
    @JsonbTransient
    private String password_hash;
    
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
    public User(String email, String name, String password_hash, Role role) {
        this.email = email;
        this.name = name;
        this.password_hash = password_hash;
        this.role = role;
    }

    // Constructor with UUID
    public User(UUID user_id, String email, String name, String password_hash, Role role) {
        this.user_id = user_id;
        this.email = email;
        this.name = name;
        this.password_hash = password_hash;
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

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
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