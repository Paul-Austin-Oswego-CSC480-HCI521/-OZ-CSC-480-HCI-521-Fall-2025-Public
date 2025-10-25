package com.kudo.filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

import java.util.Arrays;
import java.util.List;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    // Configure allowed origins from environment variable
    // Supports multiple origins separated by commas
    private static final String ALLOWED_ORIGINS = System.getenv()
        .getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:3000");

    private static final List<String> ALLOWED_ORIGIN_LIST =
        Arrays.asList(ALLOWED_ORIGINS.split(","));

    @Override
    public void filter(ContainerRequestContext requestContext,
                      ContainerResponseContext responseContext) {

        String requestOrigin = requestContext.getHeaderString("Origin");

        if (requestOrigin != null && ALLOWED_ORIGIN_LIST.contains(requestOrigin.trim())) {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", requestOrigin);
        } else if (requestOrigin != null) {
            System.out.println("CORS: Blocked origin: " + requestOrigin);
        }

        responseContext.getHeaders().add("Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");

        responseContext.getHeaders().add("Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Requested-With, Accept, Origin");

        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");

        responseContext.getHeaders().add("Access-Control-Max-Age", "3600");
    }
}
