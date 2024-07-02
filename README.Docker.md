## Building and Running Your Application

To build and run your application locally, use Docker Compose:

docker compose up --build

Your application will be available at http://localhost:3000.

## Deploying Your Application to the Cloud

### Building Your Docker Image

Build your Docker image locally:

docker build -t myapp .

If your cloud provider uses a different CPU architecture (e.g., you develop on a Mac M1 but deploy to an amd64 architecture), specify the platform:

docker build --platform=linux/amd64 -t myapp .

### Pushing Your Image to a Registry

Push your built image to a Docker registry:

docker push myregistry.com/myapp

### Additional Resources

- Docker's Node.js guide: https://docs.docker.com/language/nodejs/
