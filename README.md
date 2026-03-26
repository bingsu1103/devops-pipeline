<div align="center">
  <img src="./frontend/public/header.svg" width="400" />
</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.4.x-brightgreen)](https://spring.io/projects/spring-boot)
[![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-blue)](https://www.terraform.io/)
[![Ansible](https://img.shields.io/badge/Ansible-Deployment-red)](https://www.ansible.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a comprehensive, production-ready DevOps boilerplate designed for a complete CI/CD lifecycle. It automates infrastructure provisioning with **Terraform**, configuration management with **Ansible**, and deployment with **Jenkins** and **Docker**.

---

## 🚀 Tech Stack

<div align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,spring,terraform,ansible,jenkins,docker,aws,postgres,bash" />
</div>

- 🌐 **Frontend**: Next.js 16 (Dynamic Port), Tailwind CSS v4, Framer Motion.
- ☕ **Backend**: Spring Boot 4.4.x (Dynamic Port), PostgreSQL (Prod) / H2 (Dev).
- ☁️ **IaC**: Terraform (AWS).
- 🛠️ **Config Management**: Ansible.
- ⚙️ **CI/CD**: Jenkins, Docker, Bash Scripts.

---

## 🛠️ CI/CD Setup Guide (Quick Start)

Follow these steps to set up your automated pipeline from Infrastructure provisioning to deployment.

### 1. <img src="https://skillicons.dev/icons?i=jenkins" width="30" align="center" /> Jenkins Configuration (Required)

Configure the following two sections in your Jenkins UI:

#### A. Global Credentials

Navigate to `Manage Jenkins` -> `Credentials` -> `System` -> `Global credentials`:

| Credential ID     | Type                          | Description                                         |
| :---------------- | :---------------------------- | :-------------------------------------------------- |
| `aws-access-key`  | Secret text                   | Your AWS IAM Access Key ID                          |
| `aws-secret-key`  | Secret text                   | Your AWS IAM Secret Access Key                      |
| `dockerhub-creds` | Username/Password             | Docker Hub credentials (Password or Access Token)   |
| `rds-db-password` | Secret text                   | Password for the AWS RDS instance                   |
| `ec2-ssh-key`     | SSH Username with private key | **User**: `ec2-user`, **Key**: Paste `.pem` content |

#### B. Global Environment Variables

Navigate to `Manage Jenkins` -> `System` -> **Global properties**:

- Enable **Environment variables**.
- Add a new variable:
  - **Name**: `PATH+EXTRA`
  - **Value**:
    - Apple Silicon Mac: `/opt/homebrew/bin`
    - Linux / Intel Mac: `/usr/local/bin`

> [!TIP]
> This variable allows Jenkins to locate CLI tools like **`terraform`**, **`ansible`**, **`aws`**, and **`docker`**.
>
> - **Custom Paths**: If your binaries are in non-standard locations (e.g., Docker Desktop on Mac), you can **append** multiple paths using a colon (`:`).
> - **Example**: `/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin`

> [!IMPORTANT]
> **Docker Daemon**: Ensure that **Docker Desktop** (or the Docker daemon) is running on the machine hosting Jenkins before starting the pipeline. The build and push stages will fail if Jenkins cannot connect to the Docker engine.

---

### 2. <img src="https://skillicons.dev/icons?i=aws" width="30" align="center" /> AWS Key Pair Matching

Ensure the SSH key name in AWS matches the project configuration:

<img src="https://skillicons.dev/icons?i=aws" width="22" align="center" /> **AWS Console Setup**  
Navigate to EC2 -> **Key Pairs** and create a key pair specifically named **`AWS_key_pair`** (format `.pem`).

<img src="https://skillicons.dev/icons?i=bash" width="22" align="center" /> **Prepare the Key**  
Download the `.pem` file, open it with a text editor, and copy the entire private key content.

<img src="https://skillicons.dev/icons?i=jenkins" width="22" align="center" /> **Link to Jenkins**  
Add the copied content to the Jenkins `ec2-ssh-key` credential under the "Private Key" section.

---

### 3. <img src="https://skillicons.dev/icons?i=terraform" width="30" align="center" /> Configuration Files (Properties & .env)

This project uses **Configuration as Code**. Avoid manual parameter entry in the Jenkins UI.

- **Master Switch (`application.properties`)**: Located at the root.
  - Set `ENV_TARGET=dev` or `ENV_TARGET=prod` to select the environment.
- **Technical Settings (`infrastructure/envs/[dev|prod]/pipeline.properties`)**:
  - Update `DOCKER_USER` to your Docker Hub username.
  - Modify ports (`BACKEND_PORT`, `FRONTEND_PORT`) if needed.
  - Ensure `AWS_SSH_KEY_NAME=AWS_key_pair`.

> [!NOTE]
> Frontend `.env` files are automatically updated with the backend URL (`NEXT_PUBLIC_API_URL`) during the Jenkins build process. No manual editing is required for the pipeline.

---

### 4. <img src="https://skillicons.dev/icons?i=bash" width="30" align="center" /> Local Development (Optional)

To run the project locally on your machine, use the following commands:

**🚀 Run Backend (API)**

```bash
cd backend
./mvnw spring-boot:run
```

**🌐 Run Frontend (Web)**

```bash
cd frontend
npm install
# Set local API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:7070" > .env.local
npm run dev
```

---

### 5. <img src="https://skillicons.dev/icons?i=gitlab,github" width="60" align="center" /> Automation with Webhooks

We **highly recommend using GitLab** for a more robust Jenkins integration.

#### A. For GitHub

- **Jenkins**: In Job config, check **GitHub hook trigger for GITScm polling**.
- **GitHub**: `Settings` -> `Webhooks` -> `Add webhook`.
  - **Payload URL**: `http://<jenkins-url>/github-webhook/`
  - **Content type**: `application/json`

#### B. For GitLab (Recommended) 🎖️

- **Jenkins**: Install the `GitLab Plugin`. Check **Build when a change is pushed to GitLab**.
- **GitLab**: `Settings` -> `Webhooks` -> `Add new webhook`.
  - **URL**: Paste the link generated in the Jenkins trigger section.
  - **Trigger**: `Push events`.

> [!IMPORTANT]  
> If Jenkins is running on your local machine, you **MUST** use **ngrok** to create a public tunnel:  
> `ngrok http 8080`  
> Use the generated `https://...` link as your Webhook Payload URL.

---

### 6. 🌐 Production DNS & HTTPS Configuration

> [!IMPORTANT]  
> If you set `ENV_TARGET=prod` in `application.properties`, you **MUST** configure a domain name (DNS) to enable HTTPS/SSL.

When deploying to production, configure your Domain Provider with these A-records:

- **Backend (API)**: Set `api` and `www.api` pointing to the **Backend Instance IP**.
- **Frontend (Web)**: Set `@` (root) and `www` pointing to the **Frontend Instance IP**.

Refer to the example configuration below:

![DNS Configuration Example](./public/hosting_dns/dns_config.jpg)

---

### 7. <img src="https://skillicons.dev/icons?i=bash" width="30" align="center" /> Manual Server Access (Troubleshooting)

If the pipeline completes but the application is unreachable, you can manually SSH into the Amazon Linux instances to investigate.

**Step 1: Secure the Private Key**  
Before connecting, ensure your SSH key has the correct read-only permissions:

```bash
chmod 400 AWS_key_pair.pem
```

**Step 2: Connect via SSH**  
Replace `<EC2_PUBLIC_IP>` with the actual IP address provided in the Jenkins logs:

```bash
ssh -i "AWS_key_pair.pem" ec2-user@<EC2_PUBLIC_IP>
```

**Step 3: Useful Troubleshooting Commands**  
Once logged into the instance, use these commands to verify the system's health:

- **Check running containers**: `docker ps`
- **View application logs**: `docker logs <container_id_or_name>`
- **Check Docker engine status**: `sudo systemctl status docker`
- **Verify project directory**: `cd ~/devops-pipeline && ls -la`

---

### 🚀 Execution & Monitoring

Connect to your Jenkins server and start the automated process:

⚡ **Continuous Deployment (CD)**  
Simply `git commit` and `git push` your code to the linked repository. The pipeline will trigger automatically.

📡 **Live Monitoring**  
Access your Jenkins Job dashboard and monitor the **Console Output** for real-time logs of the Terraform, Ansible, and Docker processes.

🔗 **Access Links**  
Upon successful completion, the system will output the newly provisioned **Frontend** and **Backend URLs** at the very bottom of the log.

---

<div align="center">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExamk0MnU3bzNtcjZxZ3dyM3hrYWthc3FqOWdqaThjYWVyNGZtNmNyciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s0kOCrGnVHoGAelRB2/giphy.gif" width="300" height="250"/>
  <p><i>Building great things, one cup of coffee at a time. ☕</i></p>
</div>

---

<div align="center">
  <img src="./public/author/author.jpg" width="300" />
  <p><b>Crafted with ❤️ by Bingsu (Gia An)</b></p>
</div>
