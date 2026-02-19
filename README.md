# TaskNest - Phase 2 Full-Stack Web Application

**Modern Task Management System with Advanced Features**

TaskNest is a production-ready, multi-user task management web application built with Next.js 15 and FastAPI. It features comprehensive task organization capabilities including priorities, tags, search, filtering, due dates, recurring tasks, and browser notifications.

## 🎨 Design Theme

**Color Scheme**: Black (#000000), White (#FFFFFF), Gamboge (#E49B0F)
- Modern, interactive, powerful UI design
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)

## ✨ Features

### Basic Level (Core CRUD)
- ✅ Create tasks with title and description
- ✅ View all tasks in organized list
- ✅ Update task details
- ✅ Delete tasks with confirmation
- ✅ Mark tasks as complete/incomplete

### Intermediate Level (Organization)
- ✅ Task priorities (High, Medium, Low) with color coding
- ✅ Custom tags and categories
- ✅ Search tasks by keyword
- ✅ Filter by status, priority, tags, due date
- ✅ Sort by creation date, due date, priority, title

### Advanced Level (Intelligence)
- ✅ Due dates with date/time pickers
- ✅ Recurring tasks (daily, weekly, monthly, custom)
- ✅ Browser notifications and reminders
- ✅ Overdue task indicators

### Security & Authentication
- ✅ User registration and login (Better Auth)
- ✅ JWT token-based authentication
- ✅ Complete user data isolation
- ✅ Secure password hashing

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript 5.x
- Tailwind CSS 4.x
- Better Auth (JWT authentication)

**Backend:**
- Python 3.11+
- FastAPI (async API framework)
- SQLModel (ORM with Pydantic)
- Alembic (database migrations)

**Database:**
- Neon Serverless PostgreSQL

**Development:**
- Docker & Docker Compose
- uv (Python package manager)
- ESLint & Prettier

### Project Structure

```
phase-2/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── main.py         # Application entry point
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   ├── models/         # SQLModel database models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── api/            # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Middleware components
│   │   └── utils/          # Utility functions
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend container
│   ├── pyproject.toml      # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/TaskNest/      # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility libraries
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container
│   ├── package.json        # Node dependencies
│   └── .env.local.example  # Environment variables template
│
├── specs/                  # Specification documents
│   └── 001-phase2-webapp/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Implementation plan
│       ├── tasks.md        # Task breakdown
│       └── contracts/      # API contracts
│
├── docker-compose.yml      # Local development setup
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose (optional, for containerized setup)
- **uv** (Python package manager) - Install: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Neon PostgreSQL** account (free tier available at https://neon.tech)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phase-2
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your Neon DATABASE_URL and BETTER_AUTH_SECRET

   # Frontend
   cp frontend/TaskNest/.env.local.example frontend/TaskNest/.env.local
   # Edit frontend/TaskNest/.env.local and add matching BETTER_AUTH_SECRET
   ```

3. **Generate a secure secret key**
   ```bash
   # Use this command to generate a secure 32-character secret
   openssl rand -hex 32
   # Add this to BETTER_AUTH_SECRET in both backend/.env and frontend/.env.local
   ```

4. **Start all services**
   ```bash
   docker-compose up
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   uv sync
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and configure DATABASE_URL and BETTER_AUTH_SECRET
   ```

4. **Run database migrations**
   ```bash
   uv run alembic upgrade head
   ```

5. **Start the backend server**
   ```bash
   uv run uvicorn src.main:app --reload --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/TaskNest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and configure API_URL and BETTER_AUTH_SECRET
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🗄️ Database Setup

### Using Neon Serverless PostgreSQL (Recommended)

1. **Create a Neon account** at https://neon.tech
2. **Create a new project** and database
3. **Copy the connection string** from the Neon dashboard
4. **Add to backend/.env**:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/tasknest?sslmode=require
   ```

### Using Local PostgreSQL (Development)

If using Docker Compose, PostgreSQL is automatically set up. Otherwise:

1. **Install PostgreSQL** 15+
2. **Create database**:
   ```bash
   createdb tasknest
   ```
3. **Update backend/.env**:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/tasknest
   ```

## 🧪 Testing

### Backend Tests

```bash
cd backend
uv run pytest
```

### Frontend Tests

```bash
cd frontend/TaskNest
npm test
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

**Tasks:**
- `GET /api/v1/tasks` - List all tasks (with search, filter, sort)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `PATCH /api/v1/tasks/{id}/complete` - Toggle completion

**Tags:**
- `GET /api/v1/tags` - List user tags
- `POST /api/v1/tags` - Create new tag
- `DELETE /api/v1/tags/{id}` - Delete tag

## 🔒 Security

- **JWT Authentication**: All API endpoints require valid JWT tokens
- **User Data Isolation**: Users can only access their own data
- **Password Hashing**: Bcrypt with salt
- **HTTPS**: Enforced in production
- **CORS**: Configured for allowed origins only
- **SQL Injection Prevention**: Parameterized queries via SQLModel

## 🎯 Development Workflow

This project follows **Spec-Driven Development (SDD)**:

1. **Specification** (spec.md) - Define WHAT to build
2. **Planning** (plan.md) - Define HOW to architect
3. **Tasks** (tasks.md) - Break into atomic work units
4. **Implementation** - Build via Claude Code
5. **Testing** - Validate acceptance criteria
6. **Deployment** - Deploy to production

All development is guided by the constitution in `.specify/memory/constitution.md`.

## 📦 Deployment

### Frontend (Vercel)

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic on git push

### Backend (Cloud Platform)

1. **Build Docker image**:
   ```bash
   docker build -t tasknest-backend ./backend
   ```

2. **Push to container registry**

3. **Deploy to cloud platform** (AWS, GCP, Azure, DigitalOcean)

4. **Configure environment variables** in cloud platform

5. **Run database migrations**:
   ```bash
   docker run tasknest-backend uv run alembic upgrade head
   ```

## 🤝 Contributing

This project is part of the Panaversity Hackathon II. Contributions follow the Spec-Driven Development workflow.

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai/code)
- Spec-Kit Plus for specification management
- Panaversity Hackathon II

## 📞 Support

For issues and questions:
- Check the [API documentation](http://localhost:8000/docs)
- Review the [specification](./specs/001-phase2-webapp/spec.md)
- See the [implementation plan](./specs/001-phase2-webapp/plan.md)

---

**Built with ❤️ using Spec-Driven Development**
