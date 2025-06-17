# !/bin/bash

# Nikah Sufiyana Deployment Script
# This script helps with deploying the site to Vercel and verifying it works correctly

# Colors for better output readability
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# Print banner
echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   Nikah Sufiyana Deployment Script    ${NC}"
echo -e "${BLUE}=======================================${NC}"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Vercel CLI is installed
if ! command_exists vercel; then
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
fi

# Deployment steps
echo -e "\n${YELLOW}Step 1: Testing database connection${NC}"
npx tsx scripts/check-db.ts
if [ $? -ne 0 ]; then
  echo -e "${RED}Database connection failed. Please check your credentials and try again.${NC}"
  echo -e "${YELLOW}Have you updated the database password in NeonDB as specified in FINAL_MIGRATION_STEPS.md?${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 2: Running security check${NC}"
npm run security:check
if [ $? -ne 0 ]; then
  echo -e "${RED}Security check failed. Please address any issues and try again.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 3: Building the application locally to verify${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Step 4: Deploying to Vercel${NC}"
echo -e "${BLUE}This will deploy the application to production at https://nikahsufiyana.com${NC}"
read -p "Do you want to continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Deployment canceled.${NC}"
  exit 1
fi

# Deploy to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
vercel --prod

# Verify deployment
echo -e "\n${YELLOW}Step 5: Verifying deployment${NC}"
echo -e "${BLUE}Waiting 30 seconds for deployment to complete...${NC}"
sleep 30
node scripts/verify-deployment.js

# Final message
echo -e "\n${GREEN}Deployment process complete!${NC}"
echo -e "${YELLOW}Important next steps:${NC}"
echo -e "1. Manually verify critical user flows (registration, login, email verification)"
echo -e "2. Check admin functionality"
echo -e "3. Monitor the site for any issues"
echo -e "\nRefer to FINAL_MIGRATION_STEPS.md for more details."
