package com.kudo.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.sql.SQLException;

@Provider // Global exception handler for all REST endpoints
public class ExceptionMapper implements jakarta.ws.rs.ext.ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        if (e instanceof SQLException) {
            return e.getMessage().contains("User not found")
                ? Response.status(404).entity("User not found").build()
                : Response.status(500).entity("Database error").build();
        }
        if (e instanceof IllegalArgumentException) {
            return Response.status(400).entity(e.getMessage()).build();
        }
        if (e instanceof IllegalStateException) {
            return Response.status(409).entity(e.getMessage()).build();
        }
        return Response.status(500).entity("Internal error").build();
    }
}