# TaskNest - AI-Powered Task Management System

**Modern Task Management System with Advanced AI Features**

TaskNest is a production-ready, AI-powered task management system that combines traditional task organization with intelligent automation. Built with Next.js 15, FastAPI, and OpenAI integration, it features an AI chatbot assistant that can create, update, search, and manage your tasks through natural language conversations. The system includes comprehensive task organization with priorities, tags, search, filtering, due dates, recurring tasks, browser notifications, and an intelligent MCP (Model Context Protocol) server that enables the AI to interact directly with your task database, analytics, and team management features.

## 🎨 Design Theme

**Color Scheme**: Black (#000000), White (#FFFFFF), Gamboge (#E49B0F)
- Modern, interactive, powerful UI design
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)

## ✨ Features

### 🤖 AI-Powered Task Management
- **Intelligent Chatbot Assistant**: Natural language interface for task management
- **Voice-like Interactions**: Chat with AI to create, update, search, and organize tasks
- **Context-Aware Responses**: AI understands your task history and preferences
- **Smart Suggestions**: Get recommendations for task organization and prioritization
- **MCP Server Integration**: AI directly interacts with your database through Model Context Protocol
- **Real-time Task Operations**: Create multiple tasks, update priorities, set due dates via chat
- **Advanced Search**: Ask AI to find tasks by any criteria in natural language
- **Analytics Insights**: Query your productivity metrics through conversational AI

### 📊 Task Organization & Management
- ✅ **Core CRUD Operations**: Create, read, update, delete tasks with rich details
- ✅ **Priority Management**: High, Medium, Low priorities with visual color coding
- ✅ **Custom Tags & Categories**: Organize tasks with flexible tagging system
- ✅ **Advanced Search**: Keyword search across titles, descriptions, and tags
- ✅ **Smart Filtering**: Filter by status, priority, tags, due dates, and custom criteria
- ✅ **Multi-Sort Options**: Sort by creation date, due date, priority, or title
- ✅ **Bulk Operations**: Select and manage multiple tasks simultaneously

### ⏰ Time Management & Automation
- ✅ **Due Dates & Times**: Full date/time picker with timezone support
- ✅ **Recurring Tasks**: Daily, weekly, monthly, or custom recurrence patterns
- ✅ **Browser Notifications**: Real-time reminders for upcoming and overdue tasks
- ✅ **Overdue Indicators**: Visual alerts for tasks past their due date
- ✅ **Task History**: Track all changes and updates to your tasks
- ✅ **Notification Preferences**: Customize when and how you receive alerts

### 👥 Team Collaboration
- ✅ **Team Management**: Create and manage teams with role-based access
- ✅ **Team Invitations**: Invite members via email with secure tokens
- ✅ **Shared Tasks**: Collaborate on tasks within team workspaces
- ✅ **Activity Tracking**: Monitor team member contributions and task updates
- ✅ **Permission Controls**: Owner, admin, and member roles with different access levels

### 📈 Analytics & Insights
- ✅ **Productivity Dashboard**: Visual charts and metrics for task completion
- ✅ **Custom Reports**: Generate reports based on date ranges and criteria
- ✅ **Analytics Snapshots**: Historical data tracking for trend analysis
- ✅ **Export Capabilities**: Download reports in multiple formats
- ✅ **Performance Metrics**: Track completion rates, overdue tasks, and productivity trends

### 🔒 Security & Authentication
- ✅ **Better Auth Integration**: Modern, secure authentication system
- ✅ **JWT Token-Based Auth**: Stateless authentication with refresh tokens
- ✅ **Complete Data Isolation**: Users can only access their own data
- ✅ **Secure Password Hashing**: Bcrypt with salt for password storage
- ✅ **Session Management**: Automatic token refresh and secure logout
- ✅ **CORS Protection**: Configured for allowed origins only

### 🔌 MCP Server Capabilities
- ✅ **Direct Database Access**: AI can query and modify tasks through MCP protocol
- ✅ **Tool-Based Operations**: Structured tools for create, read, update, delete operations
- ✅ **Analytics Tools**: AI can fetch productivity metrics and generate insights
- ✅ **Search Tools**: Advanced search capabilities exposed to AI agents
- ✅ **Team Management Tools**: AI can help manage team invitations and members
- ✅ **Notification Tools**: AI can configure and manage user notification preferences

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 15 (App Router with React Server Components)
- TypeScript 5.x
- Tailwind CSS 4.x
- Better Auth (JWT authentication)
- OpenAI ChatKit (AI chat interface)
- React Query (data fetching & caching)
- Chart.js (analytics visualization)

**Backend:**
- Python 3.11+
- FastAPI (async API framework)
- SQLModel (ORM with Pydantic)
- Alembic (database migrations)
- OpenAI API (AI chat integration)
- MCP Server (Model Context Protocol)

**AI & Integration:**
- OpenAI GPT-4 (conversational AI)
- Claude Agent SDK (agent orchestration)
- MCP SDK (Model Context Protocol for tool use)
- Custom MCP Tools (task management, analytics, search)

**Database:**
- Neon Serverless PostgreSQL (production)
- PostgreSQL 15+ (local development)

**DevOps & Deployment:**
- Docker & Docker Compose
- Kubernetes (Minikube for local, planned DOKS for cloud)
- Helm Charts (application packaging)
- kubectl-ai & kagent (AI-powered cluster management)

**Development Tools:**
- uv (Python package manager)
- ESLint & Prettier (code quality)
- Pytest (backend testing)
- Jest & React Testing Library (frontend testing)

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
│   │   │   ├── tasks.py    # Task CRUD endpoints
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   ├── chat.py     # AI chat endpoints
│   │   │   ├── analytics.py # Analytics endpoints
│   │   │   ├── teams.py    # Team management endpoints
│   │   │   └── notifications.py # Notification endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── task_service.py
│   │   │   ├── chat_service.py # OpenAI integration
│   │   │   └── analytics_service.py
│   │   ├── mcp/            # MCP Server implementation
│   │   │   ├── server.py   # MCP server setup
│   │   │   └── tools.py    # MCP tools for AI
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
│   │   │   ├── (app)/      # Authenticated app routes
│   │   │   │   ├── dashboard/  # Main dashboard
│   │   │   │   ├── tasks/      # Task management
│   │   │   │   ├── chat/       # AI chatbot interface
│   │   │   │   ├── analytics/  # Analytics dashboard
│   │   │   │   ├── teams/      # Team management
│   │   │   │   ├── notifications/ # Notification center
│   │   │   │   └── settings/   # User settings
│   │   │   └── (auth)/     # Authentication routes
│   │   ├── components/     # React components
│   │   │   ├── chat/       # Chat UI components
│   │   │   ├── tasks/      # Task components
│   │   │   ├── analytics/  # Chart components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── lib/            # Utility libraries
│   │   │   ├── auth.ts     # Better Auth client
│   │   │   └── api.ts      # API client
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container
│   ├── package.json        # Node dependencies
│   └── .env.local.example  # Environment variables template
│
├── helm/                   # Kubernetes Helm charts
│   └── tasknest/          # Main application chart
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       └── charts/        # Subcharts
│           ├── frontend/
│           ├── backend/
│           └── postgresql/
│
├── specs/                  # Specification documents
│   ├── 001-phase2-webapp/
│   │   ├── spec.md         # Phase II specification
│   │   ├── plan.md         # Implementation plan
│   │   └── tasks.md        # Task breakdown
│   ├── 002-phase3-chatbot/
│   │   ├── spec.md         # Phase III specification
│   │   ├── plan.md         # Implementation plan
│   │   └── tasks.md        # Task breakdown
│   └── 004-kubernetes-deployment/
│       ├── spec.md         # Phase IV specification
│       ├── plan.md         # Implementation plan
│       └── tasks.md        # Task breakdown (ready)
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
- **OpenAI API Key** (required for AI chat features) - Get from https://platform.openai.com

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
   # Edit backend/.env and add:
   # - DATABASE_URL (Neon PostgreSQL connection string)
   # - BETTER_AUTH_SECRET (32-character secret)
   # - OPENAI_API_KEY (for AI chat features)

   # Frontend
   cp frontend/TaskNest/.env.local.example frontend/TaskNest/.env.local
   # Edit frontend/TaskNest/.env.local and add:
   # - BETTER_AUTH_SECRET (same as backend)
   # - NEXT_PUBLIC_API_URL (backend URL)
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
   - AI Chat Interface: http://localhost:3000/chat

6. **Try the AI Chat**
   - Register/login to your account
   - Navigate to the Chat page
   - Ask the AI: "Create a task to review project documentation"
   - The AI will create the task and confirm the action

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
   # Edit .env and configure:
   # - DATABASE_URL (Neon PostgreSQL connection string)
   # - BETTER_AUTH_SECRET (32-character secret)
   # - OPENAI_API_KEY (for AI chat features)
   # - CORS_ORIGINS (frontend URL)
   ```

4. **Run database migrations**
   ```bash
   uv run alembic upgrade head
   uv run
   ```

5. **Start the backend server**
   ```bash
   uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8001  
   ```

6. **Start MCP Server (optional, for AI agent integration)**
   ```bash
   uv run python -m src.mcp.server
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
   # Edit .env.local and configure:
   # - NEXT_PUBLIC_API_URL (backend URL, e.g., http://localhost:8000)
   # - BETTER_AUTH_SECRET (same as backend)
   # - BETTER_AUTH_URL (frontend URL, e.g., http://localhost:3000)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - AI Chat: http://localhost:3000/chat

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

**AI Chat:**
- `POST /api/v1/chat` - Send message to AI chatbot
- `GET /api/v1/chat/history` - Get chat conversation history
- `DELETE /api/v1/chat/history` - Clear chat history

**Analytics:**
- `GET /api/v1/analytics/overview` - Get productivity overview
- `GET /api/v1/analytics/trends` - Get completion trends
- `POST /api/v1/analytics/reports` - Generate custom reports
- `GET /api/v1/analytics/snapshots` - Get historical snapshots

**Teams:**
- `GET /api/v1/teams` - List user teams
- `POST /api/v1/teams` - Create new team
- `POST /api/v1/teams/{id}/invite` - Invite team member
- `GET /api/v1/teams/{id}/members` - List team members
- `DELETE /api/v1/teams/{id}/members/{user_id}` - Remove member

**Notifications:**
- `GET /api/v1/notifications` - List user notifications
- `GET /api/v1/notifications/preferences` - Get notification preferences
- `PUT /api/v1/notifications/preferences` - Update preferences
- `PATCH /api/v1/notifications/{id}/read` - Mark as read

**Tags:**
- `GET /api/v1/tags` - List user tags
- `POST /api/v1/tags` - Create new tag
- `DELETE /api/v1/tags/{id}` - Delete tag

### MCP Server Tools

The MCP server exposes the following tools for AI agents:

**Task Management:**
- `create_task` - Create new tasks with all properties
- `get_tasks` - Retrieve tasks with filtering and search
- `update_task` - Update existing task properties
- `delete_task` - Delete tasks by ID
- `complete_task` - Toggle task completion status

**Search & Analytics:**
- `search_tasks` - Advanced search across all task fields
- `get_analytics` - Fetch productivity metrics and insights
- `get_task_statistics` - Get task counts by status, priority

**Team Operations:**
- `get_teams` - List user's teams
- `invite_team_member` - Send team invitations

**Notification Management:**
- `get_notifications` - Retrieve user notifications
- `update_notification_preferences` - Configure notification settings

## 🔒 Security

- **JWT Authentication**: All API endpoints require valid JWT tokens
- **User Data Isolation**: Users can only access their own data through strict authorization checks
- **Password Hashing**: Bcrypt with salt for secure password storage
- **HTTPS**: Enforced in production environments
- **CORS**: Configured for allowed origins only with strict policies
- **SQL Injection Prevention**: Parameterized queries via SQLModel ORM
- **MCP Security**: AI tool access restricted to authenticated users only
- **API Rate Limiting**: Protection against abuse and DDoS attacks
- **Secure Token Storage**: JWT tokens stored securely with httpOnly cookies
- **Input Validation**: All user inputs validated and sanitized
- **Environment Variables**: Sensitive data stored in environment variables, never in code

## 🎯 Development Workflow

This project follows **Spec-Driven Development (SDD)** methodology:

1. **Specification** (spec.md) - Define WHAT to build with clear requirements and user stories
2. **Planning** (plan.md) - Define HOW to architect with technical decisions and design
3. **Tasks** (tasks.md) - Break into atomic, testable work units with acceptance criteria
4. **Implementation** - Build via Claude Code with AI assistance
5. **Testing** - Validate acceptance criteria and run automated tests
6. **Documentation** - Create comprehensive guides and API documentation
7. **Deployment** - Deploy to production with CI/CD pipelines

All development is guided by the constitution in `.specify/memory/constitution.md`.

### Development Phases Completed

**Phase I - Console App** ✅
- In-memory Python task manager
- Basic CRUD operations
- Command-line interface

**Phase II - Full-Stack Web App** ✅
- Next.js frontend with modern UI
- FastAPI backend with REST API
- PostgreSQL database with migrations
- User authentication and authorization
- Advanced task management features

**Phase III - AI-Powered Chatbot** ✅
- OpenAI GPT-4 integration
- Natural language task management
- MCP server for AI tool use
- Chat history and context management
- Real-time AI responses

**Phase IV - Kubernetes Deployment** 📋
- Specification and planning complete
- Docker containerization ready
- Helm charts designed
- Minikube setup documented
- kubectl-ai and kagent integration planned
- Implementation tasks defined (25 tasks)

**Phase V - Cloud Deployment** 🔜
- Kafka message queue
- Dapr microservices framework
- DigitalOcean Kubernetes (DOKS)
- Production monitoring and logging

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
