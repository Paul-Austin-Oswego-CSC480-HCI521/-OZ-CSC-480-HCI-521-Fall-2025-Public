# Database Setup

## Commands

Start PostgreSQL:
```bash
docker run --name kudos-postgres -e POSTGRES_USER=kudosuser -e POSTGRES_PASSWORD=kudospass -e POSTGRES_DB=kudosdb -p 5432:5432 -d postgres:16
```

Setup backend:
```bash
cd back-end
mvn dependency:copy-dependencies -DincludeArtifactIds=postgresql -DoutputDirectory=src/main/liberty/config/lib
mvn liberty:dev
```

Application: `http://localhost:9080/kudo-application`

## Schema

Manual schema creation if needed:
```bash
docker exec -it kudos-postgres psql -U kudosuser -d kudosdb
\i /path/to/back-end/src/main/resources/db/migration/V1__Initial_Schema.sql
```