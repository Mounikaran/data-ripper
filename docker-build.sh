#!/bin/bash

# Custom Docker build script for Xebo Response Upload Helper

echo "Starting Docker build process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Clean up any previous builds
echo "Cleaning up previous builds..."
docker system prune -f

# Build the Docker image with no cache to ensure fresh dependencies
echo "Building Docker image..."
docker build \
  --no-cache \
  --build-arg NODE_ENV=production \
  --build-arg NODE_OPTIONS="--max-old-space-size=8192" \
  -t xebo-response-upload-helper:latest \
  .

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully!"
    echo "You can now run the container with:"
    echo "docker run -p 3000:3000 xebo-response-upload-helper:latest"
    echo "Or use Docker Compose:"
    echo "docker-compose up -d"
    
    # Create a tag with the current date
    DATE_TAG=$(date +"%Y%m%d")
    docker tag xebo-response-upload-helper:latest xebo-response-upload-helper:$DATE_TAG
    echo "Created tag: xebo-response-upload-helper:$DATE_TAG"
    
    # List the images
    docker images | grep xebo-response-upload-helper
    
    echo "\nBuild complete!"
else
    echo "Docker build failed. Please check the logs above for errors."
    exit 1
fi
