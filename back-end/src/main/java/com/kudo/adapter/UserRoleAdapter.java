package com.kudo.adapter;

import jakarta.json.bind.adapter.JsonbAdapter;
import com.kudo.model.User;

// User Role enum JSON adapter
public class UserRoleAdapter implements JsonbAdapter<User.Role, String> {

    // Enum to JSON
    @Override
    public String adaptToJson(User.Role role) throws Exception {
        return role != null ? role.name() : null;
    }

    // JSON to enum
    @Override
    public User.Role adaptFromJson(String value) throws Exception {
        if (value == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        
        try {
            return User.Role.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Invalid role: " + value + ". Valid roles: STUDENT, INSTRUCTOR"
            );
        }
    }
}