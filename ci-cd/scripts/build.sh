#!/bin/bash
# DOCKERHUB_USER được lấy từ biến môi trường của Jenkins
DOCKERHUB_USER=${DOCKERHUB_USER:-"bingsu1103"}
TAG=${1:-"latest"}

echo "--- Building Backend Image ---"
docker build -t $DOCKERHUB_USER/devops-backend:$TAG ./backend

echo "--- Building Frontend Image ---"
docker build -t $DOCKERHUB_USER/devops-frontend:$TAG ./frontend

echo "--- Build Complete ---"
