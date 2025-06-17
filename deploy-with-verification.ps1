# Nikah Sufiyana Deployment Script for Windows
# This script helps with deploying the site to Vercel and verifying it works correctly

# Colors for better output readability
$Green = @{ForegroundColor = 'Green'}
$Yellow = @{ForegroundColor = 'Yellow'}
$Red = @{ForegroundColor = 'Red'}
$Blue = @{ForegroundColor = 'Cyan'}

# Print banner
Write-Host "=======================================" @Blue
Write-Host "   Nikah Sufiyana Deployment Script    " @Blue
Write-Host "=======================================" @Blue

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Check if Vercel CLI is installed
if (-not (Test-CommandExists "vercel")) {
    Write-Host "Vercel CLI not found. Installing..." @Yellow
    npm install -g vercel
}

# Deployment steps
Write-Host "`nStep 1: Testing database connection" @Yellow
npx tsx scripts/check-db.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database connection failed. Please check your credentials and try again." @Red
    Write-Host "Have you updated the database password in NeonDB as specified in FINAL_MIGRATION_STEPS.md?" @Yellow
    exit 1
}

Write-Host "`nStep 2: Running security check" @Yellow
npm run security:check
if ($LASTEXITCODE -ne 0) {
    Write-Host "Security check failed. Please address any issues and try again." @Red
    exit 1
}

Write-Host "`nStep 3: Building the application locally to verify" @Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix the errors and try again." @Red
    exit 1
}

Write-Host "`nStep 4: Deploying to Vercel" @Yellow
Write-Host "This will deploy the application to production at https://nikahsufiyana.com" @Blue
$confirmation = Read-Host "Do you want to continue with deployment? (y/n)"
if ($confirmation -ne "y") {
    Write-Host "Deployment canceled." @Yellow
    exit 1
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." @Green
vercel --prod

# Verify deployment
Write-Host "`nStep 5: Verifying deployment" @Yellow
Write-Host "Waiting 30 seconds for deployment to complete..." @Blue
Start-Sleep -Seconds 30
node scripts/verify-deployment.js

# Final message
Write-Host "`nDeployment process complete!" @Green
Write-Host "Important next steps:" @Yellow
Write-Host "1. Manually verify critical user flows (registration, login, email verification)"
Write-Host "2. Check admin functionality"
Write-Host "3. Monitor the site for any issues"
Write-Host "`nRefer to FINAL_MIGRATION_STEPS.md for more details."
