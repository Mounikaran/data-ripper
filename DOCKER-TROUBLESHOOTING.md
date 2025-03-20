# Docker Troubleshooting Guide

This guide provides solutions for common issues that may occur when running the Xebo Response Upload Helper in Docker.

## File Parsing Issues

### Empty File Error

If you encounter an error like `File appears to be empty` or `Parsed data length: 0`, try the following:

1. **Check file permissions**: Ensure the uploaded file has proper permissions in the container
   ```bash
   docker exec -it <container_id> ls -la /tmp
   ```

2. **Verify file contents**: Make sure the file is not corrupted
   ```bash
   docker cp <your_file.xlsx> <container_id>:/tmp/
   docker exec -it <container_id> cat /tmp/<your_file.xlsx> | head -c 100
   ```

3. **Update XLSX library**: Try updating the XLSX library to the latest version
   ```bash
   docker exec -it <container_id> npm update xlsx
   ```

4. **Increase memory limits**: If processing large files, increase the memory allocation
   ```yaml
   # In docker-compose.yml
   environment:
     - NODE_OPTIONS=--max-old-space-size=8192
   deploy:
     resources:
       limits:
         memory: 8G
   ```

## Container Health Check Failures

If the health check is failing:

1. **Check logs**: View the container logs for errors
   ```bash
   docker logs <container_id>
   ```

2. **Manually test health endpoint**: Test the health endpoint directly
   ```bash
   docker exec -it <container_id> curl http://localhost:3000/api/health
   ```

3. **Restart the container**: Sometimes a simple restart resolves issues
   ```bash
   docker-compose restart
   ```

## Performance Issues

If the application is slow or unresponsive:

1. **Check resource usage**: Monitor CPU and memory usage
   ```bash
   docker stats <container_id>
   ```

2. **Increase container resources**: Allocate more resources in docker-compose.yml

3. **Optimize file processing**: For very large files, consider pre-processing them before upload

## Debugging in Docker

To get more detailed logs:

1. **Enable debug mode**: Set the NODE_ENV to development
   ```yaml
   environment:
     - NODE_ENV=development
   ```

2. **Access container shell**: Get a shell in the container for debugging
   ```bash
   docker exec -it <container_id> /bin/sh
   ```

3. **Check file system**: Verify file uploads are being stored correctly
   ```bash
   docker exec -it <container_id> ls -la /tmp
   ```

## Common Solutions

1. **Rebuild without cache**: Force a clean build of the Docker image
   ```bash
   ./docker-build.sh
   ```

2. **Update dependencies**: Make sure all dependencies are up to date
   ```bash
   docker exec -it <container_id> npm update
   ```

3. **Check for file format issues**: Ensure uploaded files are in the correct format
   ```bash
   docker exec -it <container_id> file /path/to/uploaded/file
   ```

If you continue to experience issues, please open an issue on the project repository with detailed information about the problem.
