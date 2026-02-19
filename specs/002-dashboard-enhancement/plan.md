# Implementation Plan: Dashboard Enhancement - Modern SaaS UI

**Branch**: `001-dashboard-enhancement` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dashboard-enhancement/spec.md`

## Summary

Transform the existing `/tasks` page into a comprehensive `/dashboard` with modern SaaS UI design and full functionality for all sidebar sections (Team, Calendar, Settings, Analytics, Projects, Notifications). The implementation will use **pure vanilla CSS** (matching landing.css and auth.css patterns) with excellent animations and interactive design. This addresses 194 functional requirements across 15 user stories, implementing Option C (full features) for all 6 major sections with a 2-week delivery timeline.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 15.5.11 (App Router with Turbopack)
- Backend: Python 3.11+ with FastAPI 0.109.0+

**Primary Dependencies**:
- Frontend: Next.js 15, React 19, Better Auth 1.4.18, Kysely (PostgreSQL client), Lucide React 0.563.0 (icons)
- Backend: FastAPI, SQLModel 0.0.14, asyncpg 0.29.0, Alembic 1.13.0
- Charts: Chart.js 4.x (for analytics visualizations)
- Drag-and-Drop: @dnd-kit/core (for calendar and Gantt chart)
- PDF Generation: jsPDF (for report exports)
- Email: nodemailer or similar (for team invitations)

**Storage**:
- Neon Serverless PostgreSQL (existing)
- New tables required: teams, team_members, team_invitations, comments, task_assignments, projects, milestones, task_dependencies, notifications, notification_preferences, analytics_snapshots, custom_reports

**Testing**:
- Frontend: Jest + React Testing Library (existing setup)
- Backend: pytest (existing setup)
- E2E: Playwright (recommended for new features)

**Target Platform**:
- Web application (responsive: desktop ≥1024px, tablet 768-1023px, mobile <768px)
- Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Project Type**: Web (frontend + backend monorepo)

**Performance Goals**:
- Page load: <2 seconds (dashboard with all tasks)
- API response: <200ms for 95% of requests
- Search debouncing: 300ms
- Real-time updates: <100ms for statistics
- Animations: 60fps on modern devices
- Calendar drag-drop: <50ms response time

**Constraints**:
- 2-week implementation timeline (aggressive)
- Must maintain existing authentication (Better Auth + JWT)
- Must preserve existing task data and functionality
- No breaking changes to existing APIs
- Must support up to 1000 tasks per user without performance degradation
- Must support teams up to 100 members
- Must support projects with up to 1000 tasks

**Scale/Scope**:
- 194 functional requirements (FR-001 to FR-194)
- 15 user stories across 3 priority levels (P1, P2, P3)
- 50 success criteria
- 20+ new database entities
- 100+ new API endpoints
- 40+ new frontend components
- 6 major new feature sections

**Critical Design Requirement**:
- **MUST use pure vanilla CSS** following the exact pattern from landing.css and auth.css
- Use existing CSS custom properties from landing.css (--primary: #E49B0F, --bg-dark: #0A0A0A, etc.)
- Create separate CSS files: dashboard.css, calendar.css, analytics.css, projects.css, etc.
- Match design quality and animation style of existing landing page (fadeInUp, slideInLeft, hover effects)
- Use CSS Grid and Flexbox for layouts (same as landing page)
- Implement smooth animations (60fps) using CSS transitions and @keyframes
- Maintain consistent design language: cards with rgba backgrounds, border: 1px solid rgba(228, 155, 15, 0.2), border-radius: 16px
- NO Tailwind CSS - remove any existing Tailwind classes from dashboard components
- Follow existing patterns: .btn-primary, .btn-outline, .feature-card, etc.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ CSS Approach Clarification

**User Requirement**: Use pure vanilla CSS matching landing.css and auth.css patterns (NOT Tailwind CSS)

**Constitution Statement**: "Tailwind CSS - Styling" (line 180)

**Resolution**: Constitution will be amended to allow "Pure Vanilla CSS OR Tailwind CSS" as styling options. Current implementation uses vanilla CSS successfully for landing/auth pages, and this approach will be extended to dashboard.

### Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Spec-Driven Development** | ✅ PASS | Following Spec → Plan → Tasks → Implementation workflow |
| **II. Unified Advanced Task Management** | ✅ PASS | All task features (basic, intermediate, advanced) implemented as unified system |
| **III. Multi-User Ownership Enforcement** | ✅ PASS | All new entities include user_id, JWT-based ownership validation |
| **IV. Authentication-First Security** | ✅ PASS | All new endpoints require JWT authentication, Better Auth integration maintained |
| **V. REST API Contract Enforcement** | ✅ PASS | All features exposed via RESTful APIs with JSON format |
| **VI. Frontend Realism Rules** | ✅ PASS | Loading states, error handling, optimistic updates planned for all features |
| **VII. Full-Stack Integration** | ✅ PASS | End-to-end implementation with clear API contracts |
| **VIII. Cloud-Native Architecture** | ✅ PASS | Stateless backend, environment variables, 12-factor principles |
| **IX. Data Integrity and Persistence** | ✅ PASS | SQLModel with proper relationships, foreign keys, indexes |
| **Technology Stack** | ✅ PASS | Pure vanilla CSS (existing pattern) instead of Tailwind CSS |

**Gate Decision**: ✅ PASS - Proceed with pure vanilla CSS approach matching existing landing.css and auth.css patterns.

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard-enhancement/
├── spec.md              # Feature specification (COMPLETE - 833 lines)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
├── contracts/           # Phase 1 output (PENDING)
│   ├── api-endpoints.yaml
│   ├── team-api.yaml
│   ├── calendar-api.yaml
│   ├── settings-api.yaml
│   ├── analytics-api.yaml
│   ├── projects-api.yaml
│   └── notifications-api.yaml
├── checklists/
│   └── requirements.md  # Validation checklist (COMPLETE)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                      # FastAPI app entry point (EXISTS)
│   ├── config.py                    # Settings (EXISTS)
│   ├── database.py                  # Async DB connection (EXISTS)
│   ├── models/                      # SQLModel database models
│   │   ├── user.py                 # EXISTS
│   │   ├── task.py                 # EXISTS - needs update for project_id, assigned_to
│   │   ├── tag.py                  # EXISTS
│   │   ├── task_tag.py             # EXISTS
│   │   ├── team.py                 # NEW
│   │   ├── team_member.py          # NEW
│   │   ├── team_invitation.py      # NEW
│   │   ├── comment.py              # NEW
│   │   ├── task_assignment.py      # NEW
│   │   ├── project.py              # NEW
│   │   ├── milestone.py            # NEW
│   │   ├── task_dependency.py      # NEW
│   │   ├── notification.py         # NEW
│   │   ├── notification_preference.py  # NEW
│   │   ├── analytics_snapshot.py   # NEW
│   │   └── custom_report.py        # NEW
│   ├── schemas/                     # Pydantic request/response schemas
│   │   ├── auth.py                 # EXISTS
│   │   ├── task.py                 # EXISTS
│   │   ├── team.py                 # NEW
│   │   ├── project.py              # NEW
│   │   ├── notification.py         # NEW
│   │   └── analytics.py            # NEW
│   ├── api/                         # API route handlers
│   │   ├── auth.py                 # EXISTS
│   │   ├── tasks.py                # EXISTS - needs enhancement
│   │   ├── tags.py                 # EXISTS
│   │   ├── teams.py                # NEW
│   │   ├── calendar.py             # NEW
│   │   ├── settings.py             # NEW
│   │   ├── analytics.py            # NEW
│   │   ├── projects.py             # NEW
│   │   ├── notifications.py        # NEW
│   │   └── deps.py                 # EXISTS - JWT verification
│   ├── services/                    # Business logic
│   │   ├── auth_service.py         # EXISTS
│   │   ├── task_service.py         # EXISTS - needs enhancement
│   │   ├── tag_service.py          # EXISTS
│   │   ├── team_service.py         # NEW
│   │   ├── project_service.py      # NEW
│   │   ├── notification_service.py # NEW
│   │   ├── analytics_service.py    # NEW
│   │   └── email_service.py        # NEW (for team invitations)
│   ├── middleware/
│   │   ├── cors.py                 # EXISTS
│   │   └── error_handler.py        # EXISTS
│   └── utils/
│       ├── jwt.py                  # EXISTS
│       ├── security.py             # EXISTS
│       └── pdf_generator.py        # NEW (for reports)
└── tests/
    ├── test_teams.py               # NEW
    ├── test_projects.py            # NEW
    ├── test_analytics.py           # NEW
    └── test_notifications.py       # NEW

frontend/TaskNest/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (app)/                  # Protected routes
│   │   │   ├── layout.tsx          # EXISTS - needs sidebar update
│   │   │   ├── dashboard/          # RENAME from tasks/
│   │   │   │   └── page.tsx        # EXISTS - major enhancement needed
│   │   │   ├── my-tasks/           # NEW (filtered view of dashboard)
│   │   │   │   └── page.tsx
│   │   │   ├── team/               # NEW
│   │   │   │   ├── page.tsx
│   │   │   │   └── [teamId]/
│   │   │   │       └── page.tsx
│   │   │   ├── calendar/           # NEW
│   │   │   │   └── page.tsx
│   │   │   ├── settings/           # NEW
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/          # NEW
│   │   │   │   └── page.tsx
│   │   │   ├── projects/           # NEW
│   │   │   │   ├── page.tsx
│   │   │   │   └── [projectId]/
│   │   │   │       └── page.tsx
│   │   │   └── notifications/      # NEW
│   │   │       └── page.tsx
│   │   ├── (auth)/                 # Auth routes (EXISTS)
│   │   ├── page.tsx                # Landing page (EXISTS)
│   │   ├── layout.tsx              # Root layout (EXISTS)
│   │   ├── globals.css             # EXISTS - minimal global styles
│   │   ├── landing.css             # EXISTS - keep as reference
│   │   ├── auth.css                # EXISTS - keep as reference
│   │   ├── dashboard.css           # NEW - main dashboard styles
│   │   ├── calendar.css            # NEW - calendar view styles
│   │   ├── analytics.css           # NEW - charts and analytics
│   │   ├── projects.css            # NEW - project management styles
│   │   └── notifications.css       # NEW - notification center styles
│   ├── components/                  # React components
│   │   ├── ui/                     # Base UI components (EXISTS)
│   │   ├── tasks/                  # Task components (EXISTS - enhance)
│   │   ├── teams/                  # NEW
│   │   │   ├── TeamList.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   ├── TeamMemberList.tsx
│   │   │   ├── InviteMemberModal.tsx
│   │   │   └── CommentThread.tsx
│   │   ├── calendar/               # NEW
│   │   │   ├── CalendarView.tsx
│   │   │   ├── MonthView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── DayView.tsx
│   │   │   └── TaskDragLayer.tsx
│   │   ├── settings/               # NEW
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── PreferencesSettings.tsx
│   │   │   ├── AccountSettings.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── analytics/              # NEW
│   │   │   ├── CompletionChart.tsx
│   │   │   ├── PriorityChart.tsx
│   │   │   ├── TagChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   └── ReportGenerator.tsx
│   │   ├── projects/               # NEW
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── GanttChart.tsx
│   │   │   ├── MilestoneTimeline.tsx
│   │   │   └── DependencyGraph.tsx
│   │   ├── notifications/          # NEW
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationPreferences.tsx
│   │   ├── dashboard/              # NEW
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── TrendIndicator.tsx
│   │   └── layout/
│   │       └── Sidebar.tsx         # EXISTS - major update needed
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts              # EXISTS
│   │   ├── useTasks.ts             # EXISTS - enhance
│   │   ├── useTags.ts              # EXISTS
│   │   ├── useTeams.ts             # NEW
│   │   ├── useProjects.ts          # NEW
│   │   ├── useAnalytics.ts         # NEW
│   │   ├── useNotifications.ts     # EXISTS - enhance
│   │   └── useCalendar.ts          # NEW
│   ├── lib/                         # Utilities
│   │   ├── api.ts                  # EXISTS - enhance
│   │   ├── auth.ts                 # EXISTS
│   │   ├── types.ts                # EXISTS - major expansion
│   │   ├── teams-api.ts            # NEW
│   │   ├── projects-api.ts         # NEW
│   │   ├── analytics-api.ts        # NEW
│   │   └── calendar-utils.ts       # NEW
│   └── contexts/
│       └── AuthContext.tsx         # EXISTS
└── tests/
    ├── components/
    ├── hooks/
    └── integration/
```

**Structure Decision**: Web application monorepo structure maintained. Frontend uses Next.js App Router with **pure vanilla CSS files** (dashboard.css, calendar.css, etc.) following the exact pattern from landing.css and auth.css. Backend uses FastAPI with SQLModel. Significant expansion of both frontend components (40+ new) and backend models/services (13 new models, 6 new service modules).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | Constitution compliance achieved | N/A |

**Note**: Pure vanilla CSS approach (instead of Tailwind CSS) is not a violation - it's the existing pattern used successfully in landing.css and auth.css. This approach will be extended to all new dashboard features.
