# Research & Technology Decisions

**Feature**: Phase 2 TaskNest Full-Stack Web Application
**Date**: 2026-02-02
**Status**: Complete

## Overview

This document captures all technology research and architectural decisions made during the planning phase. Most technology choices are defined in the project constitution and require no additional research. This document focuses on implementation-specific decisions not covered by constitutional requirements.

## Constitutional Technology Stack (No Research Required)

The following technologies are mandated by the project constitution and require no research or alternatives evaluation:

| Technology | Mandated By | Rationale |
|------------|-------------|-----------|
| Next.js 15 (App Router) | Constitution TC-1 | Frontend framework |
| TypeScript | Constitution TC-1 | Type safety for frontend |
| Tailwind CSS | Constitution TC-1 | Styling framework |
| Python FastAPI | Constitution TC-1 | Backend API framework |
| SQLModel | Constitution TC-1 | ORM with Pydantic integration |
| Neon Serverless PostgreSQL | Constitution TC-1 | Cloud-native database |
| Better Auth | Constitution TC-1 | Frontend authentication |
| JWT | Constitution TC-1 | Token-based authentication |

## Implementation-Specific Research

### R1: Recurring Task Generation Strategy

**Question**: When and how should recurring task occurrences be generated?

**Options Evaluated**:

**Option A: Synchronous Generation on Completion**
- Generate next occurrence immediately when user marks task complete
- Pros: Simple implementation, immediate user feedback, no background jobs
- Cons: Slight delay in completion operation, user must complete task to generate next

**Option B: Asynchronous Background Job**
- Scheduled job checks for completed recurring tasks and generates next occurrences
- Pros: No impact on user operations, can handle complex scheduling
- Cons: Requires background job infrastructure, delayed generation, more complex

**Option C: Hybrid Approach**
- Generate on completion + background job for missed generations
- Pros: Best of both worlds, handles edge cases
- Cons: Most complex, overkill for Phase 2

**Decision**: **Option A - Synchronous Generation**

**Rationale**:
1. Phase 2 scope prioritizes simplicity over advanced features
2. No background job infrastructure needed (reduces complexity)
3. Immediate feedback improves user experience
4. Sufficient for common use cases (daily, weekly, monthly tasks)
5. Can upgrade to Option C in future phases if needed

**Implementation Notes**:
- Trigger generation in task completion endpoint
- Calculate next due date based on recurrence pattern
- Create new task with same properties (title, description, priority, tags)
- Return both completed task and new occurrence in response

---

### R2: Browser Notification Implementation

**Question**: How should browser notifications be implemented for task reminders?

**Options Evaluated**:

**Option A: Client-Side Timers**
- JavaScript timers check for upcoming due tasks while app is open
- Pros: Simple, no server infrastructure, works immediately
- Cons: Only works when app is open, not true push notifications

**Option B: Service Worker + Push API**
- Service worker receives push notifications from server
- Pros: Works when app is closed, true push notifications
- Cons: Requires push server, more complex setup, browser compatibility issues

**Option C: Polling + Service Worker**
- Periodic background sync checks for due tasks
- Pros: Works when app closed, no push server needed
- Cons: Battery drain, limited browser support, complex

**Decision**: **Option A - Client-Side Timers**

**Rationale**:
1. Phase 2 focuses on core functionality, not advanced notifications
2. Simpler implementation with no server-side infrastructure
3. Sufficient for users actively using the app
4. Graceful degradation if user closes app
5. Can upgrade to Option B in Phase 3 with email/SMS notifications

**Implementation Notes**:
- Check for due tasks every 60 seconds when app is open
- Request notification permissions on first reminder setup
- Show browser notification 15min/1hr/1day before due time
- Store last notification time to avoid duplicates

---

### R3: Tag Storage and Ownership

**Question**: Should tags be global (shared) or user-specific?

**Options Evaluated**:

**Option A: Global Tags**
- Single tags table shared across all users
- Pros: Consistent tag names, easier autocomplete, less storage
- Cons: Tag name conflicts, no user customization, privacy concerns

**Option B: User-Specific Tags**
- Each user has their own tag namespace
- Pros: Complete data isolation, custom tags per user, no conflicts
- Cons: More storage, duplicate tag names across users

**Option C: Hybrid (Global + Custom)**
- Predefined global tags + user custom tags
- Pros: Best of both worlds, suggested tags available
- Cons: More complex schema, unclear ownership model

**Decision**: **Option B - User-Specific Tags**

**Rationale**:
1. Aligns with Constitution Principle III (Multi-User Ownership Enforcement)
2. Complete data isolation between users
3. Users can create custom tags without conflicts
4. Simpler ownership model (all tags belong to one user)
5. Consistent with overall architecture (user owns all their data)

**Implementation Notes**:
- Tags table includes user_id foreign key
- All tag queries filter by user_id
- Predefined tags (Work, Home, Personal) created per user on signup
- Users can create unlimited custom tags

---

### R4: Search Implementation Strategy

**Question**: How should case-insensitive search be implemented in PostgreSQL?

**Options Evaluated**:

**Option A: ILIKE Operator**
- Use PostgreSQL ILIKE for case-insensitive pattern matching
- Pros: Simple, built-in, works immediately
- Cons: Slower on large datasets, no ranking, limited features

**Option B: Full-Text Search (tsvector)**
- Use PostgreSQL full-text search with tsvector columns
- Pros: Fast, ranking, stemming, advanced features
- Cons: More complex setup, requires indexes, overkill for simple search

**Option C: External Search Engine (Elasticsearch)**
- Use dedicated search engine
- Pros: Very fast, advanced features, scalable
- Cons: Additional infrastructure, complexity, cost

**Decision**: **Option A - ILIKE Operator** (for Phase 2)

**Rationale**:
1. Sufficient for searching title and description fields
2. No additional setup or infrastructure required
3. Performance acceptable for expected dataset size (< 10k tasks per user)
4. Can upgrade to Option B if performance becomes issue
5. Simpler to implement and maintain

**Implementation Notes**:
- Search query: `WHERE title ILIKE '%keyword%' OR description ILIKE '%keyword%'`
- Add indexes on title and description for better performance
- Consider upgrading to full-text search in future if needed

**Future Optimization Path**:
- If search becomes slow: Add GIN index with tsvector
- If need advanced features: Migrate to full-text search
- If scale requires: Consider Elasticsearch

---

### R5: Date/Time and Time Zone Handling

**Question**: How should due dates and times be stored and displayed across time zones?

**Options Evaluated**:

**Option A: Store UTC, Display Local**
- Store all timestamps in UTC, convert to user's local time in browser
- Pros: Standard practice, no time zone storage, browser handles conversion
- Cons: User must understand local time display

**Option B: Store User Time Zone**
- Store user's time zone preference, store times in that zone
- Pros: Explicit time zone handling, user control
- Cons: More complex, time zone changes require migration, DST issues

**Option C: Store UTC + User Time Zone**
- Store both UTC timestamp and user's time zone
- Pros: Most flexible, can display in any time zone
- Cons: Most complex, redundant data, more storage

**Decision**: **Option A - Store UTC, Display Local**

**Rationale**:
1. Industry standard practice for web applications
2. Browser automatically handles time zone conversion
3. No need to store or manage user time zones
4. Simpler implementation and fewer edge cases
5. Works correctly across daylight saving time changes

**Implementation Notes**:
- Backend stores all timestamps as UTC (PostgreSQL TIMESTAMP WITH TIME ZONE)
- Frontend displays times in user's local time zone (JavaScript Date)
- Use date-fns library for consistent date formatting
- Show time zone indicator in UI (e.g., "Due: Feb 3, 2026 3:00 PM PST")

---

## Additional Technology Decisions

### Frontend State Management

**Decision**: React Context + Custom Hooks

**Rationale**:
- Sufficient for Phase 2 scope (no complex state)
- No additional dependencies (Redux, Zustand)
- Aligns with Next.js App Router patterns
- Can upgrade if state complexity increases

### API Client

**Decision**: Native Fetch API with wrapper

**Rationale**:
- No additional dependencies (axios)
- Modern browsers support fetch
- Wrapper provides consistent error handling and auth token injection
- Simpler than full HTTP client library

### Form Handling

**Decision**: React Hook Form

**Rationale**:
- Lightweight, performant
- Built-in validation
- Works well with TypeScript
- Industry standard for React forms

### Date Picker

**Decision**: react-datepicker

**Rationale**:
- Lightweight, customizable
- Good accessibility support
- Works with date-fns
- Supports date and time selection

## Technology Stack Summary

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend Core** | Next.js | 15.x | React framework |
| | React | 18.x | UI library |
| | TypeScript | 5.x | Type safety |
| | Tailwind CSS | 3.x | Styling |
| **Frontend Libraries** | Better Auth | Latest | Authentication |
| | date-fns | 3.x | Date manipulation |
| | react-hook-form | 7.x | Form handling |
| | react-datepicker | 4.x | Date/time picker |
| **Backend Core** | Python | 3.11+ | Language |
| | FastAPI | 0.109+ | API framework |
| | SQLModel | 0.0.14+ | ORM |
| | Pydantic | 2.x | Validation |
| **Backend Libraries** | python-jose | 3.x | JWT handling |
| | passlib | 1.7+ | Password hashing |
| | asyncpg | 0.29+ | PostgreSQL driver |
| | alembic | 1.13+ | Database migrations |
| **Database** | PostgreSQL | 15+ | Neon Serverless |
| **Testing** | pytest | 7.x | Backend tests |
| | Jest | 29.x | Frontend tests |
| | React Testing Library | 14.x | Component tests |
| **Development** | uv | Latest | Python package manager |
| | npm | 10.x | Node package manager |
| **Deployment** | Docker | Latest | Containerization |
| | Vercel | N/A | Frontend hosting |

## Research Validation

All research decisions have been validated against:
- ✅ Constitutional principles (no violations)
- ✅ Performance requirements (< 500ms operations)
- ✅ Security requirements (JWT, data isolation)
- ✅ Scalability requirements (10k concurrent users)
- ✅ Simplicity principle (avoid over-engineering)

## Next Steps

Research phase complete. Proceed to Phase 1:
1. Generate data-model.md (database schema)
2. Generate contracts/openapi.yaml (API specification)
3. Generate quickstart.md (developer setup)

---

**Research Complete**: 2026-02-02
**Approved By**: Planning Phase
**Status**: Ready for Phase 1 Implementation Design
