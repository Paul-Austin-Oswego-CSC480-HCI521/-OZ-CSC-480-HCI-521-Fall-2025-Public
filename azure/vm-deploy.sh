#!/bin/bash

# Deployment Script for Kudo Card Application on Azure VM
# This script deploys the application using Docker Compose

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying Kudo Card Application${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed!${NC}"
    echo "Please run: bash azure/vm-install-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed!${NC}"
    echo "Please run: bash azure/vm-install-docker.sh"
    exit 1
fi

# Check if user is in docker group (can run docker without sudo)
if ! groups | grep -q docker; then
    echo -e "${RED}Error: Current user is not in docker group!${NC}"
    echo "Please log out and log back in, or run: newgrp docker"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env not found in project root${NC}"

    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Creating .env from .env.example${NC}"
        cp .env.example .env
        echo -e "${RED}IMPORTANT: You must edit .env with your production values!${NC}"
        echo ""
        echo "Required configuration:"
        echo "  - POSTGRES_PASSWORD (strong password)"
        echo "  - GOOGLE_CLIENT_ID (from Google Cloud Console)"
        echo "  - JWT_SECRET (32+ character random string)"
        echo "  - CORS_ALLOWED_ORIGINS (your VM's public IP)"
        echo "  - REACT_APP_API_BASE_URL (your VM's public IP)"
        echo ""
        read -p "Press Enter after you've configured .env, or Ctrl+C to exit..."
    else
        echo -e "${RED}Error: No .env.example template found${NC}"
        echo "Please create .env manually in the project root"
        exit 1
    fi
fi

echo -e "${YELLOW}Checking .env file configuration...${NC}"

# Validate critical environment variables
REQUIRED_VARS=("POSTGRES_PASSWORD" "GOOGLE_CLIENT_ID" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env || grep -q "^$var=$" .env || grep -q "^$var=<" .env || grep -q "^$var=change-this" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}Error: The following required variables are not set in .env:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please edit .env in the project root and set these values"
    exit 1
fi

echo -e "${GREEN}✓ Environment configuration validated${NC}"
echo ""

# Stop any running containers
echo -e "${YELLOW}Stopping any running containers...${NC}"
docker-compose down > /dev/null 2>&1
echo -e "${GREEN}✓ Stopped existing containers${NC}"
echo ""

# Pull latest code (if git repo)
if [ -d ".git" ]; then
    echo -e "${YELLOW}Checking for updates...${NC}"
    CURRENT_BRANCH=$(git branch --show-current)
    echo "Current branch: $CURRENT_BRANCH"

    read -p "Pull latest changes from remote? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git pull
        if [ $? -ne 0 ]; then
            echo -e "${RED}Warning: git pull failed, continuing with local version${NC}"
        else
            echo -e "${GREEN}✓ Code updated${NC}"
        fi
    else
        echo "Skipping git pull"
    fi
    echo ""
fi

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
echo "This may take several minutes on first run..."
echo ""

docker-compose up --build -d

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start containers${NC}"
    echo ""
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Containers started successfully${NC}"
echo ""

# Wait for containers to be healthy
echo -e "${YELLOW}Waiting for containers to be ready...${NC}"
sleep 10

# Check container status
echo -e "${YELLOW}Container status:${NC}"
docker-compose ps

echo ""
echo -e "${YELLOW}Checking logs for errors...${NC}"
echo ""

# Check for database initialization
echo "Database (postgres):"
docker-compose logs postgres | grep -i "database system is ready to accept connections" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL may still be initializing${NC}"
fi

# Check for backend startup
echo "Backend:"
docker-compose logs backend | grep -i "smarter planet" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend (Liberty) is running${NC}"
else
    echo -e "${YELLOW}⚠ Backend may still be starting up${NC}"
fi

# Check for frontend startup
echo "Frontend:"
docker-compose logs frontend | grep -i "webpack compiled" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠ Frontend may still be starting up${NC}"
fi

echo ""

# Get VM public IP (if available from Azure metadata)
PUBLIC_IP=$(curl -s -H Metadata:true "http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2021-02-01&format=text" 2>/dev/null)

if [ -z "$PUBLIC_IP" ]; then
    # Fallback: try to get from environment or hostname
    PUBLIC_IP=$(hostname -I | awk '{print $1}')
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Application URLs:${NC}"
if [ ! -z "$PUBLIC_IP" ]; then
    echo "  Frontend:  http://$PUBLIC_IP:3000"
    echo "  Backend:   http://$PUBLIC_IP:9080/kudo-app/api"
else
    echo "  Frontend:  http://<your-vm-ip>:3000"
    echo "  Backend:   http://<your-vm-ip>:9080/kudo-app/api"
fi
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:          docker-compose logs -f"
echo "  View specific logs: docker-compose logs -f backend"
echo "  Stop application:   docker-compose down"
echo "  Restart:            docker-compose restart"
echo "  Update & redeploy:  bash azure/vm-deploy.sh"
echo ""
echo -e "${YELLOW}Management:${NC}"
echo "  Use the management script: bash azure/vm-manage.sh [command]"
echo "  Available commands: start, stop, restart, logs, update, backup"
echo ""
echo -e "${YELLOW}Important Next Steps:${NC}"
echo "  1. Verify the application is accessible from your browser"
echo "  2. Update Google OAuth redirect URIs in Google Cloud Console"
echo "  3. Test login and core functionality"
echo "  4. Set up automated backups (see azure/vm-manage.sh backup)"
echo ""
