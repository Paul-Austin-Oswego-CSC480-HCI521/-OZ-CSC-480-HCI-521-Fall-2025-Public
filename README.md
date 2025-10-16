# CSC480/HCI521 Kudo Project

## Project Description 

<Project Description>

## Instructions to run this project

### Prerequisites & Notes
- Docker and Docker Compose
- Docker Desktop makes this much easier to manage
- For specifics on endpoints look at `Documentation/Backend/REST-API-Endpoints.md`
- Reach out to me (Duncan) if you need help with the docker setup end of things 

### Steps
1) make sure you have the latest version of this repository downloaded

2) Check if Docker is Installed
```bash
docker --version
docker-compose --version
```

3) Environment Configuation (this is done in the backend directory)
```bash
cd back-end
cp .env.example .env
cd ..
```

4) Application Startup (this must be done in the project root directory)
```bash
docker-compose up --build
```

**What happens on first run:**
- Npm downloads all dependencies and builds the frontend
- Maven downloads all dependencies and builds the backend
- PostgreSQL container creates database and user automatically
- Database schema is initialized from ALL files in `src/main/resources/db/migration/`
- Backend connects to database and starts
- Frontend connects to backend and starts

5) Stop Application (this must be done in the project root directory)
```bash
docker-compose down
```

### Database Information

**Data Persistence**
- Database data is stored in Docker volume `postgres_data`
- Data survives container restarts and rebuilds
- Schema migrations only run on first startup (empty database)


**Fresh database:**
```bash
docker-compose down -v
docker-compose up --build
```
