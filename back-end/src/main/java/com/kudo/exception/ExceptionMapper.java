package com.kudo.exception;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.sql.SQLException;

@Provider // Global exception handler for all REST endpoints
public class ExceptionMapper implements jakarta.ws.rs.ext.ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        if (e instanceof SQLException) {
            return e.getMessage().contains("User not found")
                //old code
                //? Response.status(404).entity("User not found").build()
                //: Response.status(500).entity("Database error").build();
                ? new WebApplicationException(e.getMessage(), 404).getResponse()
                : new ServerErrorException(e.getMessage(), 500).getResponse();
        }
        if (e instanceof IllegalArgumentException) {
            return new WebApplicationException(e.getMessage(), 400).getResponse();
        }
        if (e instanceof IllegalStateException) {
            return new WebApplicationException(e.getMessage(), 409).getResponse();
        }
        if(e instanceof NotFoundException) {
            return ((NotFoundException) e).getResponse();
        }
        return new ServerErrorException(e.getMessage(), 500).getResponse();
    }
}