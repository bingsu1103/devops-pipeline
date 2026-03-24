# DevOps Pipeline - Full-stack Infrastructure & CI/CD Boilerplate

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)](https://spring.io/projects/spring-boot)
[![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-blue)](https://www.terraform.io/)
[![Ansible](https://img.shields.io/badge/Ansible-Deployment-red)](https://www.ansible.com/)

This is a comprehensive, production-ready DevOps boilerplate designed for a complete CI/CD lifecycle. It automates infrastructure provisioning with **Terraform**, configuration management with **Ansible**, and deployment with **Jenkins** and **Docker**.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (Dynamic Port), Tailwind CSS v4, Framer Motion.
- **Backend**: Spring Boot 3.4.x (Dynamic Port), PostgreSQL (Prod) / H2 (Dev).
- **IaC**: Terraform (AWS).
- **Config Management**: Ansible.
- **CI/CD**: Jenkins, Docker, Bash Scripts.

---

## 🔐 Credentials & Secrets Management

To run this pipeline successfully, you must configure two distinct types of security keys in Jenkins:

### 1. Infrastructure Management (IAM User)

These keys grant Terraform permission to create resources (EC2, RDS, VPC) on your AWS account.

- **`aws-access-key`** (Secret text): Your IAM Access Key ID.
- **`aws-secret-key`** (Secret text): Your IAM Secret Access Key.

### 2. Remote Server Access (SSH Key)

This allows Jenkins/Ansible to log into the EC2 instances created by Terraform.

- **`ec2-ssh-key`** (SSH Username with private key):
  - **Username**: `ec2-user`
  - **Private Key**: Paste the entire content of your `.pem` file (e.g., `AWS_key_pair.pem`).
  - **Alternative**: If starting fresh, you can generate a new pair via `ssh-keygen -t rsa -b 4096 -f ./infrastructure/keys/ec2-deploy-key` and register the `.pub` file in AWS.

### 3. Docker Registry

- **`dockerhub-creds`** (Username/Password): Your Docker Hub login for image storage.

---

## 👷 Jenkins Setup & Configuration

This project is optimized for the automated pipeline in `./ci-cd/Jenkinsfile`.

### 1. Required Credentials List

Add these in `Manage Jenkins` -> `Credentials` -> `System` -> `Global credentials`:

| Credential ID     | Type                          | Description                                       |
| :---------------- | :---------------------------- | :------------------------------------------------ |
| `dockerhub-creds` | Username/Password             | Your Docker Hub credentials to push images.       |
| `aws-access-key`  | Secret text                   | AWS Access Key ID for Terraform provisioning.     |
| `aws-secret-key`  | Secret text                   | AWS Secret Access Key for Terraform provisioning. |
| `ec2-ssh-key`     | SSH Username with private key | Key for `ec2-user` to allow Ansible connectivity. |

### 2. Configuration as Code (CasC)

This project uses a file-based configuration strategy. You don't need to set parameters in the Jenkins UI.

#### A. Master Configuration (`./application.properties`)

This file at the root of the project acts as the **Master Switch**.

- `ENV_TARGET`: Set this to `dev` or `prod` to tell Jenkins where to deploy.

#### B. Environment-Specific Config (`./infrastructure/envs/[dev|prod]/pipeline.properties`)

These files contain the technical details for each environment:

- `BACKEND_PORT`: Port for the Spring Boot service.
- `FRONTEND_PORT`: Port for the Next.js application.
- `DOCKER_USER`: Your Docker Hub username.
- `AWS_SSH_KEY_NAME`: The name of the SSH key registered in AWS.

### 3. Pipeline Automation (CI/CD)

The pipeline is fully automated and follows the **Configuration as Code** principle.

1. **Change Environment**: To switch between Dev and Prod, simply change `ENV_TARGET` in the root `application.properties` and commit/push.
2. **Technical Settings**: To change ports or users, edit the corresponding file in `infrastructure/envs/` and commit/push.
3. **Automatic Load**: Jenkins will automatically detect these changes, load the correct configuration, and execute the deployment without manual intervention.

### 5. Pipeline Requirements

- **NodeJS**: Standard installation on the agent.
- **Maven**: Ensure `mvnw` in the backend is executable (`chmod +x backend/mvnw`).
- **Terraform / Ansible**: Installed on the Jenkins agent.
- **Docker**: Accessible by the Jenkins service.

---

## 🛠️ Infrastructure & Deployment Flow

The pipeline follows a strict execution order as defined in `Jenkinsfile`:

1. **Build Artifacts**: Compiles the Spring Boot backend using Maven.
2. **Infrastructure Provisioning**:
   - Uses Terraform in `infrastructure/envs/dev` or `prod`.
   - Automatically retrieves `backend_public_ip`, `frontend_public_ip`, and `rds_endpoint`.
   - Updates Ansible `inventory/dev.ini` dynamically with new IPs.
3. **Docker Build**:
   - Uses `ci-cd/scripts/build.sh`.
   - Injects `NEXT_PUBLIC_API_URL` (pointing to `BACKEND_IP:${BACKEND_PORT}`) as a build argument.
4. **Push DockerHub**: Tags and pushes images to Docker Hub.
5. **Configuration & Deploy**:
   - Uses `sshagent(['ec2-ssh-key'])` for authentication.
   - Runs `ansible-playbook -i inventory/${ENVIRONMENT}.ini playbooks/setup.yml`.
   - Runs `ansible-playbook ... playbooks/deploy.yml` with dynamic ports and tags.

---

## 📂 Ansible & Dynamic Inventory Management

To avoid committing sensitive information (IPs, DB passwords) into Git, the project uses an **Inventory Template** strategy:

### 1. The Template Strategy

- **Template**: `ansible/inventory/dev.ini.example` (Tracked in Git).
- **Active Inventory**: `ansible/inventory/dev.ini` (Ignored in `.gitignore`).
- **Why?**: The Jenkins CI server will generate the active `.ini` file on the fly by copying the template and replacing placeholders with Terraform outputs.

### 2. Configure Your Template (`dev.ini.example`)

Create a copy of your current `dev.ini` but use placeholders:

```ini
[backend]
backend_server ansible_host={{ BACKEND_IP }} ansible_user=ec2-user

[backend:vars]
db_host={{ RDS_HOST }}
db_name=devops_db
db_username=dbadmin
db_password={{ DB_PASS }}

[frontend]
frontend_server ansible_host={{ FRONTEND_IP }} ansible_user=ec2-user

[all:vars]
# Do not hard-code local paths in committed code!
# The Jenkins SSH Agent will handle security automatically.
ansible_python_interpreter=/usr/bin/python3
```

### 3. Automatic Deployment Flow

In the `Jenkinsfile`, notice the **Infrastructure Provisioning** stage:

1. `terraform apply` runs.
2. IPs and RDS Endpoint are captured.
3. `sed` commands replace the placeholders in `inventory/dev.ini`.
4. Ansible runs against this fresh, private file.

---

## 🧪 Local Quick Start (Development)

- **Backend**: `cd backend && ./mvnw spring-boot:run` (Runs on port `8080/7070` depending on env).
- **Frontend**: `cd frontend && npm install && npm run dev` (Runs on port `3000`).

---

## 📂 Project Navigation

```text
/
├── ansible/            # Ansible Playbooks & Roles
├── backend/            # Spring Boot Service (Port 7070)
├── frontend/           # Next.js 15 Application (Port 3000)
├── infrastructure/     # Terraform Envs (Dev/Prod)
├── ci-cd/              # Jenkinsfile & Build Scripts
├── k8s/                # Kubernetes Manifests
└── docker-compose.yml  # Local multi-container setup
```

---

_Created with ❤️ by the Bingsu(Gia An)._
