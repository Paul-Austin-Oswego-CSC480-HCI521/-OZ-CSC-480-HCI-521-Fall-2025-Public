# Backend Development Setup

Quick setup guide for the backend.

## Prerequisites

- Docker and Docker Compose

### Check if Docker is Installed
```bash
docker --version
docker-compose --version
```

## Setup Steps

### 1. Environment Configuration
```bash
cd back-end
cp .env.example .env
```

### 2. Start Application
```bash
docker-compose up --build
```

**What happens on first run:**
- Maven downloads Java dependencies and builds application
- PostgreSQL container creates database and user automatically
- Database schema is initialized from ALL files in `src/main/resources/db/migration/`
- Application connects to database and starts


### 3. Stop Application
```bash
docker-compose down
```

## Database Information

### Data Persistence
- Database data is stored in Docker volume `postgres_data`
- Data survives container restarts and rebuilds
- Schema migrations only run on first startup (empty database)


**Fresh database:**
```bash
docker-compose down -v
docker-compose up --build
```