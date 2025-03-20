#!/bin/bash

# Deployment script for Xebo Response Upload Helper

echo "Starting deployment process..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker-compose build

# Stop any running containers
echo "Stopping any existing containers..."
docker-compose down

# Start the container in detached mode
echo "Starting the application..."
docker-compose up -d

# Check if the container is running
if [ $(docker-compose ps -q | wc -l) -gt 0 ]; then
    echo "Application deployed successfully!"
    echo "The application is now available at http://localhost:3000"
    
    # Wait for the application to fully start
    echo "Waiting for the application to start..."
    sleep 10
    
    # Check the health endpoint
    echo "Checking application health..."
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
    
    if [ "$HEALTH_STATUS" -eq 200 ]; then
        echo "Health check passed. Application is running correctly."
    else
        echo "Health check failed with status $HEALTH_STATUS. Please check the logs."
        docker-compose logs
    fi
else
    echo "Deployment failed. Please check the logs."
    docker-compose logs
    exit 1
fi
