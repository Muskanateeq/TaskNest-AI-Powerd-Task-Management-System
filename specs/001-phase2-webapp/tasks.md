# Implementation Tasks: Phase 2 TaskNest Full-Stack Web Application

**Feature**: Phase 2 TaskNest Full-Stack Web Application
**Branch**: `001-phase2-webapp`
**Date**: 2026-02-02
**Status**: Ready for Implementation

## Overview

This document breaks down the Phase 2 implementation into atomic, executable tasks organized by user story. Each task is independently testable and includes specific file paths for implementation.

**UI Design Theme**: Modern, interactive, unique, powerful style with **Black (#000000)**, **White (#FFFFFF)**, and **Gamboge (#E49B0F)** color scheme.

## Task Summary

- **Total Tasks**: 156
- **Parallelizable Tasks**: 89 (marked with [P])
- **User Stories**: 22
- **Estimated Phases**: 8

## Task Format

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **TaskID**: Sequential number (T001, T002, etc.)
- **[P]**: Parallelizable (can be done independently)
- **[Story]**: User story reference (US1, US2, etc.)
- **Description**: Clear action with exact file path

---

## Phase 1: Project Setup & Infrastructure

**Goal**: Initialize project structure, dependencies, and development environment

### Backend Setup

- [ ] T001 Create backend directory structure per plan.md at `backend/src/`
- [ ] T002 [P] Initialize Python project with uv at `backend/pyproject.toml`
- [ ] T003 [P] Create backend environment variables template at `backend/.env.example`
- [ ] T004 [P] Configure FastAPI application entry point at `backend/src/main.py`
- [ ] T005 [P] Setup database configuration at `backend/src/config.py`
- [ ] T006 [P] Create database connection module at `backend/src/database.py`
- [ ] T007 [P] Initialize Alembic for migrations at `backend/alembic/`
- [ ] T008 [P] Create initial migration script at `backend/alembic/versions/001_initial_schema.py`

### Frontend Setup

- [ ] T009 Create frontend directory structure per plan.md at `frontend/src/`
- [ ] T010 [P] Initialize Next.js 15 project at `frontend/`
- [ ] T011 [P] Configure TypeScript at `frontend/tsconfig.json`
- [ ] T012 [P] Setup Tailwind CSS with custom theme at `frontend/tailwind.config.js` (Black, White, Gamboge colors)
- [ ] T013 [P] Create global styles with color scheme at `frontend/src/styles/globals.css`
- [ ] T014 [P] Configure Next.js at `frontend/next.config.js`
- [ ] T015 [P] Create frontend environment variables template at `frontend/.env.local.example`
- [ ] T016 [P] Setup Better Auth configuration at `frontend/src/lib/auth.ts`

### Development Tools

- [ ] T017 [P] Create Docker Compose configuration at `docker-compose.yml`
- [ ] T018 [P] Create backend Dockerfile at `backend/Dockerfile`
- [ ] T019 [P] Create frontend Dockerfile at `frontend/Dockerfile`
- [ ] T020 [P] Setup root README.md with project overview
- [ ] T021 [P] Create .gitignore for monorepo

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Goal**: Implement shared infrastructure needed by all user stories

### Backend Foundation

- [ ] T022 [P] Create base SQLModel configuration at `backend/src/models/__init__.py`
- [ ] T023 [P] Implement JWT utility functions at `backend/src/utils/jwt.py`
- [ ] T024 [P] Implement password hashing utilities at `backend/src/utils/security.py`
- [ ] T025 [P] Create authentication dependency injection at `backend/src/api/deps.py`
- [ ] T026 [P] Implement error handling middleware at `backend/src/middleware/error_handler.py`
- [ ] T027 [P] Setup CORS middleware at `backend/src/middleware/cors.py`
- [ ] T028 [P] Create base Pydantic schemas at `backend/src/schemas/__init__.py`

### Frontend Foundation

- [ ] T029 [P] Create API client wrapper at `frontend/src/lib/api.ts`
- [ ] T030 [P] Create TypeScript type definitions at `frontend/src/lib/types.ts`
- [ ] T031 [P] Implement authentication context at `frontend/src/contexts/AuthContext.tsx`
- [ ] T032 [P] Create custom useAuth hook at `frontend/src/hooks/useAuth.ts`
- [ ] T033 [P] Create base UI components with Gamboge theme:
  - [ ] T033a Button component at `frontend/src/components/ui/Button.tsx`
  - [ ] T033b Input component at `frontend/src/components/ui/Input.tsx`
  - [ ] T033c Modal component at `frontend/src/components/ui/Modal.tsx`
  - [ ] T033d Spinner component at `frontend/src/components/ui/Spinner.tsx`
  - [ ] T033e Toast notification component at `frontend/src/components/ui/Toast.tsx`

---

## Phase 3: User Story 1-5 - Authentication & User Management

**Goal**: Implement complete authentication system with modern UI

**Independent Test Criteria**:
- User can register with email and password
- User can login and receive JWT token
- User can logout and token is invalidated
- Session persists across browser refreshes
- User can only access their own data

### US-1: User Registration

- [ ] T034 [US1] Create User model at `backend/src/models/user.py`
- [ ] T035 [US1] Create registration request/response schemas at `backend/src/schemas/auth.py`
- [ ] T036 [US1] Implement registration service logic at `backend/src/services/auth_service.py`
- [ ] T037 [US1] Create registration API endpoint at `backend/src/api/auth.py` (POST /auth/register)
- [ ] T038 [P] [US1] Design modern signup page layout at `frontend/src/app/(auth)/signup/page.tsx`
- [ ] T039 [P] [US1] Create SignupForm component with Gamboge accents at `frontend/src/components/auth/SignupForm.tsx`
- [ ] T040 [US1] Integrate signup form with API at `frontend/src/components/auth/SignupForm.tsx`

### US-2: User Login

- [ ] T041 [US2] Create login request/response schemas at `backend/src/schemas/auth.py`
- [ ] T042 [US2] Implement login service logic at `backend/src/services/auth_service.py`
- [ ] T043 [US2] Create login API endpoint at `backend/src/api/auth.py` (POST /auth/login)
- [ ] T044 [P] [US2] Design modern login page layout at `frontend/src/app/(auth)/login/page.tsx`
- [ ] T045 [P] [US2] Create LoginForm component with Gamboge accents at `frontend/src/components/auth/LoginForm.tsx`
- [ ] T046 [US2] Integrate login form with API at `frontend/src/components/auth/LoginForm.tsx`

### US-3: User Logout

- [ ] T047 [US3] Implement logout service logic at `backend/src/services/auth_service.py`
- [ ] T048 [US3] Create logout API endpoint at `backend/src/api/auth.py` (POST /auth/logout)
- [ ] T049 [US3] Implement logout functionality in AuthContext at `frontend/src/contexts/AuthContext.tsx`
- [ ] T050 [P] [US3] Add logout button to navigation at `frontend/src/app/(app)/layout.tsx`

### US-4: Session Persistence

- [ ] T051 [US4] Implement token refresh logic at `backend/src/services/auth_service.py`
- [ ] T052 [US4] Create token refresh endpoint at `backend/src/api/auth.py` (POST /auth/refresh)
- [ ] T053 [US4] Implement token storage in localStorage at `frontend/src/lib/auth.ts`
- [ ] T054 [US4] Add automatic token refresh in AuthContext at `frontend/src/contexts/AuthContext.tsx`

### US-5: Data Isolation

- [ ] T055 [US5] Implement user_id extraction from JWT at `backend/src/api/deps.py`
- [ ] T056 [US5] Add ownership validation to all query functions at `backend/src/services/`
- [ ] T057 [US5] Create integration test for data isolation at `backend/tests/test_data_isolation.py`

---

## Phase 4: User Story 6-10 - Basic Task Management (CRUD)

**Goal**: Implement core task CRUD operations with modern interactive UI

**Independent Test Criteria**:
- User can create tasks with title and description
- User can view all their tasks in a list
- User can update task title and description
- User can delete tasks
- User can mark tasks as complete/incomplete

### Database & Models

- [ ] T058 [US6] Create Task model with all fields at `backend/src/models/task.py`
- [ ] T059 [P] [US6] Create Tag model at `backend/src/models/tag.py`
- [ ] T060 [P] [US6] Create TaskTag junction model at `backend/src/models/task_tag.py`
- [ ] T061 [US6] Run database migration for Task tables

### US-6: Create Task

- [ ] T062 [US6] Create task creation schemas at `backend/src/schemas/task.py`
- [ ] T063 [US6] Implement task creation service at `backend/src/services/task_service.py`
- [ ] T064 [US6] Create task creation endpoint at `backend/src/api/tasks.py` (POST /tasks)
- [ ] T065 [P] [US6] Design modern task creation form with Gamboge theme at `frontend/src/components/tasks/TaskForm.tsx`
- [ ] T066 [US6] Integrate task creation with API at `frontend/src/components/tasks/TaskForm.tsx`

### US-7: View Tasks

- [ ] T067 [US7] Implement task retrieval service at `backend/src/services/task_service.py`
- [ ] T068 [US7] Create task list endpoint at `backend/src/api/tasks.py` (GET /tasks)
- [ ] T069 [US7] Create task detail endpoint at `backend/src/api/tasks.py` (GET /tasks/{id})
- [ ] T070 [P] [US7] Design modern task list page with interactive cards at `frontend/src/app/(app)/tasks/page.tsx`
- [ ] T071 [P] [US7] Create TaskList component with smooth animations at `frontend/src/components/tasks/TaskList.tsx`
- [ ] T072 [P] [US7] Create TaskItem component with hover effects at `frontend/src/components/tasks/TaskItem.tsx`
- [ ] T073 [US7] Create custom useTasks hook at `frontend/src/hooks/useTasks.ts`
- [ ] T074 [US7] Integrate task list with API at `frontend/src/components/tasks/TaskList.tsx`

### US-8: Update Task

- [ ] T075 [US8] Create task update schemas at `backend/src/schemas/task.py`
- [ ] T076 [US8] Implement task update service at `backend/src/services/task_service.py`
- [ ] T077 [US8] Create task update endpoint at `backend/src/api/tasks.py` (PUT /tasks/{id})
- [ ] T078 [P] [US8] Add edit mode to TaskForm component at `frontend/src/components/tasks/TaskForm.tsx`
- [ ] T079 [US8] Integrate task update with API at `frontend/src/components/tasks/TaskForm.tsx`

### US-9: Delete Task

- [ ] T080 [US9] Implement task deletion service at `backend/src/services/task_service.py`
- [ ] T081 [US9] Create task deletion endpoint at `backend/src/api/tasks.py` (DELETE /tasks/{id})
- [ ] T082 [P] [US9] Add delete confirmation modal at `frontend/src/components/tasks/DeleteConfirmModal.tsx`
- [ ] T083 [US9] Integrate task deletion with API at `frontend/src/components/tasks/TaskItem.tsx`

### US-10: Mark Complete

- [ ] T084 [US10] Implement completion toggle service at `backend/src/services/task_service.py`
- [ ] T085 [US10] Create completion toggle endpoint at `backend/src/api/tasks.py` (PATCH /tasks/{id}/complete)
- [ ] T086 [P] [US10] Add interactive checkbox with animation at `frontend/src/components/tasks/TaskItem.tsx`
- [ ] T087 [US10] Integrate completion toggle with API at `frontend/src/components/tasks/TaskItem.tsx`

---

## Phase 5: User Story 11-12 - Priorities & Tags

**Goal**: Add task organization features with visual indicators

**Independent Test Criteria**:
- User can assign priorities (High/Medium/Low) to tasks
- Priorities displayed with color-coded indicators
- User can add multiple tags to tasks
- User can create custom tags
- Tags displayed as interactive badges

### US-11: Task Priorities

- [ ] T088 [US11] Add priority field to task schemas at `backend/src/schemas/task.py`
- [ ] T089 [US11] Update task service to handle priorities at `backend/src/services/task_service.py`
- [ ] T090 [P] [US11] Create PrioritySelector component with Gamboge for High at `frontend/src/components/tasks/PrioritySelector.tsx`
- [ ] T091 [P] [US11] Add priority badge to TaskItem with color coding at `frontend/src/components/tasks/TaskItem.tsx`
- [ ] T092 [US11] Integrate priority selection in TaskForm at `frontend/src/components/tasks/TaskForm.tsx`

### US-12: Tags & Categories

- [ ] T093 [US12] Create tag schemas at `backend/src/schemas/tag.py`
- [ ] T094 [US12] Implement tag service at `backend/src/services/tag_service.py`
- [ ] T095 [US12] Create tag endpoints at `backend/src/api/tags.py` (GET, POST, DELETE /tags)
- [ ] T096 [US12] Update task service to handle tag associations at `backend/src/services/task_service.py`
- [ ] T097 [P] [US12] Create TagSelector component with autocomplete at `frontend/src/components/tasks/TagSelector.tsx`
- [ ] T098 [P] [US12] Create TagBadge component with Gamboge accents at `frontend/src/components/tasks/TagBadge.tsx`
- [ ] T099 [US12] Integrate tags in TaskForm at `frontend/src/components/tasks/TaskForm.tsx`
- [ ] T100 [US12] Display tags in TaskItem at `frontend/src/components/tasks/TaskItem.tsx`

---

## Phase 6: User Story 13-15 - Search, Filter & Sort

**Goal**: Implement powerful search and filtering with modern UI

**Independent Test Criteria**:
- User can search tasks by keyword (case-insensitive)
- Search highlights matching text
- User can filter by status, priority, tags, due date
- Multiple filters work together (AND logic)
- User can sort by creation date, due date, priority, title
- Filters and sort persist during session

### US-13: Search Functionality

- [ ] T101 [US13] Implement search logic in task service at `backend/src/services/task_service.py`
- [ ] T102 [US13] Add search parameter to task list endpoint at `backend/src/api/tasks.py`
- [ ] T103 [P] [US13] Create modern SearchBar component with Gamboge focus at `frontend/src/components/tasks/TaskSearch.tsx`
- [ ] T104 [P] [US13] Add search result highlighting at `frontend/src/components/tasks/TaskItem.tsx`
- [ ] T105 [US13] Integrate search with API at `frontend/src/components/tasks/TaskSearch.tsx`

### US-14: Filter Functionality

- [ ] T106 [US14] Implement filter logic in task service at `backend/src/services/task_service.py`
- [ ] T107 [US14] Add filter parameters to task list endpoint at `backend/src/api/tasks.py`
- [ ] T108 [P] [US14] Create interactive FilterPanel component at `frontend/src/components/tasks/TaskFilters.tsx`
- [ ] T109 [P] [US14] Add filter chips with Gamboge active state at `frontend/src/components/tasks/FilterChip.tsx`
- [ ] T110 [US14] Integrate filters with API at `frontend/src/components/tasks/TaskFilters.tsx`

### US-15: Sort Functionality

- [ ] T111 [US15] Implement sort logic in task service at `backend/src/services/task_service.py`
- [ ] T112 [US15] Add sort parameters to task list endpoint at `backend/src/api/tasks.py`
- [ ] T113 [P] [US15] Create SortSelector dropdown component at `frontend/src/components/tasks/SortSelector.tsx`
- [ ] T114 [US15] Integrate sorting with API at `frontend/src/components/tasks/SortSelector.tsx`

---

## Phase 7: User Story 16-18 - Advanced Features

**Goal**: Implement due dates, recurring tasks, and reminders

**Independent Test Criteria**:
- User can set due dates with date/time pickers
- Overdue tasks show visual indicators
- User can create recurring tasks (daily, weekly, monthly)
- Completing recurring task creates next occurrence
- User can enable browser notifications
- Reminders trigger at specified times

### US-16: Due Dates

- [ ] T115 [US16] Add due date fields to task schemas at `backend/src/schemas/task.py`
- [ ] T116 [US16] Update task service to handle due dates at `backend/src/services/task_service.py`
- [ ] T117 [P] [US16] Create DateTimePicker component at `frontend/src/components/tasks/DateTimePicker.tsx`
- [ ] T118 [P] [US16] Add due date badge with overdue indicator at `frontend/src/components/tasks/DueDateBadge.tsx`
- [ ] T119 [US16] Integrate due dates in TaskForm at `frontend/src/components/tasks/TaskForm.tsx`
- [ ] T120 [US16] Display due dates in TaskItem at `frontend/src/components/tasks/TaskItem.tsx`

### US-17: Recurring Tasks

- [ ] T121 [US17] Add recurrence pattern to task schemas at `backend/src/schemas/task.py`
- [ ] T122 [US17] Implement recurrence service at `backend/src/services/recurrence_service.py`
- [ ] T123 [US17] Update completion endpoint to handle recurrence at `backend/src/api/tasks.py`
- [ ] T124 [P] [US17] Create RecurrenceSelector component at `frontend/src/components/tasks/RecurrenceSelector.tsx`
- [ ] T125 [P] [US17] Add recurrence indicator badge at `frontend/src/components/tasks/RecurrenceBadge.tsx`
- [ ] T126 [US17] Integrate recurrence in TaskForm at `frontend/src/components/tasks/TaskForm.tsx`

### US-18: Reminders & Notifications

- [ ] T127 [US18] Add reminder fields to task schemas at `backend/src/schemas/task.py`
- [ ] T128 [P] [US18] Create notification permission handler at `frontend/src/lib/notifications.ts`
- [ ] T129 [P] [US18] Create useNotifications hook at `frontend/src/hooks/useNotifications.ts`
- [ ] T130 [P] [US18] Create ReminderSelector component at `frontend/src/components/tasks/ReminderSelector.tsx`
- [ ] T131 [US18] Implement client-side reminder checking at `frontend/src/hooks/useNotifications.ts`
- [ ] T132 [US18] Integrate reminders in TaskForm at `frontend/src/components/tasks/TaskForm.tsx`

---

## Phase 8: User Story 19-22 - User Experience & Polish

**Goal**: Implement loading states, error handling, and responsive design

**Independent Test Criteria**:
- All operations show loading indicators
- Errors display user-friendly messages with retry
- UI updates optimistically where appropriate
- Interface is fully responsive (mobile, tablet, desktop)
- Modern, interactive design with Black/White/Gamboge theme

### US-19: Loading Indicators

- [ ] T133 [P] [US19] Add loading states to all API calls at `frontend/src/lib/api.ts`
- [ ] T134 [P] [US19] Create skeleton loading components at `frontend/src/components/ui/Skeleton.tsx`
- [ ] T135 [US19] Integrate loading states in TaskList at `frontend/src/components/tasks/TaskList.tsx`
- [ ] T136 [US19] Add button loading states at `frontend/src/components/ui/Button.tsx`

### US-20: Error Handling

- [ ] T137 [P] [US20] Create error notification system at `frontend/src/contexts/ToastContext.tsx`
- [ ] T138 [P] [US20] Add retry mechanism to API client at `frontend/src/lib/api.ts`
- [ ] T139 [US20] Integrate error handling in all components at `frontend/src/components/tasks/`
- [ ] T140 [P] [US20] Create ErrorBoundary component at `frontend/src/components/ErrorBoundary.tsx`

### US-21: Optimistic Updates

- [ ] T141 [US21] Implement optimistic completion toggle at `frontend/src/components/tasks/TaskItem.tsx`
- [ ] T142 [US21] Add optimistic task creation at `frontend/src/components/tasks/TaskForm.tsx`
- [ ] T143 [US21] Implement rollback on failure at `frontend/src/hooks/useTasks.ts`

### US-22: Modern Responsive Design

- [ ] T144 [P] [US22] Create responsive navigation with mobile menu at `frontend/src/app/(app)/layout.tsx`
- [ ] T145 [P] [US22] Design modern hero section with Gamboge accents at `frontend/src/app/page.tsx`
- [ ] T146 [P] [US22] Add responsive grid layout for tasks at `frontend/src/components/tasks/TaskList.tsx`
- [ ] T147 [P] [US22] Implement mobile-friendly filters at `frontend/src/components/tasks/TaskFilters.tsx`
- [ ] T148 [P] [US22] Add smooth transitions and animations at `frontend/src/styles/globals.css`
- [ ] T149 [P] [US22] Create interactive hover effects with Gamboge highlights
- [ ] T150 [P] [US22] Implement dark mode toggle (Black/White/Gamboge theme)

---

## Phase 9: Final Polish & Deployment

**Goal**: Complete integration, testing, and deployment

### Integration & Testing

- [ ] T151 [P] Create end-to-end test for auth flow at `backend/tests/test_auth_flow.py`
- [ ] T152 [P] Create end-to-end test for task CRUD at `backend/tests/test_task_crud.py`
- [ ] T153 [P] Create integration test for search/filter at `backend/tests/test_search_filter.py`
- [ ] T154 Run all backend tests and fix issues

### Deployment

- [ ] T155 [P] Create production environment variables
- [ ] T156 Deploy to Vercel (frontend) and cloud platform (backend)

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)

1. **Phase 1** → **Phase 2** (Setup before foundation)
2. **Phase 2** → **Phase 3** (Foundation before auth)
3. **Phase 3** → **Phase 4** (Auth before tasks)
4. **Phase 4** → **Phase 5** (Basic CRUD before organization)
5. **Phase 5** → **Phase 6** (Organization before search/filter)
6. **Phase 6** → **Phase 7** (Search/filter before advanced)
7. **Phase 7** → **Phase 8** (Advanced before polish)
8. **Phase 8** → **Phase 9** (Polish before deployment)

### Parallel Execution Opportunities

**Within Phase 1**: T002-T008 (backend), T010-T016 (frontend), T017-T021 (tools) can run in parallel

**Within Phase 2**: All tasks (T022-T033) can run in parallel

**Within Phase 3**:
- US1, US2, US3 backend tasks can run in parallel
- Frontend tasks can run after respective backend tasks

**Within Phase 4**:
- T058-T061 (models) must complete first
- Then US6-US10 can run in parallel

**Within Phase 5**: US11 and US12 can run in parallel

**Within Phase 6**: US13, US14, US15 can run in parallel

**Within Phase 7**: US16, US17, US18 can run in parallel

**Within Phase 8**: All US19-US22 tasks can run in parallel

---

## UI Design Specifications

### Color Scheme

**Primary Colors**:
- **Black**: `#000000` - Primary text, backgrounds
- **White**: `#FFFFFF` - Backgrounds, text on dark
- **Gamboge**: `#E49B0F` - Accents, highlights, CTAs, high priority

**Usage Guidelines**:
- Gamboge for primary actions, high priority tasks, active states
- Black for text, borders, dark mode backgrounds
- White for light mode backgrounds, cards, modals
- Smooth gradients between colors for modern feel

### Component Styling

**Buttons**:
- Primary: Gamboge background, white text, hover darken
- Secondary: White background, black border, Gamboge hover
- Ghost: Transparent, Gamboge text, hover background

**Cards**:
- White background with subtle shadow
- Gamboge left border for high priority
- Hover: Lift effect with Gamboge glow

**Forms**:
- White inputs with black border
- Gamboge focus ring
- Smooth transitions on all interactions

**Badges**:
- High Priority: Gamboge background
- Medium Priority: Gray background
- Low Priority: Light gray background
- Tags: White background, Gamboge border

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Phase 1-4 Only** (Authentication + Basic CRUD):
- User registration and login
- Create, read, update, delete tasks
- Mark tasks complete
- Basic responsive UI with color theme

**Estimated**: 87 tasks (T001-T087)

### Incremental Delivery

1. **Week 1**: Phase 1-2 (Setup + Foundation)
2. **Week 2**: Phase 3 (Authentication)
3. **Week 3**: Phase 4 (Basic CRUD)
4. **Week 4**: Phase 5-6 (Organization + Search)
5. **Week 5**: Phase 7 (Advanced Features)
6. **Week 6**: Phase 8-9 (Polish + Deployment)

---

## Validation Checklist

Before marking phase complete, verify:

- [ ] All tasks in phase completed
- [ ] Independent test criteria passing
- [ ] No console errors or warnings
- [ ] Responsive design working (mobile, tablet, desktop)
- [ ] Color scheme consistent (Black, White, Gamboge)
- [ ] Loading states implemented
- [ ] Error handling working
- [ ] Code follows project structure from plan.md
- [ ] Git commits follow convention

---

**Tasks Ready for Implementation**: ✅

**Next Step**: Start with Phase 1 (T001-T021) to setup project infrastructure

**Command to begin**: `/sp.implement` (when ready to start coding)
