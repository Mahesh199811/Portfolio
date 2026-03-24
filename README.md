# Mahesh Gadhave — DevOps Portfolio

Static portfolio website served with Nginx and containerized with Docker.

## Architecture

```
GitHub → Jenkins CI/CD → Docker Build → ECR
                                          ↓
Terraform → AWS VPC + EKS ← Helm Deploy ←┘
                ↓
         CloudWatch + Prometheus + Grafana (Monitoring)
```

## Stack

| Layer | Technology |
|---|---|
| Frontend | HTML/CSS/JS served by Nginx |
| Containers | Docker + Docker Compose |
| Registry | AWS ECR |
| CI/CD | Jenkins (Jenkinsfile) |
| Infra as Code | Terraform |
| Orchestration | AWS EKS + Helm |
| Monitoring | Prometheus + Grafana + CloudWatch |

## Local Development

```bash
# Start static website
docker compose up --build

# Website: http://localhost
```

Visitors can view the portfolio content publicly, but no server-side edit or submit endpoints are exposed in static mode.

## Deployment Pipeline

### Step 1 — Provision AWS Infrastructure
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

### Step 2 — Push to GitHub (triggers Jenkins)
```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

### Step 3 — Jenkins Pipeline (auto-triggered)
- Checkout → Build → Test → Docker Build → Push ECR → Helm Deploy → Health Check

### Step 4 — Install Monitoring Stack
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  -f monitoring/prometheus/values.yaml \
  -n monitoring --create-namespace
```

## Environment Variables

No runtime environment variables are required for static mode.
