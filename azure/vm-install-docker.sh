#!/bin/bash

# Docker Installation Script for Azure VM
# Installs Docker, Docker Compose, and Git on Ubuntu

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installing Docker & Docker Compose${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please do not run this script as root (without sudo)${NC}"
    echo "The script will use sudo when needed"
    exit 1
fi

# Update package index
echo -e "${YELLOW}Updating package index...${NC}"
sudo apt update
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to update package index${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Package index updated${NC}"
echo ""

# Install prerequisite packages
echo -e "${YELLOW}Installing prerequisite packages...${NC}"
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install prerequisites${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prerequisites installed${NC}"
echo ""

# Check if Docker is already installed
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${YELLOW}Docker is already installed: $DOCKER_VERSION${NC}"
    echo -e "${YELLOW}Skipping Docker installation${NC}"
    echo ""
else
    # Add Docker's official GPG key
    echo -e "${YELLOW}Adding Docker GPG key...${NC}"
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo -e "${GREEN}✓ Docker GPG key added${NC}"
    echo ""

    # Set up Docker repository
    echo -e "${YELLOW}Setting up Docker repository...${NC}"
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    echo -e "${GREEN}✓ Docker repository configured${NC}"
    echo ""

    # Update package index with Docker packages
    echo -e "${YELLOW}Updating package index with Docker packages...${NC}"
    sudo apt update
    echo -e "${GREEN}✓ Package index updated${NC}"
    echo ""

    # Install Docker Engine
    echo -e "${YELLOW}Installing Docker Engine...${NC}"
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Docker${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker Engine installed${NC}"
    echo ""

    # Start and enable Docker service
    echo -e "${YELLOW}Starting Docker service...${NC}"
    sudo systemctl enable docker
    sudo systemctl start docker
    echo -e "${GREEN}✓ Docker service started and enabled${NC}"
    echo ""
fi

# Check if Docker Compose is already installed
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${YELLOW}Docker Compose is already installed: $COMPOSE_VERSION${NC}"
    echo -e "${YELLOW}Skipping Docker Compose installation${NC}"
    echo ""
else
    # Install Docker Compose (standalone)
    echo -e "${YELLOW}Installing Docker Compose (standalone)...${NC}"
    sudo apt install -y docker-compose
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Docker Compose${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
    echo ""
fi

# Add current user to docker group
echo -e "${YELLOW}Adding $USER to docker group...${NC}"
sudo usermod -aG docker $USER
echo -e "${GREEN}✓ User added to docker group${NC}"
echo ""

# Verify installation
echo -e "${YELLOW}Verifying installation...${NC}"
DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker-compose --version)
GIT_VERSION=$(git --version)

echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
echo -e "${GREEN}✓ Docker Compose: $COMPOSE_VERSION${NC}"
echo -e "${GREEN}✓ Git: $GIT_VERSION${NC}"
echo ""

# Test Docker
echo -e "${YELLOW}Testing Docker with hello-world...${NC}"
sudo docker run hello-world > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker is working correctly${NC}"
else
    echo -e "${RED}✗ Docker test failed${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: You need to log out and log back in${NC}"
echo -e "${YELLOW}for the docker group membership to take effect.${NC}"
echo ""
echo -e "${YELLOW}After logging back in, verify Docker works without sudo:${NC}"
echo "  docker ps"
echo "  docker-compose --version"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Log out: exit"
echo "  2. Log back in: ssh <username>@<vm-ip>"
echo "  3. Clone your repository:"
echo "     git clone <your-repo-url>"
echo "  4. Deploy the application:"
echo "     cd CSC480"
echo "     bash azure/vm-deploy.sh"
echo ""
