#!/bin/bash

# ATSense Backend Deployment Script for Shared Hosting
# This script helps deploy the backend to a shared Linux hosting server

set -e  # Exit on error

echo "🚀 ATSense Backend Deployment Script"
echo "======================================"

# Configuration
BACKEND_DIR="$HOME/atsense-backend"
APP_NAME="atsense-api"
NODE_VERSION="16"  # Minimum required version

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Node.js is installed
echo ""
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js version $NODE_VERSION or higher"
    exit 1
fi

NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    print_error "Node.js version $NODE_CURRENT is too old. Required: $NODE_VERSION+"
    exit 1
fi
print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi
print_success "npm $(npm -v) detected"

# Create backend directory if it doesn't exist
echo ""
echo "Setting up backend directory..."
if [ ! -d "$BACKEND_DIR" ]; then
    mkdir -p "$BACKEND_DIR"
    print_success "Created directory: $BACKEND_DIR"
else
    print_warning "Directory already exists: $BACKEND_DIR"
fi

# Navigate to backend directory
cd "$BACKEND_DIR"

# Check if .env exists
echo ""
echo "Checking environment configuration..."
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    echo "Please create a .env file with your production configuration"
    echo "You can copy from .env.example and update the values"
    exit 1
fi
print_success ".env file found"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install --production
print_success "Dependencies installed"

# Check if PM2 is installed
echo ""
echo "Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found. Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 $(pm2 -v) detected"
fi

# Stop existing process if running
echo ""
echo "Checking for existing processes..."
if pm2 describe "$APP_NAME" &> /dev/null; then
    print_warning "Stopping existing process: $APP_NAME"
    pm2 stop "$APP_NAME"
    pm2 delete "$APP_NAME"
fi

# Start the application with PM2
echo ""
echo "Starting application..."
pm2 start server.js --name "$APP_NAME" --env production

# Save PM2 process list
pm2 save

# Display status
echo ""
echo "Application Status:"
pm2 status

# Setup PM2 startup script
echo ""
echo "Setting up PM2 to start on system boot..."
pm2 startup | tail -n 1 | bash || print_warning "Could not setup PM2 startup (may require sudo)"

# Display logs
echo ""
echo "Recent logs:"
pm2 logs "$APP_NAME" --lines 20 --nostream

echo ""
print_success "Deployment completed successfully!"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check application status"
echo "  pm2 logs $APP_NAME      - View logs"
echo "  pm2 restart $APP_NAME   - Restart application"
echo "  pm2 stop $APP_NAME      - Stop application"
echo "  pm2 monit               - Monitor resources"
echo ""
