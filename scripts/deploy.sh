#!/bin/bash
set -e # Dừng ngay nếu có lệnh lỗi

echo "🚀 Starting DevOps Pipeline Orchestration..."

# 1. Terraform (Cấp phát hạ tầng)
echo "--- Step 1: Provisioning Infrastructure ---"
cd infrastructure/envs/dev
terraform init
terraform apply -auto-approve

# 2. Lấy IP từ Terraform để cập nhật Inventory (Tự động hóa hoàn toàn)
BACKEND_IP=$(terraform output -raw backend_public_ip)
FRONTEND_IP=$(terraform output -raw frontend_public_ip)
echo "Found Backend: $BACKEND_IP, Frontend: $FRONTEND_IP"

# 3. Ansible (Cấu hình Server)
echo "--- Step 2: Configuring Servers with Ansible ---"
cd ../../../ansible
# Cập nhật IP tạm thời vào inventory hoặc dùng tham số -i
ansible-playbook -i inventory/dev.ini playbooks/setup.yml
ansible-playbook -i inventory/dev.ini playbooks/deploy.yml

# 4. K8s (Dieu phoi Container) - hien chua dung trong flow hien tai
# echo "--- Step 3: Deploying to Kubernetes ---"
# cd ../k8s
# kubectl apply -f namespace.yaml
# kubectl apply -f backend/
# kubectl apply -f frontend/
# kubectl apply -f ingress.yaml

echo "✅ ALL STEPS COMPLETED SUCCESSFULLY!"
