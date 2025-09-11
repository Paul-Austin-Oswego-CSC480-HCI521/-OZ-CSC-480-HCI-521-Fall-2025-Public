
# Multi-stage build: Maven build stage
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime stage: OpenLiberty
FROM icr.io/appcafe/open-liberty:kernel-slim-java21-openj9-ubi-minimal

COPY --chown=1001:0 /src/main/liberty/config /config

RUN features.sh

COPY --chown=1001:0 --from=build /app/target/*.war /config/apps

RUN configure.sh
