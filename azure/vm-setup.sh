#!/bin/bash

# Azure VM Setup Script for Kudo Card Application
# This script creates an Azure VM with all necessary configurations

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Azure VM Setup for Kudo Card Application${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configuration Variables (CUSTOMIZE THESE)
RESOURCE_GROUP="kudo-app-rg"
VM_NAME="kudo-app-vm"
LOCATION="westus2"  # Change to your preferred region
VM_SIZE="Standard_B2s"  # 2 vCPU, 4 GB RAM (~$30-40/month)
# VM_SIZE="Standard_B2ms"  # 2 vCPU, 8 GB RAM (~$60-80/month) - uncomment for more resources
IMAGE="Ubuntu2204"  # Ubuntu 22.04 LTS
ADMIN_USERNAME="azureuser"

echo -e "${YELLOW}Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  VM Name: $VM_NAME"
echo "  Location: $LOCATION"
echo "  VM Size: $VM_SIZE"
echo "  Admin Username: $ADMIN_USERNAME"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed!${NC}"
    echo "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo -e "${YELLOW}Checking Azure CLI login status...${NC}"
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}Not logged in to Azure. Please login:${NC}"
    az login
fi

# Display current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}Using Azure subscription: $SUBSCRIPTION${NC}"
echo ""

# Create Resource Group
echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create resource group${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Resource group created${NC}"
echo ""

# Create VM
echo -e "${YELLOW}Creating VM: $VM_NAME (this may take a few minutes)${NC}"
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image $IMAGE \
  --size $VM_SIZE \
  --admin-username $ADMIN_USERNAME \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --output table

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create VM${NC}"
    exit 1
fi
echo -e "${GREEN}✓ VM created successfully${NC}"
echo ""

# Get VM Public IP
echo -e "${YELLOW}Retrieving VM public IP address...${NC}"
PUBLIC_IP=$(az vm show -d \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --query publicIps -o tsv)

if [ -z "$PUBLIC_IP" ]; then
    echo -e "${RED}Failed to retrieve public IP${NC}"
    exit 1
fi
echo -e "${GREEN}✓ VM Public IP: $PUBLIC_IP${NC}"
echo ""

# Open required ports
echo -e "${YELLOW}Configuring Network Security Group (opening ports)...${NC}"
echo "  Opening port 22 (SSH)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 22 \
  --priority 1000 \
  --output none

echo "  Opening port 3000 (Frontend)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 3000 \
  --priority 1010 \
  --output none

echo "  Opening port 9080 (Backend HTTP)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 9080 \
  --priority 1020 \
  --output none

echo "  Opening port 9443 (Backend HTTPS)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 9443 \
  --priority 1030 \
  --output none

echo "  Opening port 80 (HTTP - for future use)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 80 \
  --priority 1040 \
  --output none

echo "  Opening port 443 (HTTPS - for future use)"
az vm open-port \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --port 443 \
  --priority 1050 \
  --output none

echo -e "${GREEN}✓ Ports configured${NC}"
echo ""

# Display connection information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}VM Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Connection Information:${NC}"
echo "  VM Name: $VM_NAME"
echo "  Public IP: $PUBLIC_IP"
echo "  SSH Command: ssh $ADMIN_USERNAME@$PUBLIC_IP"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. SSH into the VM:"
echo "     ssh $ADMIN_USERNAME@$PUBLIC_IP"
echo ""
echo "  2. Run the Docker installation script on the VM:"
echo "     curl -sSL https://raw.githubusercontent.com/<your-repo>/azure-production/azure/vm-install-docker.sh | bash"
echo "     (Or copy vm-install-docker.sh to the VM and run it)"
echo ""
echo "  3. Clone your repository and deploy:"
echo "     git clone <your-repo-url>"
echo "     cd CSC480"
echo "     bash azure/vm-deploy.sh"
echo ""
echo -e "${YELLOW}Application URLs (after deployment):${NC}"
echo "  Frontend: http://$PUBLIC_IP:3000"
echo "  Backend:  http://$PUBLIC_IP:9080/kudo-app/api"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "  - Save the SSH key located at: ~/.ssh/id_rsa (if generated)"
echo "  - Update your .env.production file with this IP: $PUBLIC_IP"
echo "  - Update Google OAuth redirect URIs with: http://$PUBLIC_IP:3000"
echo ""

# Save configuration to file
echo "VM_NAME=$VM_NAME" > azure/vm-config.sh
echo "RESOURCE_GROUP=$RESOURCE_GROUP" >> azure/vm-config.sh
echo "PUBLIC_IP=$PUBLIC_IP" >> azure/vm-config.sh
echo "ADMIN_USERNAME=$ADMIN_USERNAME" >> azure/vm-config.sh
echo "LOCATION=$LOCATION" >> azure/vm-config.sh
echo -e "${GREEN}✓ Configuration saved to azure/vm-config.sh${NC}"
echo ""
