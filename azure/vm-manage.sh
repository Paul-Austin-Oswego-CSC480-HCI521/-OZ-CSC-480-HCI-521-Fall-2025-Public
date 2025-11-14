#!/bin/bash

# Management Script for Kudo Card Application on Azure VM
# Provides convenient commands for managing the application

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Display usage
usage() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Kudo Card Application Management${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC} $0 <command> [options]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  start          Start the application"
    echo "  stop           Stop the application"
    echo "  restart        Restart the application"
    echo "  status         Show container status"
    echo "  logs           View application logs (all services)"
    echo "  logs <service> View logs for specific service (backend, frontend, postgres)"
    echo "  update         Pull latest code and redeploy"
    echo "  backup         Create database backup"
    echo "  restore <file> Restore database from backup"
    echo "  clean          Remove stopped containers and unused images"
    echo "  shell <service> Open shell in container (backend, frontend, postgres)"
    echo "  ps             Show running containers"
    echo "  help           Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 backup"
    echo "  $0 restore backup_20250104_120000.sql"
    echo ""
}

# Check if docker-compose is available
check_docker() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed${NC}"
        exit 1
    fi
}

# Start application
cmd_start() {
    echo -e "${YELLOW}Starting Kudo Card application...${NC}"
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application started${NC}"
        cmd_status
    else
        echo -e "${RED}✗ Failed to start application${NC}"
        exit 1
    fi
}

# Stop application
cmd_stop() {
    echo -e "${YELLOW}Stopping Kudo Card application...${NC}"
    docker-compose down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application stopped${NC}"
    else
        echo -e "${RED}✗ Failed to stop application${NC}"
        exit 1
    fi
}

# Restart application
cmd_restart() {
    echo -e "${YELLOW}Restarting Kudo Card application...${NC}"
    docker-compose restart
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application restarted${NC}"
        cmd_status
    else
        echo -e "${RED}✗ Failed to restart application${NC}"
        exit 1
    fi
}

# Show status
cmd_status() {
    echo -e "${YELLOW}Container Status:${NC}"
    docker-compose ps
    echo ""

    # Check if containers are healthy
    POSTGRES_RUNNING=$(docker-compose ps -q postgres 2>/dev/null)
    BACKEND_RUNNING=$(docker-compose ps -q backend 2>/dev/null)
    FRONTEND_RUNNING=$(docker-compose ps -q frontend 2>/dev/null)

    echo -e "${YELLOW}Health Check:${NC}"
    if [ ! -z "$POSTGRES_RUNNING" ]; then
        echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
        echo -e "${RED}✗ PostgreSQL is not running${NC}"
    fi

    if [ ! -z "$BACKEND_RUNNING" ]; then
        echo -e "${GREEN}✓ Backend is running${NC}"
    else
        echo -e "${RED}✗ Backend is not running${NC}"
    fi

    if [ ! -z "$FRONTEND_RUNNING" ]; then
        echo -e "${GREEN}✓ Frontend is running${NC}"
    else
        echo -e "${RED}✗ Frontend is not running${NC}"
    fi
}

# View logs
cmd_logs() {
    local service=$1
    if [ -z "$service" ]; then
        echo -e "${YELLOW}Showing logs for all services (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
    else
        echo -e "${YELLOW}Showing logs for $service (Ctrl+C to exit)...${NC}"
        docker-compose logs -f "$service"
    fi
}

# Update and redeploy
cmd_update() {
    echo -e "${YELLOW}Updating application...${NC}"

    # Pull latest code if git repo
    if [ -d ".git" ]; then
        echo "Pulling latest code..."
        git pull
        if [ $? -ne 0 ]; then
            echo -e "${RED}Warning: git pull failed${NC}"
            read -p "Continue with existing code? (y/n) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi

    # Rebuild and restart
    echo "Rebuilding containers..."
    docker-compose up --build -d

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application updated and redeployed${NC}"
        cmd_status
    else
        echo -e "${RED}✗ Update failed${NC}"
        exit 1
    fi
}

# Backup database
cmd_backup() {
    echo -e "${YELLOW}Creating database backup...${NC}"

    # Create backups directory if it doesn't exist
    mkdir -p ~/kudo-backups

    # Generate backup filename with timestamp
    BACKUP_FILE=~/kudo-backups/kudo_db_$(date +%Y%m%d_%H%M%S).sql

    # Create backup
    docker exec kudos-postgres pg_dump -U kudos_user kudos_db > "$BACKUP_FILE"

    if [ $? -eq 0 ]; then
        # Compress backup
        gzip "$BACKUP_FILE"
        echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE}.gz${NC}"

        # Show backup size
        SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
        echo "  Size: $SIZE"

        # List recent backups
        echo ""
        echo -e "${YELLOW}Recent backups:${NC}"
        ls -lh ~/kudo-backups/ | tail -n 5
    else
        echo -e "${RED}✗ Backup failed${NC}"
        exit 1
    fi
}

# Restore database
cmd_restore() {
    local backup_file=$1

    if [ -z "$backup_file" ]; then
        echo -e "${RED}Error: Backup file not specified${NC}"
        echo "Usage: $0 restore <backup-file>"
        echo ""
        echo "Available backups:"
        ls -1 ~/kudo-backups/ 2>/dev/null || echo "  No backups found"
        exit 1
    fi

    # Check if file exists
    if [ ! -f "$backup_file" ]; then
        # Try with ~/kudo-backups/ prefix
        backup_file=~/kudo-backups/$backup_file
        if [ ! -f "$backup_file" ]; then
            echo -e "${RED}Error: Backup file not found${NC}"
            exit 1
        fi
    fi

    echo -e "${RED}WARNING: This will replace the current database!${NC}"
    read -p "Are you sure you want to restore from backup? (yes/no) " -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Restore cancelled"
        exit 0
    fi

    echo -e "${YELLOW}Restoring database from backup...${NC}"

    # Decompress if needed
    if [[ $backup_file == *.gz ]]; then
        echo "Decompressing backup..."
        gunzip -c "$backup_file" | docker exec -i kudos-postgres psql -U kudos_user kudos_db
    else
        cat "$backup_file" | docker exec -i kudos-postgres psql -U kudos_user kudos_db
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database restored successfully${NC}"
        echo "Restarting backend to apply changes..."
        docker-compose restart backend
    else
        echo -e "${RED}✗ Restore failed${NC}"
        exit 1
    fi
}

# Clean up Docker resources
cmd_clean() {
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    echo ""

    echo "Removing stopped containers..."
    docker-compose rm -f

    echo "Removing unused images..."
    docker image prune -f

    echo "Removing unused volumes..."
    docker volume prune -f

    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# Open shell in container
cmd_shell() {
    local service=$1

    if [ -z "$service" ]; then
        echo -e "${RED}Error: Service not specified${NC}"
        echo "Usage: $0 shell <service>"
        echo "Services: backend, frontend, postgres"
        exit 1
    fi

    case $service in
        backend)
            echo -e "${YELLOW}Opening shell in backend container...${NC}"
            docker-compose exec backend /bin/bash
            ;;
        frontend)
            echo -e "${YELLOW}Opening shell in frontend container...${NC}"
            docker-compose exec frontend /bin/sh
            ;;
        postgres)
            echo -e "${YELLOW}Opening PostgreSQL shell...${NC}"
            docker-compose exec postgres psql -U kudos_user kudos_db
            ;;
        *)
            echo -e "${RED}Error: Unknown service '$service'${NC}"
            echo "Available services: backend, frontend, postgres"
            exit 1
            ;;
    esac
}

# Show running containers
cmd_ps() {
    docker-compose ps
}

# Main command handler
main() {
    local command=$1
    shift

    check_docker

    case $command in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$@"
            ;;
        update)
            cmd_update
            ;;
        backup)
            cmd_backup
            ;;
        restore)
            cmd_restore "$@"
            ;;
        clean)
            cmd_clean
            ;;
        shell)
            cmd_shell "$@"
            ;;
        ps)
            cmd_ps
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            if [ -z "$command" ]; then
                usage
            else
                echo -e "${RED}Error: Unknown command '$command'${NC}"
                echo ""
                usage
            fi
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
