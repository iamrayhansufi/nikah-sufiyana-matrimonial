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

# Deploy to Vercel if environment variables are available
if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    vercel deploy --prod \
      -e DATABASE_URL="postgres://neondb_owner:npg_nmcDAIqd5tv6@ep-nameless-feather-a4nvzzdp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" \
      -e JWT_SECRET="88d29539104ca3f556fd3058cc9189b7955fe4dec13823362381a611d63bede3" \
      -e NEXTAUTH_SECRET="35d21696e87e903f783560bf300f50d58e19cdd005360a2f95b857ab06b94276" \
      -e NEXTAUTH_URL="https://nikahsufiyana.com" \
      -e NEXTAUTH_URL_INTERNAL="https://nikahsufiyana.com" \
      -e VERCEL_URL="\${NEXTAUTH_URL}" \
      -e NEXTAUTH_PREVIEW_URLS="https://nikah-sufiyana-matrimonial-git-main-iamrayhansufis-projects.vercel.app" \
      -e NEXTAUTH_COOKIE_DOMAIN=".nikahsufiyana.com"
else
    echo "Vercel CLI not found. Install it with 'npm install -g vercel' to deploy directly."
fi

echo "Deployment preparation complete!"
