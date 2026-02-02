#!/bin/bash

# Configuration and setup script for Linux/Ubuntu production environment
# This script installs necessary system dependencies for ATSense backend (OCR Support)

echo "🚀 Starting ATSense Linux Production Environment Setup..."

# Update package lists
echo "📦 Updating package lists..."
sudo apt-get update

# Install Poppler Utilities (required for pdf-poppler)
echo "📄 Installing Poppler Utilities..."
sudo apt-get install -y poppler-utils

# Install Tesseract OCR (optional addition for better performance if using local binaries)
# Note: tesseract.js downloads its own WASM workers, but having system binaries is good for debugging
echo "🔍 Installing Tesseract OCR..."
sudo apt-get install -y tesseract-ocr

# Verify installations
echo "✅ Verifying installations..."

if command -v pdftoppm >/dev/null 2>&1; then
    echo "  - Poppler (pdftoppm): $(pdftoppm -v 2>&1 | head -n 1)"
else
    echo "  ❌ ERROR: Poppler (pdftoppm) was not installed correctly."
fi

if command -v tesseract >/dev/null 2>&1; then
    echo "  - Tesseract OCR: $(tesseract --version | head -n 1)"
else
    echo "  - Tesseract OCR system binary not found (Not critical, tesseract.js will still work)."
fi

echo ""
echo "🎉 Setup complete! Your Linux environment is ready to handle image-based resumes."
