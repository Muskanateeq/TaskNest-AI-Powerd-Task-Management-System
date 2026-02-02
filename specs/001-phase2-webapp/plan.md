# Implementation Plan: Phase 2 TaskNest Full-Stack Web Application

**Branch**: `001-phase2-webapp` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase2-webapp/spec.md`

## Summary

Transform TaskNest into a production-ready, multi-user web application with comprehensive task management features spanning Basic (CRUD operations), Intermediate (priorities, tags, search, filter, sort), and Advanced (due dates, recurring tasks, reminders) levels. The system implements secure JWT-based authentication with Better Auth, complete user data isolation, and a responsive Next.js frontend communicating with a FastAPI backend via RESTful APIs. All data persists in Neon Serverless PostgreSQL with proper indexing for performance.

**Technical Approach**: Monorepo structure with separate frontend and backend directories. Frontend uses Next.js 15 App Router with TypeScript and Tailwind CSS for responsive UI. Backend uses Python FastAPI with SQLModel ORM for type-safe database operations. Authentication handled by Better Auth on frontend with JWT token verification on backend. All API endpoints enforce user ownership at query level.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 15
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Better Auth, date-fns (date handling)
- Backend: FastAPI, Pydantic, SQLModel, python-jose (JWT), passlib (password hashing), asyncpg (PostgreSQL driver)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, connection pooling enabled)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, pytest-asyncio

**Target Platform**:
- Frontend: Web browsers (Chrome, Firefox, Safari, Edge - last 2 years), deployed to Vercel
- Backend: Linux server (containerized), deployed to cloud platform

**Project Type**: Web application (frontend + backend monorepo)

**Performance Goals**:
- API response time: < 500ms for CRUD operations
- Frontend initial load: < 3 seconds
- Search/filter operations: < 500ms
- Support 10,000 concurrent users

**Constraints**:
- All API endpoints must require JWT authentication
- User data isolation enforced at database query level
- No direct database access from frontend
- Stateless backend for horizontal scaling
- HTTPS enforced in production

**Scale/Scope**:
- 10,000 concurrent users
- 100,000 total users
- 10,000 tasks per user maximum
- 13 integrated features (Basic + Intermediate + Advanced)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Spec-Driven Development
- **Status**: PASS
- **Evidence**: Complete specification created with 22 user stories, 6 functional requirement categories, 10 acceptance criteria
- **Compliance**: Following Spec → Plan → Tasks → Implementation workflow

### ✅ Principle II: Unified Advanced Task Management
- **Status**: PASS
- **Evidence**: All Basic + Intermediate + Advanced features designed as single cohesive system
- **Compliance**: Single Task entity with all fields (priority, tags, due_date, recurrence_pattern), unified API endpoints

### ✅ Principle III: Multi-User Ownership Enforcement
- **Status**: PASS
- **Evidence**: All database queries filter by user_id extracted from JWT token
- **Compliance**: Backend never trusts user_id from request parameters, ownership validated before all operations

### ✅ Principle IV: Authentication-First Security
- **Status**: PASS
- **Evidence**: Better Auth integration planned, JWT verification middleware on all endpoints
- **Compliance**: Authentication implemented before feature development, all endpoints protected

### ✅ Principle V: REST API Contract Enforcement
- **Status**: PASS
- **Evidence**: RESTful API design with clear contracts, no direct DB access from frontend
- **Compliance**: All backend functionality exposed via API, contracts defined in Phase 1

### ✅ Principle VI: Frontend Realism Rules
- **Status**: PASS
- **Evidence**: Loading states, error handling, optimistic updates specified
- **Compliance**: All API calls include loading indicators, error notifications, retry mechanisms

### ✅ Principle VII: Full-Stack Integration
- **Status**: PASS
- **Evidence**: Tight integration between Next.js and FastAPI, shared JWT secret
- **Compliance**: Clear API contracts, consistent data models, end-to-end features

### ✅ Principle VIII: Cloud-Native Architecture
- **Status**: PASS
- **Evidence**: Stateless backend, externalized config, 12-factor principles
- **Compliance**: Container-ready, Neon Serverless PostgreSQL, environment variables

### ✅ Principle IX: Data Integrity and Persistence
- **Status**: PASS
- **Evidence**: SQLModel with proper relationships, indexes on frequently queried fields
- **Compliance**: Transaction-safe operations, foreign keys, validation constraints

**Overall Gate Status**: ✅ **PASSED** - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-phase2-webapp/
├── spec.md              # Feature specification (WHAT to build)
├── plan.md              # This file - Implementation plan (HOW to build)
├── research.md          # Phase 0 output - Technology research and decisions
├── data-model.md        # Phase 1 output - Database schema and entities
├── quickstart.md        # Phase 1 output - Developer setup guide
├── contracts/           # Phase 1 output - API contracts
│   ├── openapi.yaml     # OpenAPI 3.0 specification
│   └── README.md        # API documentation
├── checklists/          # Quality validation
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend monorepo)

backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # Database connection and session management
│   ├── models/                 # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py             # User model (managed by Better Auth)
│   │   ├── task.py             # Task model with all fields
│   │   ├── tag.py              # Tag model
│   │   └── task_tag.py         # TaskTag junction table
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py             # Authentication schemas
│   │   ├── task.py             # Task CRUD schemas
│   │   └── tag.py              # Tag schemas
│   ├── api/                    # API route handlers
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependency injection (JWT verification)
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── tasks.py            # Task CRUD endpoints
│   │   └── tags.py             # Tag management endpoints
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Authentication logic
│   │   ├── task_service.py     # Task operations (CRUD, search, filter)
│   │   └── recurrence_service.py # Recurring task logic
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       ├── jwt.py              # JWT token handling
│       └── security.py         # Password hashing
├── tests/
│   ├── conftest.py             # Pytest fixtures
│   ├── test_auth.py            # Authentication tests
│   ├── test_tasks.py           # Task CRUD tests
│   ├── test_search_filter.py  # Search and filter tests
│   └── test_recurrence.py     # Recurring task tests
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
├── .env.example                # Environment variables template
├── pyproject.toml              # Python dependencies (uv)
└── README.md                   # Backend setup instructions

frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (redirects to /tasks)
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx    # Signup page
│   │   └── (app)/              # Protected app routes
│   │       ├── layout.tsx      # App layout with navigation
│   │       └── tasks/
│   │           └── page.tsx    # Task list page
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── tasks/              # Task management components
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       ├── TaskForm.tsx
│   │       ├── TaskFilters.tsx
│   │       ├── TaskSearch.tsx
│   │       └── RecurrenceSelector.tsx
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts              # API client (fetch wrapper)
│   │   ├── auth.ts             # Better Auth configuration
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Helper functions
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useTasks.ts         # Task management hook
│   │   └── useNotifications.ts # Browser notifications hook
│   └── styles/
│       └── globals.css         # Global styles (Tailwind)
├── public/                     # Static assets
├── tests/
│   ├── components/             # Component tests
│   └── integration/            # Integration tests
├── .env.local.example          # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Node dependencies
└── README.md                   # Frontend setup instructions

# Root level files
.gitignore
docker-compose.yml              # Local development setup
README.md                       # Project overview and setup
CLAUDE.md                       # Claude Code instructions
```

**Structure Decision**: Web application monorepo structure selected because:
1. Frontend and backend are tightly coupled (shared API contracts)
2. Easier to maintain consistency across layers
3. Single repository simplifies version control and deployment
4. Claude Code can work across both layers in single context
5. Aligns with constitution requirement for full-stack integration

## Complexity Tracking

> **No violations detected** - All constitutional principles satisfied without exceptions.

## Phase 0: Research & Technology Decisions

### Research Areas

All technology choices are defined in the constitution. No research needed for:
- ✅ Frontend framework: Next.js 15 (App Router) - specified in constitution
- ✅ Backend framework: FastAPI - specified in constitution
- ✅ Database: Neon Serverless PostgreSQL - specified in constitution
- ✅ ORM: SQLModel - specified in constitution
- ✅ Authentication: Better Auth + JWT - specified in constitution

### Additional Research Required

**R1: Recurring Task Implementation Pattern**
- **Question**: How to implement recurring task generation (on completion vs scheduled job)?
- **Options**:
  - A) Generate next occurrence when task marked complete (synchronous)
  - B) Background job checks for completed recurring tasks (asynchronous)
- **Decision**: Option A (synchronous generation)
- **Rationale**: Simpler implementation, immediate feedback, no background job infrastructure needed in Phase 2

**R2: Browser Notification Implementation**
- **Question**: How to handle browser notification permissions and delivery?
- **Options**:
  - A) Client-side JavaScript timers check for due tasks
  - B) Service Worker with Push API
- **Decision**: Option A (client-side timers)
- **Rationale**: Simpler for Phase 2, works when app is open, no push server needed

**R3: Tag Storage Pattern**
- **Question**: Should tags be user-specific or global?
- **Options**:
  - A) Global tags shared across all users
  - B) User-specific tags (each user has own tag namespace)
- **Decision**: Option B (user-specific tags)
- **Rationale**: Better data isolation, users can create custom tags without conflicts

**R4: Search Implementation**
- **Question**: How to implement case-insensitive search in PostgreSQL?
- **Options**:
  - A) Use ILIKE operator
  - B) Use full-text search (tsvector)
- **Decision**: Option A (ILIKE) for Phase 2
- **Rationale**: Simpler implementation, sufficient for title/description search, can upgrade to full-text search later

**R5: Date/Time Handling**
- **Question**: How to handle time zones for due dates?
- **Options**:
  - A) Store in UTC, display in user's local time zone
  - B) Store user's time zone preference
- **Decision**: Option A (UTC storage)
- **Rationale**: Standard practice, browser automatically converts to local time, no time zone storage needed

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 15.x | React framework with App Router |
| | TypeScript | 5.x | Type safety |
| | Tailwind CSS | 3.x | Styling |
| | Better Auth | Latest | Authentication library |
| | date-fns | 3.x | Date manipulation |
| **Backend** | Python | 3.11+ | Programming language |
| | FastAPI | 0.109+ | API framework |
| | SQLModel | 0.0.14+ | ORM with Pydantic integration |
| | Pydantic | 2.x | Data validation |
| | python-jose | 3.x | JWT handling |
| | passlib | 1.7+ | Password hashing |
| | asyncpg | 0.29+ | PostgreSQL async driver |
| **Database** | PostgreSQL | 15+ | Neon Serverless |
| **Testing** | pytest | 7.x | Backend testing |
| | Jest | 29.x | Frontend testing |
| **Deployment** | Docker | Latest | Containerization |
| | Vercel | N/A | Frontend hosting |

## Phase 1: Data Model & API Contracts

### Data Model Overview

See [data-model.md](./data-model.md) for complete entity definitions, relationships, and validation rules.

**Core Entities**:
1. **User** - Managed by Better Auth (email, password_hash, created_at)
2. **Task** - Main entity with all task management fields
3. **Tag** - User-specific tags for categorization
4. **TaskTag** - Many-to-many relationship between tasks and tags

**Key Relationships**:
- User → Tasks (one-to-many)
- User → Tags (one-to-many)
- Task ↔ Tags (many-to-many via TaskTag)

### API Contracts Overview

See [contracts/](./contracts/) for complete OpenAPI specification.

**Endpoint Categories**:
1. **Authentication** - Register, login, logout, token refresh
2. **Tasks** - CRUD operations, search, filter, sort
3. **Tags** - Create, list, delete user tags
4. **Recurring Tasks** - Manage recurrence patterns

**Authentication**: All endpoints (except auth) require `Authorization: Bearer <token>` header

### Developer Quickstart

See [quickstart.md](./quickstart.md) for complete setup instructions.

**Quick Setup**:
1. Clone repository
2. Setup backend: `cd backend && uv sync && uv run alembic upgrade head`
3. Setup frontend: `cd frontend && npm install`
4. Configure environment variables
5. Run: `docker-compose up` (starts both frontend and backend)

## Phase 2: Task Breakdown

**Note**: Task breakdown is handled by the `/sp.tasks` command and will generate `tasks.md` in this directory.

The tasks will be organized into:
1. **Setup Tasks** - Project initialization, dependencies, configuration
2. **Backend Tasks** - Database models, API endpoints, business logic
3. **Frontend Tasks** - Components, pages, API integration
4. **Integration Tasks** - End-to-end feature testing
5. **Deployment Tasks** - Docker, Vercel, environment setup

## Implementation Notes

### Critical Path
1. Authentication system (blocks all other features)
2. Basic task CRUD (foundation for other features)
3. Intermediate features (priorities, tags, search, filter, sort)
4. Advanced features (due dates, recurring tasks, reminders)

### Risk Mitigation
1. **Recurring Task Complexity**: Start with simple patterns (daily, weekly), add comprehensive tests
2. **Performance**: Add database indexes early, test with large datasets
3. **Browser Notifications**: Graceful degradation if permissions denied
4. **Time Zones**: Store UTC, display local, show time zone in UI

### Testing Strategy
1. **Unit Tests**: All business logic functions (services layer)
2. **Integration Tests**: API endpoints with database
3. **Component Tests**: React components in isolation
4. **E2E Tests**: Critical user flows (auth, task CRUD)

### Deployment Strategy
1. **Backend**: Containerized FastAPI, deployed to cloud platform
2. **Frontend**: Static export to Vercel CDN
3. **Database**: Neon Serverless PostgreSQL (managed)
4. **Environment**: Separate dev/staging/production environments

## Success Criteria

Implementation is complete when:
1. ✅ All 13 features working end-to-end (Basic + Intermediate + Advanced)
2. ✅ All 10 acceptance criteria from spec passing
3. ✅ All constitutional principles satisfied
4. ✅ Performance targets met (< 500ms CRUD, < 3s load)
5. ✅ Security audit passed (no vulnerabilities)
6. ✅ Deployed to staging and production
7. ✅ Documentation complete (API docs, setup guide)

---

**Plan Version**: 1.0
**Status**: Ready for Phase 1 (Data Model & Contracts)
**Next Command**: Generate data-model.md, contracts/, and quickstart.md
