#!/bin/bash

# Deployment script for Nikah Sufiyana Matrimonial
# This script ensures proper deployment without custom git commands

echo "Starting deployment process..."

# Ensure we're on the main branch
git checkout main

# Pull latest changes
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations if needed
echo "Running database migrations..."
npm run db:migrate || echo "Migration failed or not needed"

# Build the project
echo "Building the project..."
npm run build

# Check build status
if [ $? -eq 0 ]; then
    echo "Build successful! Project is ready for deployment."
else
    echo "Build failed! Please check the errors above."
    exit 1
fi

echo "Deployment preparation complete!"
