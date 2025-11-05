package com.kudo.service;

import com.kudo.dto.ClassDTO;
import com.kudo.model.User;
import com.kudo.dto.UserDTO;
import jakarta.annotation.Resource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.InternalServerErrorException;

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

    // Create OAuth user
    public User createOAuthUser(User user) throws SQLException {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        String sql = "INSERT INTO USERS (email, name, google_id, role) VALUES (?, ?, ?, ?) RETURNING user_id";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getEmail());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getGoogle_id());
            stmt.setString(4, user.getRole().name());

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                user.setUser_id((UUID) rs.getObject("user_id"));
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

        String sql = "SELECT user_id, email, name, google_id, role FROM USERS WHERE user_id = ?";

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


    // Get all users
    public List<User> getAllUsers() throws SQLException {
        String sql = "SELECT user_id, email, name, google_id, role FROM USERS ORDER BY name";

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
        String sql = "SELECT user_id, email, name, google_id, role FROM USERS WHERE role = ? ORDER BY name";

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

    // Get user by email
    public Optional<User> getUserByEmail(String email) throws SQLException {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }

        String sql = "SELECT user_id, email, name, google_id, role FROM USERS WHERE email = ?";

        try (Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email.trim());
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                User user = mapResultSetToUser(rs);
                return Optional.of(user);
            }
            return Optional.empty();
        }
    }

    // Get user by Google ID
    public Optional<User> getUserByGoogleId(String googleId) throws SQLException {
        if (googleId == null || googleId.isBlank()) {
            return Optional.empty();
        }

        String sql = "SELECT user_id, email, name, google_id, role FROM USERS WHERE google_id = ?";

        try (Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, googleId.trim());
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                User user = mapResultSetToUser(rs);
                return Optional.of(user);
            }
            return Optional.empty();
        }
    }

    // Update user's Google ID (for linking existing accounts)
    public User updateUserGoogleId(UUID userId, String googleId) throws SQLException {
        if (userId == null || googleId == null) {
            throw new IllegalArgumentException("UserId and googleId cannot be null");
        }

        String sql = "UPDATE USERS SET google_id = ? WHERE user_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, googleId);
            stmt.setObject(2, userId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("User not found with ID: " + userId);
            }

            return getUserById(userId).orElseThrow(() ->
                new SQLException("Failed to retrieve updated user"));
        }
    }


    // Check if email exists
    public boolean existsByEmail(String email) throws SQLException {
        if (email == null || email.isEmpty()) {
            return false;
        }

        String sql = "SELECT 1 FROM USERS WHERE email = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            return rs.next();
        }
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

    public ClassDTO.ClassIdList getUserClasses(UUID user_id, String enrollmentStatus, Boolean is_archived) {
        // Validate enrollment_status if provided
        if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
            if (!enrollmentStatus.equals("PENDING") && !enrollmentStatus.equals("APPROVED") && !enrollmentStatus.equals("DENIED")) {
                throw new IllegalArgumentException("Invalid enrollment_status. Must be PENDING, APPROVED, or DENIED");
            }
        }

        try (Connection conn = dataSource.getConnection()) {
            String sql = getFilteredUserClasses(enrollmentStatus, is_archived);

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setObject(1, user_id);
                if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
                    stmt.setString(2, enrollmentStatus);
                }

                try (ResultSet rs = stmt.executeQuery()) {
                    List<String> classIds = new ArrayList<>();
                    while (rs.next()) {
                        classIds.add(rs.getString("class_id"));
                    }

                    return new ClassDTO.ClassIdList(classIds);
                }
            }
        } catch (SQLException e) {
            throw new InternalServerErrorException("Database error");
        }
    }

    private static String getFilteredUserClasses(String enrollmentStatus, Boolean is_archived) {
        String sql = "SELECT USER_CLASSES.class_id FROM USER_CLASSES JOIN CLASSES ON USER_CLASSES.class_id = CLASSES.class_id WHERE user_id = ?";
        if (enrollmentStatus != null && !enrollmentStatus.isEmpty()) {
            sql += " AND enrollment_status = ?";
        } else {
            // Default to APPROVED for compatibility
            sql += " AND enrollment_status = 'APPROVED'";
        }

        //Default to False for compatibility


        if(is_archived == null) {
            is_archived = false;
        }
        sql += " AND end_date " + ((is_archived) ? "<" : ">=") + "CURRENT_TIMESTAMP";
        return sql;
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
            rs.getString("email"),
            rs.getString("name"),
            rs.getString("google_id"),
            User.Role.valueOf(rs.getString("role"))
        );
    }
}