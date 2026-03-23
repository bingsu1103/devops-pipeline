#!/bin/bash
# Check required variables
if [ -z "$DOCKERHUB_USER" ]; then
  echo "Error: DOCKERHUB_USER is not set."
  exit 1
fi

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "Error: NEXT_PUBLIC_API_URL is not set."
  exit 1
fi

TAG=${1:-"latest"}

echo "--- Building Backend Image ---"
docker build -t $DOCKERHUB_USER/devops-backend:$TAG ./backend

echo "--- Building Frontend Image ---"
docker build \
  --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  -t $DOCKERHUB_USER/devops-frontend:$TAG ./frontend


echo "--- Build Complete ---"
