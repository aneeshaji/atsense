#!/bin/bash

# ATSense Frontend Build Script for Shared Hosting
# This script builds the frontend for production deployment

set -e  # Exit on error

echo "🎨 ATSense Frontend Build Script"
echo "================================="

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

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in $FRONTEND_DIR"
    exit 1
fi

# Check if .env.production exists
echo ""
echo "Checking production environment..."
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found!"
    if [ -f ".env.production.example" ]; then
        echo "Creating .env.production from .env.production.example"
        cp .env.production.example .env.production
        print_warning "Please update .env.production with your production API URL"
        echo "Press Enter to continue or Ctrl+C to cancel..."
        read
    else
        print_error "No .env.production or .env.production.example found"
        exit 1
    fi
else
    print_success ".env.production found"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Build the application
echo ""
echo "Building production bundle..."
npm run build
print_success "Build completed"

# Check if dist directory was created
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

# Copy .htaccess to dist
echo ""
echo "Copying .htaccess to dist..."
if [ -f ".htaccess" ]; then
    cp .htaccess dist/
    print_success ".htaccess copied to dist/"
else
    print_warning ".htaccess not found - React Router may not work correctly"
fi

# Display build information
echo ""
echo "Build Summary:"
echo "=============="
echo "Build directory: $FRONTEND_DIR/dist"
echo "Total files: $(find dist -type f | wc -l)"
echo "Total size: $(du -sh dist | cut -f1)"
echo ""

print_success "Frontend build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Upload all files from 'dist/' to your server's public_html directory"
echo "2. Ensure .htaccess is uploaded for React Router support"
echo "3. Test your application at your domain"
echo ""
echo "Upload via FTP/SFTP:"
echo "  - Source: $FRONTEND_DIR/dist/*"
echo "  - Destination: /public_html/ (or /www/ or /htdocs/)"
echo ""
