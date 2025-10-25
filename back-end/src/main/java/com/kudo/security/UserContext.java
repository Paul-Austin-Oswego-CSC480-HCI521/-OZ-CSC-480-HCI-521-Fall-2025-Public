package com.kudo.security;

import com.kudo.model.User;

import java.util.UUID;

/**
 * Authenticated user context injected by AuthenticationFilter
 */
public class UserContext {
    private final UUID user_id;
    private final String email;
    private final String name;
    private final String google_id;
    private final User.Role role;

    public UserContext(UUID user_id, String email, String name, String google_id, User.Role role) {
        this.user_id = user_id;
        this.email = email;
        this.name = name;
        this.google_id = google_id;
        this.role = role;
    }

    public UUID getUser_id() {
        return user_id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getGoogle_id() {
        return google_id;
    }

    public User.Role getRole() {
        return role;
    }

    public boolean isInstructor() {
        return role == User.Role.INSTRUCTOR;
    }

    public boolean isStudent() {
        return role == User.Role.STUDENT;
    }

    @Override
    public String toString() {
        return "UserContext{" +
                "user_id=" + user_id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                '}';
    }
}
