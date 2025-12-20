# Use Node.js LTS version as base
FROM node:20-slim

# Install system dependencies for OCR support (Poppler and Tesseract)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose the API port
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
