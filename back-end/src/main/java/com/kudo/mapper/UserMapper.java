package com.kudo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import com.kudo.dto.UserDTO;
import com.kudo.model.User;

@Mapper(componentModel = "cdi")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", source = "hashedPassword")
    @Mapping(target = "role", source = "createRequest.role", qualifiedByName = "stringToRole")
    User createRequestToUser(UserDTO.CreateRequest createRequest, String hashedPassword);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", source = "role", qualifiedByName = "stringToRole")
    User userDataToUser(UserDTO.UserData userData);

    @Mapping(target = "role", source = "role", qualifiedByName = "roleToString")
    UserDTO.UserData userToUserData(User user);

    @Named("stringToRole")
    default User.Role stringToRole(String role) {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        return User.Role.valueOf(role.toUpperCase());
    }

    @Named("roleToString")
    default String roleToString(User.Role role) {
        return role != null ? role.name() : null;
    }
}