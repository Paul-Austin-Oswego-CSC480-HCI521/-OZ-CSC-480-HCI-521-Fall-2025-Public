package com.kudo.filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                      ContainerResponseContext responseContext) {

        responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");

        responseContext.getHeaders().add("Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS, HEAD");

        responseContext.getHeaders().add("Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Requested-With, Accept, Origin");

        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");

        responseContext.getHeaders().add("Access-Control-Max-Age", "3600");
    }
}
