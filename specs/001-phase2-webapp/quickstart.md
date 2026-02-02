# TaskNest Developer Quickstart Guide

**Version**: 1.0.0
**Last Updated**: 2026-02-02

## Overview

This guide will help you set up the TaskNest development environment on your local machine. Follow these steps to get the frontend and backend running.

## Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Python** | 3.11+ | Backend runtime | [python.org](https://python.org) |
| **Node.js** | 18+ | Frontend runtime | [nodejs.org](https://nodejs.org) |
| **uv** | Latest | Python package manager | `pip install uv` |
| **npm** | 10+ | Node package manager | Included with Node.js |
| **PostgreSQL** | 15+ | Database (or use Neon) | [postgresql.org](https://postgresql.org) |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com) |

### Optional Software

| Software | Purpose | Installation |
|----------|---------|--------------|
| **Docker** | Containerized development | [docker.com](https://docker.com) |
| **Docker Compose** | Multi-container orchestration | Included with Docker Desktop |

## Quick Setup (5 minutes)

### 1. Clone Repository

```bash
git clone <repository-url>
cd phase-2
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies with uv
uv sync

# Copy environment variables template
cp .env.example .env

# Edit .env and add your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/tasknest
# BETTER_AUTH_SECRET=your-secret-key-min-32-characters

# Run database migrations
uv run alembic upgrade head

# Start backend server
uv run uvicorn src.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables template
cp .env.local.example .env.local

# Edit .env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# BETTER_AUTH_SECRET=same-secret-as-backend

# Start frontend development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 4. Verify Setup

Open browser and navigate to:
- Frontend: `http://localhost:3000`
- Backend API docs: `http://localhost:8000/docs`

## Detailed Setup Instructions

### Backend Setup (Detailed)

#### Step 1: Install Python Dependencies

```bash
cd backend

# Create virtual environment and install dependencies
uv sync

# This creates .venv/ directory with all dependencies
```

#### Step 2: Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/tasknest

# For Neon Serverless PostgreSQL:
# DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/tasknest?sslmode=require

# Authentication
BETTER_AUTH_SECRET=your-secret-key-must-be-at-least-32-characters-long

# JWT Configuration
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# CORS (for development)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Environment
ENVIRONMENT=development
```

#### Step 3: Setup Database

**Option A: Local PostgreSQL**

```bash
# Create database
createdb tasknest

# Or using psql
psql -U postgres
CREATE DATABASE tasknest;
\q
```

**Option B: Neon Serverless PostgreSQL**

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string to `.env`

#### Step 4: Run Migrations

```bash
# Run all migrations
uv run alembic upgrade head

# Verify migrations
uv run alembic current

# If you need to rollback
uv run alembic downgrade -1
```

#### Step 5: Start Backend Server

```bash
# Development mode (auto-reload)
uv run uvicorn src.main:app --reload --port 8000

# Production mode
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
```

**Verify backend is running:**
- API: `http://localhost:8000/api/v1/`
- Swagger docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### Frontend Setup (Detailed)

#### Step 1: Install Node Dependencies

```bash
cd frontend

# Install all dependencies
npm install

# Or using yarn
yarn install
```

#### Step 2: Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Authentication (must match backend)
BETTER_AUTH_SECRET=your-secret-key-must-be-at-least-32-characters-long

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

#### Step 3: Start Development Server

```bash
# Start Next.js development server
npm run dev

# Or with custom port
npm run dev -- -p 3001
```

**Verify frontend is running:**
- App: `http://localhost:3000`
- Should see login/signup page

#### Step 4: Build for Production (Optional)

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## Docker Setup (Alternative)

### Using Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: tasknest
      POSTGRES_PASSWORD: tasknest
      POSTGRES_DB: tasknest
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://tasknest:tasknest@postgres:5432/tasknest
      BETTER_AUTH_SECRET: your-secret-key-min-32-characters
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1
      BETTER_AUTH_SECRET: your-secret-key-min-32-characters
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

**Start all services:**

```bash
# Start all containers
docker-compose up

# Start in background
docker-compose up -d

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up --build
```

---

## Database Management

### Create Migration

```bash
cd backend

# Auto-generate migration from model changes
uv run alembic revision --autogenerate -m "description"

# Create empty migration
uv run alembic revision -m "description"
```

### Apply Migrations

```bash
# Upgrade to latest
uv run alembic upgrade head

# Upgrade one version
uv run alembic upgrade +1

# Downgrade one version
uv run alembic downgrade -1

# Show current version
uv run alembic current

# Show migration history
uv run alembic history
```

### Seed Database (Optional)

Create `backend/scripts/seed.py`:

```python
from src.database import engine
from src.models import User, Tag
from sqlmodel import Session

def seed_data():
    with Session(engine) as session:
        # Create default tags for new users
        default_tags = ["Work", "Home", "Personal", "Shopping", "Health", "Finance"]

        # Add seed logic here
        pass

if __name__ == "__main__":
    seed_data()
```

Run seed script:
```bash
uv run python scripts/seed.py
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html

# Run specific test file
uv run pytest tests/test_tasks.py

# Run specific test
uv run pytest tests/test_tasks.py::test_create_task

# Run with verbose output
uv run pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test TaskList.test.tsx
```

---

## Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Backend
cd backend && uv run uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database (if local)
# PostgreSQL should be running
```

### 2. Make Changes

- Edit code in `backend/src/` or `frontend/src/`
- Changes auto-reload (hot reload enabled)
- Check browser console and terminal for errors

### 3. Test Changes

```bash
# Backend tests
cd backend && uv run pytest

# Frontend tests
cd frontend && npm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add feature description"
git push
```

---

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'src'`
```bash
# Solution: Ensure you're in backend directory and venv is activated
cd backend
uv sync
```

**Problem**: Database connection error
```bash
# Solution: Check DATABASE_URL in .env
# Verify PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

**Problem**: Migration error
```bash
# Solution: Reset database (WARNING: deletes all data)
uv run alembic downgrade base
uv run alembic upgrade head
```

### Frontend Issues

**Problem**: `Module not found` errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: API connection error
```bash
# Solution: Check NEXT_PUBLIC_API_URL in .env.local
# Verify backend is running on correct port
curl http://localhost:8000/api/v1/
```

**Problem**: Authentication not working
```bash
# Solution: Ensure BETTER_AUTH_SECRET matches in both .env files
# Backend: backend/.env
# Frontend: frontend/.env.local
```

### Docker Issues

**Problem**: Port already in use
```bash
# Solution: Stop conflicting services
docker-compose down
lsof -ti:8000 | xargs kill  # Kill process on port 8000
lsof -ti:3000 | xargs kill  # Kill process on port 3000
```

**Problem**: Database connection refused
```bash
# Solution: Wait for PostgreSQL to be ready
docker-compose logs postgres
# Look for "database system is ready to accept connections"
```

---

## Useful Commands

### Backend

```bash
# Format code
uv run black src/

# Lint code
uv run ruff check src/

# Type check
uv run mypy src/

# Start interactive Python shell with app context
uv run python
>>> from src.database import engine
>>> from src.models import Task
```

### Frontend

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Build for production
npm run build

# Analyze bundle size
npm run analyze
```

### Database

```bash
# Connect to database
psql $DATABASE_URL

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql

# Reset database (WARNING: deletes all data)
dropdb tasknest && createdb tasknest
```

---

## IDE Setup

### VS Code

Recommended extensions:
- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

Settings (`.vscode/settings.json`):
```json
{
  "python.defaultInterpreterPath": "./backend/.venv/bin/python",
  "python.linting.enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Next Steps

After setup is complete:

1. ✅ Backend running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:3000`
3. ✅ Database migrations applied
4. ✅ Tests passing

**You're ready to start development!**

### Recommended Reading

- [API Documentation](./contracts/README.md)
- [Data Model](./data-model.md)
- [Implementation Plan](./plan.md)
- [Feature Specification](./spec.md)

### Get Help

- Check [Troubleshooting](#troubleshooting) section
- Review error logs in terminal
- Check browser console for frontend errors
- Review API docs at `http://localhost:8000/docs`

---

**Setup Complete!** 🎉

You're now ready to implement TaskNest Phase 2 features.

**Next Command**: `/sp.tasks` (to generate implementation tasks)
