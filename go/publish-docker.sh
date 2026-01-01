#!/bin/bash

DOCKERHUB_USERNAME=${1:-"your-username"}
TAG=${2:-"latest"}

if [ "$DOCKERHUB_USERNAME" == "your-username" ]; then
    echo "Error: Please provide your DockerHub username"
    echo "Usage: ./publish-docker.sh <dockerhub-username> [tag]"
    exit 1
fi

IMAGE_NAME="blog-api"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "Tagging image as ${FULL_IMAGE_NAME}..."
docker tag ${IMAGE_NAME}:latest ${FULL_IMAGE_NAME}

echo "Logging in to DockerHub..."
echo "Please enter your DockerHub credentials when prompted:"
docker login

echo "Pushing ${FULL_IMAGE_NAME} to DockerHub..."
docker push ${FULL_IMAGE_NAME}

echo "Successfully pushed ${FULL_IMAGE_NAME} to DockerHub!"
echo ""
echo "You can now pull it with:"
echo "  docker pull ${FULL_IMAGE_NAME}"

