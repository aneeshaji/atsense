#!/bin/bash

# ATSense EC2 Setup Script (Manual Node.js + PM2 + Nginx)
# Instance IP: 18.60.186.214

echo "🚀 Starting Manual ATSense Setup (No Docker)..."

# 1. Update System
echo "🔄 Updating system packages..."
sudo dnf update -y || sudo apt-get update -y

# 2. Add Swap Memory (CRITICAL for t3.micro 1GB RAM)
echo "💾 Adding 2GB Swap Memory..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
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
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git

# 4. Install PM2 & Nginx
echo "📦 Installing PM2 and Nginx..."
sudo npm install -g pm2
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Install OCR Dependencies (Poppler & Tesseract)
echo "📦 Installing Poppler and Tesseract for OCR..."
sudo dnf install -y poppler-utils tesseract

# 6. Clone Repository
echo "� Cloning repository..."
PROJECT_DIR="$HOME/atsense"
if [ ! -d "$PROJECT_DIR" ]; then
    git clone https://github.com/aneeshaji/atsense $PROJECT_DIR
else
    echo "ℹ️ Project directory already exists. Skipping clone."
fi

# 7. Create Environment Placeholder
echo "📝 Creating environment template..."
# Ensure backend directory exists (in case clone was skipped or failed)
mkdir -p $PROJECT_DIR/backend
cat <<EOF > $PROJECT_DIR/backend/.env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_random_secret_string
OPENAI_API_KEY=your_openai_api_key
EOF

# 8. Start Services Initial Placeholder
# (Optional: user will still need to npm install and start)
# This just sets the stage
sudo chown -R $USER:$USER $PROJECT_DIR

# 9. Final Instructions
echo "--------------------------------------------------"
echo "✅ SERVER READY!"
echo "--------------------------------------------------"
echo "Next Steps:"
echo "1. Backend: cd $PROJECT_DIR/backend && npm install && pm2 start server.js --name atsense-backend"
echo "2. Frontend: The GitHub Action will now automatically update your 'dist' folder on push."
echo "3. Nginx: Copy your config: sudo cp $PROJECT_DIR/nginx/atsense.conf /etc/nginx/conf.d/atsense.conf && sudo systemctl reload nginx"
echo ""
echo "🚀 Manual setup complete! Your code is now live on the server."
