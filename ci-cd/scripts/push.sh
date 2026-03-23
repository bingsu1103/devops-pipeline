#!/bin/bash
DOCKERHUB_USER=${DOCKERHUB_USER:-"bingsu1103"}
TAG=${1:-"latest"}

echo "--- Pushing Images to Docker Hub ---"
docker push $DOCKERHUB_USER/devops-backend:$TAG
docker push $DOCKERHUB_USER/devops-frontend:$TAG

echo "--- Push Complete ---"
