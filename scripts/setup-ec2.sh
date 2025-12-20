#!/bin/bash

# ATSense EC2 Setup Script (Multi-OS Support)
# Target OS: Amazon Linux 2023 (RPM) or Ubuntu/Debian (DEB)
# Instance IP: 18.60.186.214

echo "🚀 Starting Manual ATSense Setup..."

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    OS=$(uname -s)
fi

echo "📋 Detected OS: $OS"

# 1. Update System and Install Base Utilities
echo "🔄 Updating system packages..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt-get update -y
    sudo apt-get install -y curl git gnupg
    PKGR="apt-get"
else
    sudo dnf update -y
    sudo dnf install -y curl git
    PKGR="dnf"
fi

# 2. Add Swap Memory (CRITICAL for t3.micro 1GB RAM)
echo "💾 Adding 2GB Swap Memory..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap memory enabled."
else
    echo "ℹ️ Swap file already exists."
fi

# 3. Install Node.js (v20)
echo "📦 Installing Node.js 20..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get update -y
    sudo apt-get install -y nodejs
else
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
fi

# 4. Install PM2 & Nginx
echo "📦 Installing PM2 and Nginx..."
sudo npm install -g pm2
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt-get install -y nginx
else
    sudo dnf install -y nginx
fi
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Install OCR Dependencies (Poppler & Tesseract)
echo "📦 Installing Poppler and Tesseract for OCR..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt-get install -y poppler-utils tesseract-ocr
else
    sudo dnf install -y poppler-utils tesseract
fi

# 6. Clone Repository
echo "📂 Cloning repository..."
PROJECT_DIR="$HOME/atsense"
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "🚚 Downloading fresh project files..."
    # If folder exists but isn't a git repo, we need to clone into it
    # Git won't clone into a non-empty directory, so we handle it:
    if [ -d "$PROJECT_DIR" ]; then rm -rf "$PROJECT_DIR"; fi
    git clone https://github.com/aneeshaji/atsense "$PROJECT_DIR"
else
    echo "ℹ️ Project already cloned. Pulling latest changes..."
    cd "$PROJECT_DIR" && git pull
fi

# 7. Create Environment Placeholder
echo "📝 Creating environment template..."
mkdir -p $PROJECT_DIR/backend
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cat <<EOF > $PROJECT_DIR/backend/.env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_random_secret_string
OPENAI_API_KEY=your_openai_api_key
EOF
fi

# 8. Configure Nginx
echo "🌐 Configuring Nginx..."
# Prompt for Domain if possible, otherwise use IP
SERVER_NAME="18.60.186.214" # Default, user can edit atsense.conf manually

# Update the config file to use the current user's home directory
sed -i "s|/home/ubuntu/atsense/frontend/dist|/home/$USER/atsense/frontend/dist|g" "$PROJECT_DIR/nginx/atsense.conf"

echo "⚠️  Existing App Check: Nginx configs live in /etc/nginx/conf.d/"
echo "Moving atsense.conf to /etc/nginx/conf.d/atsense.conf"
sudo cp "$PROJECT_DIR/nginx/atsense.conf" /etc/nginx/conf.d/atsense.conf
sudo nginx -t && sudo systemctl reload nginx

# 9. Permissions
sudo chown -R $USER:$USER $PROJECT_DIR

# 10. Final Instructions
echo "--------------------------------------------------"
echo "✅ SERVER READY (COEXISTENCE MODE)!"
echo "--------------------------------------------------"
echo "Next Steps for Multiple Apps:"
echo "1. PORTS: If your other app uses 5000, edit $PROJECT_DIR/backend/.env PORT."
echo "2. DOMAINS: Edit /etc/nginx/conf.d/atsense.conf server_name to your domain."
echo "   Doing this prevents ATSense from interfering with your other app."
echo "3. Backend: cd $PROJECT_DIR/backend && npm install && pm2 start server.js --name atsense-backend"
echo "4. Frontend: cd $PROJECT_DIR/frontend && npm install && npm run build"
echo ""
echo "🚀 ATSense is now living alongside your other app!"
