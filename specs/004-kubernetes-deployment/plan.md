# Phase IV: Local Kubernetes Deployment - Implementation Plan

**Feature ID**: 004-kubernetes-deployment
**Version**: 1.0
**Status**: Planning
**Last Updated**: 2026-04-08

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT MACHINE                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MINIKUBE CLUSTER                         │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              NAMESPACE: tasknest-dev                  │  │ │
│  │  │                                                       │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │ │
│  │  │  │  Frontend   │  │   Backend   │  │ PostgreSQL  │  │  │ │
│  │  │  │  Deployment │  │  Deployment │  │ StatefulSet │  │  │ │
│  │  │  │  (2 pods)   │  │  (3 pods)   │  │  (1 pod)    │  │  │ │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │ │
│  │  │         │                 │                 │         │  │ │
│  │  │  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐  │  │ │
│  │  │  │  Frontend   │  │   Backend   │  │ PostgreSQL  │  │  │ │
│  │  │  │   Service   │  │   Service   │  │   Service   │  │  │ │
│  │  │  │ (ClusterIP) │  │ (ClusterIP) │  │ (ClusterIP) │  │  │ │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │ │
│  │  │         │                 │                 │         │  │ │
│  │  │         └─────────┬───────┘                 │         │  │ │
│  │  │                   │                         │         │  │ │
│  │  │            ┌──────▼──────┐                  │         │  │ │
│  │  │            │   Ingress   │                  │         │  │ │
│  │  │            │  Controller │                  │         │  │ │
│  │  │            └──────┬──────┘                  │         │  │ │
│  │  │                   │                         │         │  │ │
│  │  │  ┌────────────────▼─────────────────┐      │         │  │ │
│  │  │  │        ConfigMaps & Secrets      │      │         │  │ │
│  │  │  └──────────────────────────────────┘      │         │  │ │
│  │  │                                             │         │  │ │
│  │  │  ┌──────────────────────────────────┐      │         │  │ │
│  │  │  │    PersistentVolume (10Gi)       │◄─────┘         │  │ │
│  │  │  └──────────────────────────────────┘                │  │ │
│  │  │                                                       │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MANAGEMENT TOOLS                         │ │
│  │  • kubectl (standard Kubernetes CLI)                       │ │
│  │  • kubectl-ai (AI-powered natural language interface)      │ │
│  │  • kagent (Intelligent Kubernetes agent)                   │ │
│  │  • Helm (Package manager)                                  │ │
│  │  • Minikube Dashboard (Web UI)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

External Access:
- http://tasknest.local → Frontend (via Ingress)
- http://tasknest.local/api → Backend (via Ingress)
- http://localhost:8001 → Kubernetes Dashboard
```

---

## 2. Docker Containerization Strategy

### 2.1 Frontend Dockerfile

**Location**: `frontend/TaskNest/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
```

**Optimizations**:
- Multi-stage build reduces final image size
- Alpine base image (smaller footprint)
- Non-root user for security
- Health check for Kubernetes probes
- Layer caching for faster builds

---

### 2.2 Backend Dockerfile

**Location**: `backend/Dockerfile`

```dockerfile
# Stage 1: Dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Stage 2: Production
FROM python:3.11-slim AS runner

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1001 appuser

# Copy dependencies from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY src ./src
COPY alembic ./alembic
COPY alembic.ini ./

# Switch to non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()"

# Start application
CMD ["/app/.venv/bin/uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Optimizations**:
- Multi-stage build
- Slim Python image
- uv for fast dependency installation
- Non-root user
- Health check endpoint

---

### 2.3 Docker Compose (Development)

**Location**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend/TaskNest
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - backend
    networks:
      - tasknest

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
    networks:
      - tasknest

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=tasknest
      - POSTGRES_PASSWORD=tasknest
      - POSTGRES_DB=tasknest
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - tasknest

volumes:
  postgres_data:

networks:
  tasknest:
    driver: bridge
```

---

## 3. Helm Chart Architecture

### 3.1 Chart Structure

```
helm/
├── tasknest/                           # Umbrella chart
│   ├── Chart.yaml                      # Chart metadata
│   ├── values.yaml                     # Default values
│   ├── values-dev.yaml                 # Development overrides
│   ├── values-staging.yaml             # Staging overrides
│   ├── values-prod.yaml                # Production overrides
│   ├── templates/
│   │   ├── namespace.yaml              # Namespace definition
│   │   └── NOTES.txt                   # Post-install notes
│   └── charts/
│       ├── frontend/                   # Frontend subchart
│       ├── backend/                    # Backend subchart
│       └── postgresql/                 # Database subchart
```

---

### 3.2 Frontend Helm Chart

**Location**: `helm/tasknest/charts/frontend/`

**Chart.yaml**:
```yaml
apiVersion: v2
name: frontend
description: TaskNest Frontend Application
type: application
version: 1.0.0
appVersion: "1.0.0"
```

**values.yaml**:
```yaml
replicaCount: 2

image:
  repository: tasknest-frontend
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: tasknest.local
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: tasknest-tls
      hosts:
        - tasknest.local

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 250m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 80

env:
  - name: NEXT_PUBLIC_API_URL
    value: "http://tasknest.local/api"
  - name: BETTER_AUTH_SECRET
    valueFrom:
      secretKeyRef:
        name: tasknest-secrets
        key: auth-secret
```

**templates/deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "frontend.fullname" . }}
  labels:
    {{- include "frontend.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "frontend.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "frontend.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: frontend
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /api/health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: http
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
        env:
          {{- toYaml .Values.env | nindent 10 }}
```

---

### 3.3 Backend Helm Chart

**Location**: `helm/tasknest/charts/backend/`

**values.yaml**:
```yaml
replicaCount: 3

image:
  repository: tasknest-backend
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 8000

resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 500m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: tasknest-secrets
        key: database-url
  - name: BETTER_AUTH_SECRET
    valueFrom:
      secretKeyRef:
        name: tasknest-secrets
        key: auth-secret
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: tasknest-secrets
        key: openai-api-key
```

---

### 3.4 PostgreSQL Helm Chart

**Location**: `helm/tasknest/charts/postgresql/`

**values.yaml**:
```yaml
image:
  repository: postgres
  tag: "15-alpine"

service:
  type: ClusterIP
  port: 5432

persistence:
  enabled: true
  storageClass: "standard"
  size: 10Gi

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

auth:
  username: tasknest
  password: tasknest
  database: tasknest
```

**templates/statefulset.yaml**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "postgresql.fullname" . }}
spec:
  serviceName: {{ include "postgresql.fullname" . }}
  replicas: 1
  selector:
    matchLabels:
      {{- include "postgresql.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "postgresql.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: postgresql
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - name: postgresql
          containerPort: 5432
        env:
        - name: POSTGRES_USER
          value: {{ .Values.auth.username }}
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ include "postgresql.fullname" . }}-secret
              key: password
        - name: POSTGRES_DB
          value: {{ .Values.auth.database }}
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: {{ .Values.persistence.storageClass }}
      resources:
        requests:
          storage: {{ .Values.persistence.size }}
```

---

## 4. Kubernetes Resource Definitions

### 4.1 Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tasknest-dev
  labels:
    name: tasknest-dev
    environment: development
```

---

### 4.2 ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tasknest-config
  namespace: tasknest-dev
data:
  # Frontend config
  NEXT_PUBLIC_API_URL: "http://tasknest.local/api"
  
  # Backend config
  CORS_ORIGINS: "http://tasknest.local,http://localhost:3000"
  LOG_LEVEL: "info"
```

---

### 4.3 Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tasknest-secrets
  namespace: tasknest-dev
type: Opaque
stringData:
  database-url: "postgresql://tasknest:tasknest@postgresql:5432/tasknest"
  auth-secret: "your-32-character-secret-here"
  openai-api-key: "sk-your-openai-api-key-here"
```

---

### 4.4 Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tasknest-ingress
  namespace: tasknest-dev
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: tasknest.local
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
```

---

## 5. kubectl-ai Integration

### 5.1 Installation

```bash
# Install kubectl-ai plugin
kubectl krew install ai

# Configure OpenAI API key
export OPENAI_API_KEY="sk-your-key-here"

# Test installation
kubectl ai "show me all pods"
```

---

### 5.2 Common Commands

```bash
# Deployment operations
kubectl ai "deploy tasknest application to dev namespace"
kubectl ai "scale backend to 5 replicas"
kubectl ai "rollback frontend deployment"

# Troubleshooting
kubectl ai "why are backend pods crashing?"
kubectl ai "show me logs from frontend pods with errors"
kubectl ai "check if database is running"

# Resource management
kubectl ai "show resource usage for all pods"
kubectl ai "list all services in tasknest-dev"
kubectl ai "describe the ingress configuration"
```

---

## 6. kagent Integration

### 6.1 Installation

```bash
# Install kagent
curl -sSL https://kagent.io/install.sh | bash

# Configure
kagent config set cluster minikube
kagent config set openai-key $OPENAI_API_KEY

# Test
kagent status
```

---

### 6.2 Capabilities

**Cluster Monitoring**:
```bash
kagent monitor --namespace tasknest-dev
```

**Automated Troubleshooting**:
```bash
kagent diagnose --pod backend-xyz
kagent fix --issue "CrashLoopBackOff"
```

**Deployment Automation**:
```bash
kagent deploy --chart helm/tasknest --values values-dev.yaml
kagent upgrade --chart helm/tasknest --version 1.1.0
```

**Natural Language Queries**:
```bash
kagent ask "What's the health of my cluster?"
kagent ask "Why is the backend slow?"
kagent ask "How can I optimize resource usage?"
```

---

## 7. Testing Strategy

### 7.1 Docker Testing

```bash
# Build images
docker build -t tasknest-frontend:latest ./frontend/TaskNest
docker build -t tasknest-backend:latest ./backend

# Test with docker-compose
docker-compose up -d
docker-compose ps
docker-compose logs -f

# Health checks
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

---

### 7.2 Kubernetes Testing

```bash
# Deploy to Minikube
helm install tasknest ./helm/tasknest -f ./helm/tasknest/values-dev.yaml -n tasknest-dev

# Check deployment
kubectl get all -n tasknest-dev
kubectl get pods -n tasknest-dev -w

# Test services
kubectl port-forward svc/frontend 3000:3000 -n tasknest-dev
kubectl port-forward svc/backend 8000:8000 -n tasknest-dev

# Test ingress
curl http://tasknest.local
curl http://tasknest.local/api/health
```

---

### 7.3 Integration Testing

```bash
# Test full application flow
# 1. Register user
# 2. Login
# 3. Create task
# 4. Complete task
# 5. Use chat interface
# 6. Verify data persistence

# Test scaling
kubectl scale deployment backend --replicas=5 -n tasknest-dev
kubectl get hpa -n tasknest-dev

# Test rolling updates
helm upgrade tasknest ./helm/tasknest -f ./helm/tasknest/values-dev.yaml -n tasknest-dev
kubectl rollout status deployment/backend -n tasknest-dev
```

---

## 8. Deployment Workflow

### 8.1 Initial Setup

```bash
# 1. Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# 2. Enable addons
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard

# 3. Build Docker images
eval $(minikube docker-env)
docker build -t tasknest-frontend:latest ./frontend/TaskNest
docker build -t tasknest-backend:latest ./backend

# 4. Create namespace
kubectl create namespace tasknest-dev

# 5. Create secrets
kubectl create secret generic tasknest-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=auth-secret="..." \
  --from-literal=openai-api-key="..." \
  -n tasknest-dev

# 6. Deploy with Helm
helm install tasknest ./helm/tasknest -f ./helm/tasknest/values-dev.yaml -n tasknest-dev

# 7. Add hosts entry
echo "$(minikube ip) tasknest.local" | sudo tee -a /etc/hosts

# 8. Access application
minikube tunnel  # In separate terminal
open http://tasknest.local
```

---

### 8.2 Update Workflow

```bash
# 1. Make code changes
# 2. Rebuild images
docker build -t tasknest-frontend:v1.1.0 ./frontend/TaskNest
docker build -t tasknest-backend:v1.1.0 ./backend

# 3. Update Helm values
# Edit helm/tasknest/values-dev.yaml to use new image tags

# 4. Upgrade deployment
helm upgrade tasknest ./helm/tasknest -f ./helm/tasknest/values-dev.yaml -n tasknest-dev

# 5. Monitor rollout
kubectl rollout status deployment/frontend -n tasknest-dev
kubectl rollout status deployment/backend -n tasknest-dev

# 6. Verify
curl http://tasknest.local/api/health
```

---

## 9. Success Criteria

Implementation is complete when:

1. ✅ Docker images build successfully and pass health checks
2. ✅ Minikube cluster runs with all required addons
3. ✅ Helm charts deploy without errors
4. ✅ All pods are running and ready
5. ✅ Application accessible at http://tasknest.local
6. ✅ All Phase I-III features work correctly
7. ✅ Database data persists across pod restarts
8. ✅ kubectl-ai responds to natural language commands
9. ✅ kagent performs cluster operations
10. ✅ Documentation complete and tested

---

**Plan Version**: 1.0
**Status**: Ready for Task Breakdown
**Next Step**: Create tasks.md with detailed implementation tasks
