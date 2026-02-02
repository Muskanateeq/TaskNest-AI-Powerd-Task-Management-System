<!--
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Created: 2026-02-02
Added sections: All 9 Core Principles, Technology Stack, Architecture Constraints, Development Workflow, Governance
Templates requiring updates: ⚠ pending (.specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md)
-->

# TaskNest Phase 2 - Full-Stack Web Application Constitution

**Version**: 1.0.0
**Ratified**: 2026-02-02
**Last Amended**: 2026-02-02

## Purpose

This constitution defines the non-negotiable principles, constraints, and governance for the TaskNest Phase 2 project. All development, architecture decisions, and code must comply with these principles. This document serves as the single source of truth for project standards and practices.

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All development MUST follow the Spec-Driven approach: **Spec → Plan → Tasks → Implementation via Claude Code**.

**Rules:**
- Specifications must be written BEFORE implementation begins
- No manual coding is allowed - all code must be generated through Claude Code based on refined specifications
- Each phase (Spec, Plan, Tasks) must be completed and validated before moving to the next
- Specifications must include clear acceptance criteria and user stories
- If Claude Code cannot generate correct output, the specification must be refined, not the code manually written

**Rationale:** Spec-Driven Development ensures alignment between requirements and implementation, reduces technical debt, and enables AI-assisted development at scale.

### II. Unified Advanced Task Management (NON-NEGOTIABLE)

All task-related functionality must be implemented as ONE unified, cohesive system encompassing all feature levels:

**Basic Level Features:**
- Task creation (title, description)
- Task update (modify title/description)
- Task deletion
- View task list
- Mark task as complete/incomplete

**Intermediate Level Features:**
- Task priorities (High, Medium, Low)
- Tags/Categories (Work, Home, Personal, etc.)
- Search functionality (by keyword)
- Filter functionality (by status, priority, date, tags)
- Sort functionality (by due date, priority, alphabetically, creation date)

**Advanced Level Features:**
- Recurring tasks (daily, weekly, monthly, custom intervals)
- Due dates with date/time pickers
- Time-based reminders and notifications (browser notifications, architecture-ready for email/SMS)

**Rules:**
- All features must work seamlessly together with consistent UI/UX patterns
- API design must be unified - no separate endpoints for "basic" vs "advanced" features
- Database schema must support all features from day one
- No artificial separation into phases - implement as integrated system
- User experience must be cohesive across all feature levels

**Rationale:** Unified implementation prevents technical debt, ensures consistent user experience, and avoids costly refactoring when adding "advanced" features later.

### III. Multi-User Ownership Enforcement (NON-NEGOTIABLE)

Every task and data entity must belong to exactly ONE authenticated user, with strict ownership enforcement at all layers.

**Rules:**
- Backend MUST NEVER trust `user_id` from request body, URL parameters, or headers
- `user_id` MUST be extracted exclusively from the validated JWT token
- All database queries MUST include user ownership filter: `WHERE user_id = <token_user_id>`
- No direct access to other users' data is permitted under any circumstances
- Ownership validation must occur BEFORE any data operation (read, write, update, delete)
- API must return 403 Forbidden for ownership violations, 404 Not Found for non-existent resources (after ownership check)

**Rationale:** Multi-tenancy security is critical. Trusting client-provided user IDs creates severe security vulnerabilities allowing unauthorized data access.

### IV. Authentication-First Security (NON-NEGOTIABLE)

Security and user authentication must be implemented as a foundational layer, not as an afterthought.

**Rules:**
- Better Auth integration on frontend with JWT token issuance
- All API endpoints MUST require JWT token authentication without exception
- JWT verification on backend using shared `BETTER_AUTH_SECRET` environment variable
- Authentication middleware must be applied consistently across all routes
- JWT tokens expire after 7 days with automatic refresh mechanism
- 401 Unauthorized response for missing or invalid tokens
- 403 Forbidden response for valid tokens with insufficient permissions
- User isolation enforced at database query level (see Principle III)

**Rationale:** Authentication must be built into the foundation. Retrofitting security later introduces vulnerabilities and requires extensive refactoring.

### V. REST API Contract Enforcement (NON-NEGOTIABLE)

The REST API serves as the ONLY interface between frontend and backend. No direct database access from frontend is permitted.

**Rules:**
- All backend functionality must be exposed through RESTful API endpoints
- All endpoints must be JWT-protected (see Principle IV)
- API contracts must not drift from specifications without corresponding spec updates
- Any changes to API endpoints, request/response schemas, or behavior must be reflected in API specifications BEFORE implementation
- Consistent error handling patterns and HTTP status codes as defined in API specification
- JSON request/response format exclusively
- API versioning via URL path: `/api/v1/`

**Rationale:** Clear API contracts enable independent frontend/backend development, facilitate testing, and prevent tight coupling.

### VI. Frontend Realism Rules (NON-NEGOTIABLE)

The frontend must implement real application UI behavior with proper loading states, error handling, and user feedback mechanisms.

**Rules:**
- All API calls must include appropriate loading indicators (spinners, skeleton screens, disabled buttons)
- Error notifications must be displayed for failed operations with user-friendly messages
- Retry mechanisms must be provided for recoverable errors (network failures)
- Optimistic UI updates for operations expected to succeed (e.g., marking task complete)
- Pessimistic UI updates for critical operations (e.g., task deletion with confirmation)
- Form validation must occur before API submission (client-side validation)
- Network failures must be handled gracefully with appropriate user notifications
- State management must handle race conditions and concurrent operations

**Rationale:** Production-ready applications require robust error handling and user feedback. Ignoring these creates poor user experience and support burden.

### VII. Full-Stack Integration

The application must maintain tight integration between Next.js frontend and FastAPI backend with clear contracts.

**Rules:**
- API contracts must be clearly defined and maintained in specifications
- Data models must be consistent across frontend (TypeScript interfaces) and backend (Pydantic models)
- All features must be implemented end-to-end before moving to the next feature
- Authentication tokens must be verified in FastAPI using shared `BETTER_AUTH_SECRET`
- Secure communication between frontend and backend with proper CORS configuration
- User isolation enforced for all data access operations

**Rationale:** Tight integration with clear contracts prevents integration issues and enables rapid feature development.

### VIII. Cloud-Native Architecture

All components must be designed for cloud deployment with containerization and scalability in mind.

**Rules:**
- Backend must be stateless to support horizontal scaling
- All configuration must be externalized via environment variables
- Follow 12-factor app principles (config, dependencies, processes, port binding, etc.)
- Deployment readiness must be considered from initial development phase
- Architecture must support time-based reminders/notifications and recurring task scheduling
- Maintain scalability and reliability in cloud environments
- Use Neon Serverless PostgreSQL for optimal performance and cost efficiency
- Container-ready from day one (Dockerfile for backend, Next.js static export for frontend)

**Rationale:** Cloud-native design from the start prevents costly refactoring for production deployment and enables scalability.

### IX. Data Integrity and Persistence

Database design and data management must follow SQLModel best practices with proper relationships and constraints.

**Rules:**
- All data operations must be transaction-safe with proper error handling
- Database schema must include proper relationships and foreign key constraints
- Migration strategies must be planned for schema evolution
- Data models must support all unified task management features (priorities, tags, due dates, recurring tasks)
- Maintain referential integrity across all tables
- Indexes must be created on frequently queried fields (user_id, created_at, due_date, priority)
- Performance optimization for search and filtering operations
- Proper validation at database level (NOT NULL, CHECK constraints, unique constraints)

**Rationale:** Data integrity is critical for multi-user applications. Poor database design leads to data corruption and performance issues.

## Technology Stack Requirements

The project MUST use the following technology stack without substitution:

**Frontend:**
- Next.js 15 (App Router) - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling

**Backend:**
- Python FastAPI - API framework
- Pydantic models - Request/response validation
- SQLModel - ORM for database operations

**Database:**
- Neon Serverless PostgreSQL - Cloud-native database

**Authentication:**
- Better Auth - Frontend authentication library
- JWT tokens - Stateless authentication

**Development:**
- Claude Code - AI-assisted development
- Spec-Kit Plus - Specification management

**Deployment:**
- Docker - Containerization
- Kubernetes - Orchestration (future phases)
- Helm Charts - Deployment management (future phases)

## Architecture Constraints

The following architecture constraints must be enforced in all implementations:

**API Design:**
- RESTful API following standard conventions
- JSON request/response format exclusively
- API versioning via URL path: `/api/v1/`
- Consistent error response structure with status codes

**Authentication:**
- JWT tokens expire after 7 days
- Shared `BETTER_AUTH_SECRET` between frontend and backend
- Token refresh mechanism before expiration

**Security:**
- HTTPS enforced in production
- Password hashing using bcrypt or similar
- SQL injection prevention through parameterized queries (SQLModel handles this)
- XSS prevention through proper input sanitization

**Performance:**
- Database connection pooling
- API response time < 500ms for CRUD operations
- Frontend initial load < 3 seconds

**User Interface:**
- Responsive design (mobile, tablet, desktop)
- Modern design principles with Tailwind CSS
- Accessibility standards (WCAG 2.1 Level AA)

## Development Workflow

All development MUST follow this sequential workflow:

1. **Write Constitution** (this file) - Define principles and constraints
2. **Create Specification** (spec.md) - Define WHAT to build (requirements, user stories, acceptance criteria)
3. **Generate Plan** (plan.md) - Define HOW to architect (components, APIs, database schema)
4. **Break into Tasks** (tasks.md) - Create atomic, testable work units
5. **Implement via Claude Code** - Generate code through AI (NO manual coding)
6. **Test and Validate** - Verify all acceptance criteria pass
7. **Deploy** - Deploy to staging/production environments

**Rules:**
- Each phase must be completed before moving to the next
- Specifications must be refined until Claude Code generates correct output
- No manual coding is allowed - if code is wrong, refine the spec
- All changes must be tracked in git with meaningful commit messages
- Pull requests must reference spec/plan/task documents

## Spec-Kit Requirements

The constitution mandates the following organizational structure for specifications:

**Directory Structure:**
- `/specs/features/` - Feature specifications (WHAT to build)
- `/specs/api/` - REST API specifications (endpoint contracts)
- `/specs/database/` - Database schema specifications
- `/specs/ui/` - Frontend/UI specifications (components, pages)

**Claude Code Instructions:**
Claude Code must be instructed to always read the following specifications before implementation:
- Root `CLAUDE.md` - Project-level guidance
- Feature spec - Requirements and acceptance criteria
- API spec - Endpoint contracts
- Database spec - Schema and relationships
- Relevant frontend/backend `CLAUDE.md` - Layer-specific patterns

## Governance

**Authority:**
- This constitution supersedes all other development practices
- All code changes must comply with these principles
- Amendments require explicit documentation and approval

**Compliance:**
- All pull requests must verify compliance with constitutional principles
- Code reviews must check for violations of:
  - Unified task management approach
  - Multi-user ownership enforcement
  - REST API contract adherence
  - Frontend realism requirements
  - Spec-Driven Development workflow

**Amendment Process:**
- Amendments require explicit documentation of the change
- Approval from project stakeholders required
- Migration plan for existing code must be provided
- Version must be incremented according to semantic versioning:
  - MAJOR: Backward incompatible principle changes
  - MINOR: New principles or sections added
  - PATCH: Clarifications, wording fixes

**Runtime Guidance:**
- Development must follow guidance in `CLAUDE.md` for runtime practices
- Particular attention to Spec → Plan → Tasks → Implementation workflow
- Requirement that no manual coding is allowed
- All implementations must support complete set of advanced task management features under single unified category

**Version History:**
- v1.0.0 (2026-02-02): Initial constitution ratified with 9 core principles

---

**This constitution is the foundation of the TaskNest Phase 2 project. All development must align with these principles.**
