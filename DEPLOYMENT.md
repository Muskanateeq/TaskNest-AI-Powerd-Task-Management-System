# TaskNest Deployment Guide

## 🚀 Production Deployment

This guide covers deploying TaskNest to production environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Docker Deployment](#docker-deployment)
7. [Platform-Specific Guides](#platform-specific-guides)

---

## Prerequisites

### Required Software
- **Node.js**: v18+ (for frontend)
- **Python**: 3.11+ (for backend)
- **PostgreSQL**: 14+ (Neon Serverless recommended)
- **Docker**: Optional, for containerized deployment

### Required Accounts
- **Neon Database**: For PostgreSQL hosting
- **Vercel/Netlify**: For frontend hosting (recommended)
- **Railway/Render**: For backend hosting (recommended)

---

## Environment Configuration

### Backend Environment Variables

Create `.env` file in `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=https://your-backend-domain.com

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000

# Environment
ENVIRONMENT=production
```

### Frontend Environment Variables

Create `.env.production` file in `frontend/TaskNest/` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

4. **Add PostgreSQL Database**
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set BETTER_AUTH_SECRET=your-secret-key
   railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

6. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: tasknest-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

3. **Add Environment Variables**
   - Add all variables from `.env` file

4. **Deploy**
   - Click "Create Web Service"

### Option 3: Docker + Any Cloud Provider

```bash
cd backend
docker build -t tasknest-backend .
docker push your-registry/tasknest-backend:latest
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend/TaskNest
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your backend URL

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   cd frontend/TaskNest
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=.next
   ```

### Option 3: Static Export + CDN

```bash
cd frontend/TaskNest
npm run build
# Upload .next/static to your CDN
```

---

## Database Setup

### Using Neon (Recommended)

1. **Create Neon Project**
   - Go to [Neon Console](https://console.neon.tech)
   - Create new project
   - Copy connection string

2. **Run Migrations**
   ```bash
   cd backend
   alembic upgrade head
   ```

3. **Verify Connection**
   ```bash
   python -c "from app.database import engine; print('Connected!')"
   ```

### Using Standard PostgreSQL

1. **Create Database**
   ```sql
   CREATE DATABASE tasknest;
   CREATE USER tasknest_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE tasknest TO tasknest_user;
   ```

2. **Update DATABASE_URL**
   ```env
   DATABASE_URL=postgresql://tasknest_user:secure_password@localhost:5432/tasknest
   ```

---

## Docker Deployment

### Using Docker Compose

1. **Update docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
       depends_on:
         - db

     frontend:
       build: ./frontend/TaskNest
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://backend:8000

     db:
       image: postgres:14
       environment:
         - POSTGRES_DB=tasknest
         - POSTGRES_USER=tasknest
         - POSTGRES_PASSWORD=secure_password
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## Platform-Specific Guides

### AWS (EC2 + RDS)

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Open ports 80, 443, 8000

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3.11 python3-pip nodejs npm nginx
   ```

3. **Setup RDS PostgreSQL**
   - Create RDS instance
   - Configure security groups
   - Update DATABASE_URL

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:8000;
       }

       location / {
           proxy_pass http://localhost:3000;
       }
   }
   ```

### Google Cloud Platform (Cloud Run)

1. **Build Containers**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/tasknest-backend backend/
   gcloud builds submit --tag gcr.io/PROJECT_ID/tasknest-frontend frontend/TaskNest/
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy tasknest-backend --image gcr.io/PROJECT_ID/tasknest-backend
   gcloud run deploy tasknest-frontend --image gcr.io/PROJECT_ID/tasknest-frontend
   ```

### Azure (App Service)

1. **Create App Service**
   ```bash
   az webapp create --resource-group TaskNest --plan TaskNestPlan --name tasknest-backend --runtime "PYTHON:3.11"
   ```

2. **Deploy**
   ```bash
   cd backend
   az webapp up --name tasknest-backend
   ```

---

## Post-Deployment Checklist

- [ ] Verify backend health endpoint: `https://your-backend.com/health`
- [ ] Test user registration and login
- [ ] Create test task and verify CRUD operations
- [ ] Test notifications (if enabled)
- [ ] Check error logging and monitoring
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, DataDog, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Load testing and performance optimization

---

## Monitoring & Maintenance

### Health Checks

Backend health endpoint:
```
GET /health
```

### Logging

- **Backend**: Check application logs in your hosting platform
- **Frontend**: Use Vercel Analytics or similar
- **Database**: Monitor query performance in Neon dashboard

### Backups

- **Database**: Configure automatic backups in Neon
- **Code**: Ensure GitHub repository is up to date

### Updates

```bash
# Backend
cd backend
git pull
pip install -r requirements.txt
alembic upgrade head
systemctl restart tasknest-backend

# Frontend
cd frontend/TaskNest
git pull
npm install
npm run build
pm2 restart tasknest-frontend
```

---

## Troubleshooting

### Common Issues

**CORS Errors**
- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check backend CORS middleware configuration

**Database Connection Failed**
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Verify firewall rules

**Authentication Issues**
- Verify `BETTER_AUTH_SECRET` is set
- Check JWT token expiration
- Verify `BETTER_AUTH_URL` matches backend URL

**Build Failures**
- Check Node.js and Python versions
- Verify all dependencies are installed
- Check for environment variable issues

---

## Security Best Practices

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Secure Secrets** - Never commit secrets to Git
3. **Database Security** - Use strong passwords, enable SSL
4. **Rate Limiting** - Implement rate limiting on API endpoints
5. **Input Validation** - Validate all user inputs
6. **CORS** - Configure CORS properly
7. **Updates** - Keep dependencies up to date
8. **Monitoring** - Set up error tracking and monitoring

---

## Support

For issues or questions:
- GitHub Issues: [Your Repository]
- Documentation: [Your Docs Site]
- Email: support@tasknest.com

---

**Last Updated**: 2026-02-06
