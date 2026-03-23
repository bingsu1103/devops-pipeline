#!/bin/bash
if [ -z "$DOCKERHUB_USER" ]; then
  echo "Error: DOCKERHUB_USER is not set."
  exit 1
fi
TAG=${1:-"latest"}


echo "--- Pushing Images to Docker Hub ---"
docker push $DOCKERHUB_USER/devops-backend:$TAG
docker push $DOCKERHUB_USER/devops-frontend:$TAG

echo "--- Push Complete ---"
