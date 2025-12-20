#!/bin/bash

# ATSense EC2 Setup Script (Amazon Linux 2023)
# Usage: sudo bash setup-ec2.sh

echo "🚀 Starting ATSense EC2 Setup..."

# Update system
sudo dnf update -y

# Install Docker
echo "📦 Installing Docker..."
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Install Git
echo "📦 Installing Git..."
sudo dnf install -y git

# Create Project Directory
echo "📁 Creating project directory..."
mkdir -p ~/atsense
cd ~/atsense

echo "✅ Setup complete! Please log out and back in to apply group changes."
echo "Next steps: Clone your repository and run 'docker-compose up -d'"
