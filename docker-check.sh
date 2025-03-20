#!/bin/bash

# Script to check Docker container health and logs

CONTAINER_NAME="xebo-response-upload-helper"

# Check if the container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "✅ Container $CONTAINER_NAME is running"
    
    # Get container info
    echo "\n📊 Container Info:"
    docker ps -f name=$CONTAINER_NAME --format "table {{.ID}}\t{{.Status}}\t{{.Ports}}"
    
    # Check health status
    echo "\n🩺 Health Status:"
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME)
    echo "Health status: $HEALTH"
    
    # Show recent health check logs
    echo "\n🩺 Recent Health Checks:"
    docker inspect --format='{{range .State.Health.Log}}{{.ExitCode}} - {{.Output}}{{end}}' $CONTAINER_NAME | tail -n 3
    
    # Show resource usage
    echo "\n💻 Resource Usage:"
    docker stats $CONTAINER_NAME --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    # Show recent logs
    echo "\n📜 Recent Logs:"
    docker logs $CONTAINER_NAME --tail 20
    
    # Check the health endpoint directly
    echo "\n🌐 Health Endpoint Check:"
    docker exec $CONTAINER_NAME curl -s http://localhost:3000/api/health | grep -o '"status":"[^"]*"'
else
    echo "❌ Container $CONTAINER_NAME is not running"
    
    # Check if the container exists but is not running
    if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
        echo "Container exists but is not running. Last logs:"
        docker logs $CONTAINER_NAME --tail 20
        
        echo "\nTo restart the container, run:"
        echo "docker start $CONTAINER_NAME"
    else
        echo "Container does not exist. To create and start it, run:"
        echo "docker-compose up -d"
    fi
fi
