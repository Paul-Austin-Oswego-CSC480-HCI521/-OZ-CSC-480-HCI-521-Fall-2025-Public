package com.kudo.service;

import com.kudo.model.User;
import com.kudo.dto.UserDTO;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// User service for database operations
@ApplicationScoped
public class UserService {

    @Resource(lookup = "jdbc/kudosdb")
    private DataSource dataSource;

    // Create user
    public User createUser(User user) throws SQLException {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        String sql = "INSERT INTO USERS (username, name, password_hash, role) VALUES (?, ?, ?, ?) RETURNING user_id";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getPasswordHash());
            stmt.setString(4, user.getRole().name());
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                user.setUserId((UUID) rs.getObject("user_id"));
                return user;
            }
            
            throw new SQLException("Failed to create user, no ID returned");
        }
    }

    // Get user by ID
    public Optional<User> getUserById(UUID userId) throws SQLException {
        if (userId == null) {
            return Optional.empty();
        }
        
        String sql = "SELECT user_id, username, name, password_hash, role FROM USERS WHERE user_id = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return Optional.of(mapResultSetToUser(rs));
            }
            
            return Optional.empty();
        }
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) throws SQLException {
        if (username == null || username.isEmpty()) {
            return Optional.empty();
        }

        String sql = "SELECT user_id, username, name, password_hash, role FROM USERS WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return Optional.of(mapResultSetToUser(rs));
            }
            
            return Optional.empty();
        }
    }

    // Get all users
    public List<User> getAllUsers() throws SQLException {
        String sql = "SELECT user_id, username, name, password_hash, role FROM USERS ORDER BY name";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            List<User> users = new ArrayList<>();
            
            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
            
            return users;
        }
    }

    // Get users by role
    public List<User> getUsersByRole(User.Role role) throws SQLException {
        String sql = "SELECT user_id, username, name, password_hash, role FROM USERS WHERE role = ? ORDER BY name";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, role.name());
            ResultSet rs = stmt.executeQuery();
            List<User> users = new ArrayList<>();
            
            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
            
            return users;
        }
    }

    // Update user
    public User updateUser(UUID userId, User updatedUser) throws SQLException {
        if (userId == null || updatedUser == null) {
            throw new IllegalArgumentException("UserId and updatedUser cannot be null");
        }
        
        String sql = "UPDATE USERS SET name = ?, role = ? WHERE user_id = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, updatedUser.getName());
            stmt.setString(2, updatedUser.getRole().name());
            stmt.setObject(3, userId);
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("User not found with ID: " + userId);
            }
            
            return getUserById(userId).orElseThrow(() -> 
                new SQLException("Failed to retrieve updated user"));
        }
    }

    // Delete user
    public boolean deleteUser(UUID userId) throws SQLException {
        if (userId == null) {
            return false;
        }
        
        String sql = "DELETE FROM USERS WHERE user_id = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setObject(1, userId);
            int affectedRows = stmt.executeUpdate();
            
            return affectedRows > 0;
        }
    }

    // Check if username exists
    public boolean existsByUsername(String username) throws SQLException {
        if (username == null || username.isEmpty()) {
            return false;
        }

        String sql = "SELECT 1 FROM USERS WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            
            return rs.next();
        }
    }

    // Convert DTO to User
    public User createRequestToUser(UserDTO.CreateRequest request, String hashedPassword) {
        if (request == null) {
            throw new IllegalArgumentException("CreateRequest cannot be null");
        }

        User.Role role = parseRole(request.getRole());

        return new User(
            request.getUsername(),
            request.getName(),
            hashedPassword,
            role
        );
    }

    // Update User from DTO
    public void updateUserFromUserData(User existingUser, UserDTO.UserData userData) {
        if (existingUser == null || userData == null) {
            throw new IllegalArgumentException("User and UserData cannot be null");
        }

        if (userData.getName() != null) {
            existingUser.setName(userData.getName());
        }

        if (userData.getRole() != null) {
            existingUser.setRole(parseRole(userData.getRole()));
        }
    }

    // Parse role string
    private User.Role parseRole(String roleString) {
        if (roleString == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }

        try {
            return User.Role.valueOf(roleString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleString + ". Valid roles: STUDENT, INSTRUCTOR");
        }
    }

    // Map ResultSet to User
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        return new User(
            (UUID) rs.getObject("user_id"),
            rs.getString("username"),
            rs.getString("name"),
            rs.getString("password_hash"),
            User.Role.valueOf(rs.getString("role"))
        );
    }
}