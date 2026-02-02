# Phase 2: TaskNest Full-Stack Web Application

**Feature ID**: 1-phase2-webapp
**Status**: Draft
**Created**: 2026-02-02
**Last Updated**: 2026-02-02

## Overview

Transform TaskNest into a modern, multi-user web application with persistent storage, authentication, and comprehensive task management features. This phase implements the complete feature set from Basic to Advanced levels as a unified system with secure user authentication, complete data isolation, and production-ready user experience.

This specification covers all task management capabilities as a single cohesive system:
- **Basic Level**: Core CRUD operations (Create, Read, Update, Delete, Mark Complete)
- **Intermediate Level**: Organization features (Priorities, Tags, Search, Filter, Sort)
- **Advanced Level**: Time management (Due Dates, Recurring Tasks, Reminders)

## User Stories

### Authentication & User Management

**US-1**: As a new user, I want to sign up with email and password so that I can create my own task list

**US-2**: As a returning user, I want to sign in with my credentials so that I can access my tasks

**US-3**: As a logged-in user, I want to sign out so that my data remains secure

**US-4**: As a user, I want my session to persist across browser refreshes so that I don't have to log in repeatedly

**US-5**: As a user, I want to only see and manage my own tasks so that my data remains private

### Basic Task Management (CRUD Operations)

**US-6**: As a user, I want to create a new task with a title and optional description so that I can track things I need to do

**US-7**: As a user, I want to view all my tasks in a list so that I can see what needs to be done

**US-8**: As a user, I want to update a task's title or description so that I can correct or clarify information

**US-9**: As a user, I want to delete a task so that I can remove completed or cancelled items

**US-10**: As a user, I want to mark a task as complete/incomplete so that I can track my progress

### Intermediate Task Management

**US-11**: As a user, I want to assign priorities (High/Medium/Low) to tasks so that I can focus on important items

**US-12**: As a user, I want to add tags/categories (Work, Home, Personal) to tasks so that I can organize them

**US-13**: As a user, I want to search tasks by keyword so that I can quickly find specific items

**US-14**: As a user, I want to filter tasks by status, priority, date, or tags so that I can view relevant subsets

**US-15**: As a user, I want to sort tasks by due date, priority, creation date, or alphabetically so that I can organize my view

### Advanced Task Management

**US-16**: As a user, I want to set due dates with date/time pickers so that I can track deadlines

**US-17**: As a user, I want to create recurring tasks (daily, weekly, monthly) so that repetitive tasks are automatically rescheduled

**US-18**: As a user, I want to receive time-based reminders/notifications so that I don't miss important deadlines

### User Experience

**US-19**: As a user, I want to see loading indicators when operations are in progress so that I know the system is working

**US-20**: As a user, I want to see error messages when something goes wrong so that I understand what happened

**US-21**: As a user, I want immediate visual feedback when I perform actions so that the interface feels responsive

**US-22**: As a user, I want a clean, modern interface that works on desktop and mobile devices

## Functional Requirements

### FR-1: User Authentication & Authorization

**FR-1.1 User Registration**
- System must support user registration with email and password
- Email must be validated for correct format
- Password must meet minimum strength requirements (at least 8 characters)
- System must prevent duplicate email registrations
- Upon successful registration, user must be automatically authenticated

**FR-1.2 User Login**
- System must support user login with email and password
- System must issue secure authentication tokens upon successful login
- Authentication tokens must expire after 7 days
- System must support automatic token refresh before expiration

**FR-1.3 User Logout**
- System must support user logout
- Upon logout, authentication tokens must be invalidated
- User must be redirected to login page after logout

**FR-1.4 Session Persistence**
- User sessions must persist across browser refreshes
- Users must remain logged in until token expires or they explicitly log out

**FR-1.5 Data Isolation**
- Every user must have complete data isolation
- Users must only see and access their own tasks
- System must enforce ownership validation on all data operations

### FR-2: Basic Task Operations

**FR-2.1 Task Creation**
- Users must be able to create new tasks
- Task title is required (1-200 characters)
- Task description is optional (maximum 1000 characters)
- System must automatically associate tasks with the authenticated user
- System must automatically set creation timestamp
- System must generate unique task identifier
- Newly created tasks must default to incomplete status
- Newly created tasks must default to Medium priority if not specified

**FR-2.2 Task Retrieval**
- Users must be able to view all their tasks
- System must return only tasks belonging to the authenticated user
- Each task must include: identifier, title, description, completion status, priority, tags, due date, recurrence pattern, creation timestamp, last update timestamp
- System must support filtering and sorting (see FR-4)
- Empty task lists must be handled gracefully with appropriate messaging

**FR-2.3 Task Update**
- Users must be able to update task properties: title, description, priority, tags, due date, recurrence pattern
- Users can only update their own tasks
- System must validate ownership before allowing updates
- System must automatically update the last modified timestamp
- System must return updated task data after successful update

**FR-2.4 Task Deletion**
- Users must be able to delete tasks
- Users can only delete their own tasks
- System must validate ownership before allowing deletion
- System must permanently remove task from storage
- For recurring tasks, system must offer option to delete single occurrence or all future occurrences
- System must return success confirmation after deletion

**FR-2.5 Task Completion Toggle**
- Users must be able to mark tasks as complete or incomplete
- Users can only toggle completion status of their own tasks
- System must validate ownership before allowing status change
- System must automatically update the last modified timestamp
- For recurring tasks, marking complete must trigger creation of next occurrence
- System must return updated task with new status

### FR-3: Intermediate Task Features

**FR-3.1 Task Priorities**
- System must support three priority levels: High, Medium, Low
- Default priority must be Medium if not specified during creation
- Priority must be displayed with visual indicators (colors, icons, or labels)
- Users must be able to change task priority at any time
- Tasks must be sortable by priority level

**FR-3.2 Tags and Categories**
- Users must be able to add multiple tags to a single task
- System must support predefined common tags: Work, Home, Personal, Shopping, Health, Finance
- Users must be able to create custom tags
- Tag names must be unique per user
- Tags must be displayed as visual badges or chips
- System must support filtering by single or multiple tags
- Users must be able to remove tags from tasks

**FR-3.3 Search Functionality**
- Users must be able to search tasks by keyword
- Search must match against task title and description
- Search must be case-insensitive
- Search results must highlight matching text
- Search must return results in real-time or near real-time
- Empty search results must be handled with appropriate messaging

**FR-3.4 Filter Functionality**
- Users must be able to filter tasks by:
  - **Status**: All, Pending (incomplete), Completed
  - **Priority**: All, High, Medium, Low
  - **Tags**: Any combination of tags (multiple selection)
  - **Due Date**: Overdue, Due Today, Due This Week, Due This Month, No Due Date
- Multiple filters must work together using AND logic
- Filter selections must persist during user session
- Users must be able to clear all filters
- Filtered results must update immediately

**FR-3.5 Sort Functionality**
- Users must be able to sort tasks by:
  - **Creation Date**: Newest first or Oldest first
  - **Due Date**: Soonest first or Latest first
  - **Priority**: High to Low or Low to High
  - **Title**: Alphabetically A-Z or Z-A
- Default sort order must be by creation date (newest first)
- Sort selection must persist during user session
- Sorting must work in combination with filters and search

### FR-4: Advanced Task Features

**FR-4.1 Due Dates and Times**
- Users must be able to set due date for tasks using date picker
- Users must be able to set due time (optional)
- Tasks without due dates must be supported
- System must display overdue tasks with visual indicator (color, icon, or label)
- System must calculate and display time until due or time overdue
- System must display "Due Today", "Due Tomorrow", "Overdue by X days" labels
- Users must be able to clear due dates from tasks

**FR-4.2 Recurring Tasks**
- Users must be able to set recurrence patterns:
  - **Daily**: Every N days (e.g., every 1 day, every 3 days)
  - **Weekly**: Every N weeks on specific days (e.g., every Monday and Wednesday)
  - **Monthly**: Every N months on specific date (e.g., 15th of every month)
  - **Custom**: User-defined intervals
- When a recurring task is marked complete, system must automatically create the next occurrence
- Next occurrence must inherit: title, description, priority, tags, recurrence pattern
- Next occurrence due date must be calculated based on recurrence pattern
- Users must be able to view recurrence pattern on task
- Users must be able to edit recurrence pattern
- Users must be able to delete recurrence pattern (convert to one-time task)
- When deleting recurring task, users must choose: delete this occurrence only, or delete all future occurrences

**FR-4.3 Time-based Reminders and Notifications**
- System must support browser notifications for tasks with due dates
- Users must be able to enable/disable reminders per task
- Reminder timing options must include:
  - At due time
  - 15 minutes before due time
  - 1 hour before due time
  - 1 day before due date
- Users must grant browser notification permissions
- System must prompt for notification permissions when user enables first reminder
- Notifications must display task title and due time
- Clicking notification must navigate to task details
- System architecture must be ready for future email/SMS notifications (not implemented in Phase 2)

### FR-5: Security and Access Control

**FR-5.1 Authentication Requirements**
- All application features must require user authentication
- Unauthenticated users must be redirected to login page
- Authentication must use secure token-based mechanism
- Tokens must be transmitted securely

**FR-5.2 Authorization and Ownership**
- System must extract user identity from authentication token only
- System must never trust user identity from request parameters or headers
- All data queries must filter by authenticated user identity
- Users must not be able to access other users' data under any circumstances
- Unauthorized access attempts must return appropriate error responses

**FR-5.3 Error Responses**
- Missing or invalid authentication token must return "Unauthorized" error
- Valid token with insufficient permissions must return "Forbidden" error
- Attempts to access non-existent resources must return "Not Found" error (after ownership validation)

### FR-6: User Experience and Interface

**FR-6.1 Loading States**
- All asynchronous operations must display loading indicators
- Loading indicators must include: spinners, skeleton screens, or progress bars
- Buttons must be disabled during operation processing
- Loading states must be clear and informative

**FR-6.2 Error Handling**
- All errors must display user-friendly error messages
- Error messages must explain what went wrong
- Recoverable errors must provide retry options
- Network failures must be handled gracefully
- Form validation errors must be displayed inline

**FR-6.3 Success Feedback**
- Successful operations must display confirmation messages
- Confirmations must be brief and non-intrusive
- Confirmations must auto-dismiss after appropriate duration

**FR-6.4 Optimistic UI Updates**
- Non-critical operations should update UI optimistically (before server confirmation)
- Examples: marking task complete, updating task title
- Failed optimistic updates must revert UI state and show error

**FR-6.5 Form Validation**
- All forms must validate input before submission
- Required fields must be clearly marked
- Validation errors must be displayed inline near the field
- Submit buttons must be disabled until form is valid

**FR-6.6 Responsive Design**
- Interface must work on mobile devices (phones)
- Interface must work on tablets
- Interface must work on desktop computers
- Layout must adapt to different screen sizes
- Touch interactions must be supported on mobile devices

## Non-Functional Requirements

### NFR-1: Performance

- Task list retrieval must complete within 500 milliseconds for up to 1000 tasks
- Task creation, update, and deletion operations must complete within 500 milliseconds
- Search operations must return results within 500 milliseconds
- Filter and sort operations must complete within 300 milliseconds
- Initial page load must complete within 3 seconds on standard broadband connection
- Application must remain responsive during all operations

### NFR-2: Security

- User passwords must be securely hashed (never stored in plain text)
- Authentication tokens must be cryptographically signed
- Authentication tokens must use secure secret key (minimum 32 characters)
- All data transmission must use encrypted connections in production
- System must prevent SQL injection attacks
- System must prevent Cross-Site Scripting (XSS) attacks
- System must prevent Cross-Site Request Forgery (CSRF) attacks

### NFR-3: Scalability

- System must support at least 10,000 concurrent users
- System must support at least 100,000 total users
- Each user must be able to manage at least 10,000 tasks
- Database queries must use appropriate indexes for performance
- System architecture must support horizontal scaling

### NFR-4: Reliability

- System must have 99.9% uptime
- All data operations must be transaction-safe
- Failed operations must not leave partial or corrupted data
- System must handle concurrent requests safely
- Recurring task generation must be idempotent (safe to retry)
- System must gracefully handle database connection failures

### NFR-5: Usability

- Interface must follow modern design principles
- Interface must be intuitive and require minimal learning
- Error messages must be clear and actionable
- Loading states must provide clear feedback
- Interface must meet accessibility standards (WCAG 2.1 Level AA)
- Interface must support keyboard navigation
- Color schemes must have sufficient contrast for readability

### NFR-6: Maintainability

- Code must follow consistent style guidelines
- Code must include appropriate documentation
- System must use version control
- Database schema must support evolution and migrations
- System must log errors and important events for debugging

## Acceptance Criteria

### AC-1: User Registration and Login

**Given** I am a new user on the signup page
**When** I enter a valid email "user@example.com" and password "SecurePass123"
**Then** my account is created successfully
**And** I am automatically logged in
**And** I am redirected to the task list page

**Given** I have an existing account
**When** I enter my correct email and password on the login page
**Then** I receive an authentication token
**And** I am redirected to the task list page
**And** my session persists when I refresh the browser

### AC-2: Basic Task CRUD Operations

**Given** I am logged in
**When** I create a new task with title "Buy groceries" and description "Milk, eggs, bread"
**Then** the task appears in my task list
**And** the task has a unique identifier
**And** the task is marked as incomplete by default
**And** the task shows the current timestamp

**Given** I have a task with title "Buy milk"
**When** I update the title to "Buy milk and eggs"
**Then** the task title is updated
**And** the last modified timestamp is refreshed
**And** the task remains in my list

**Given** I have a task in my list
**When** I click delete and confirm the action
**Then** the task is removed from my list
**And** the task is permanently deleted
**And** I see a success notification

**Given** I have an incomplete task
**When** I mark it as complete
**Then** the task shows completed status with visual indicator
**And** the completed status is persisted
**When** I mark it as incomplete again
**Then** the task shows incomplete status

### AC-3: Priorities and Tags

**Given** I am creating a new task
**When** I set priority to "High" and add tags "Work" and "Urgent"
**Then** the task is saved with High priority and both tags
**And** the priority is displayed with visual indicator
**And** the tags are displayed as badges

**Given** I have tasks with different priorities (2 High, 3 Medium, 1 Low)
**When** I filter by High priority
**Then** only the 2 High priority tasks are shown

**Given** I have tasks with various tags
**When** I filter by "Work" tag
**Then** only tasks with the Work tag are shown
**When** I filter by both "Work" AND "Urgent" tags
**Then** only tasks with both tags are shown

### AC-4: Search and Sort

**Given** I have 5 tasks including one with title "Buy groceries"
**When** I search for "grocery"
**Then** only the task with "grocery" in title or description is shown
**And** the matching text is highlighted

**Given** I have tasks with different due dates
**When** I sort by due date (soonest first)
**Then** tasks are ordered with nearest due date first
**And** tasks without due dates appear at the end

**Given** I have tasks with different priorities
**When** I sort by priority (high to low)
**Then** High priority tasks appear first
**And** Medium priority tasks appear second
**And** Low priority tasks appear last

### AC-5: Due Dates and Overdue Indicators

**Given** I am creating a task
**When** I set due date to tomorrow at 3:00 PM
**Then** the task shows due date "Tomorrow, 3:00 PM"
**And** the task shows "Due in 1 day"

**Given** I have a task that was due yesterday
**When** I view my task list
**Then** the task shows "Overdue" indicator with red color
**And** the task shows "Overdue by 1 day"

**Given** I have a task due today
**When** I view my task list
**Then** the task shows "Due Today" indicator

### AC-6: Recurring Tasks

**Given** I create a task "Weekly team meeting" with weekly recurrence (every Monday)
**When** I mark it as complete on Monday
**Then** a new task "Weekly team meeting" is automatically created
**And** the new task has due date set to next Monday
**And** the new task has the same priority and tags as the original

**Given** I have a recurring task
**When** I view the task details
**Then** I see the recurrence pattern displayed (e.g., "Repeats every Monday")

**Given** I have a recurring task
**When** I choose to delete it
**Then** I am asked "Delete this occurrence only or all future occurrences?"
**When** I choose "All future occurrences"
**Then** the task and all future occurrences are deleted

### AC-7: Reminders and Notifications

**Given** I have a task with due date tomorrow at 2:00 PM
**When** I enable reminder "1 hour before"
**Then** the reminder is saved with the task

**Given** I have not granted browser notification permissions
**When** I enable a reminder for the first time
**Then** the system prompts me to grant notification permissions

**Given** I have a task with reminder enabled for "1 hour before" due time
**When** the reminder time arrives (1 hour before due time)
**Then** I receive a browser notification
**And** the notification shows the task title and due time
**When** I click the notification
**Then** I am navigated to the task details

### AC-8: User Data Isolation

**Given** User A has 5 tasks and User B has 3 tasks
**When** User A logs in and views their task list
**Then** User A sees exactly 5 tasks (only their own)
**And** User A does not see any of User B's tasks

**Given** User A knows the identifier of User B's task
**When** User A attempts to access User B's task directly
**Then** the system returns "Forbidden" or "Not Found" error
**And** User A cannot view, edit, or delete User B's task

### AC-9: Combined Filters and Sort

**Given** I have 10 tasks with various priorities, tags, and due dates
**When** I filter by High priority AND "Work" tag AND sort by due date
**Then** only High priority tasks with Work tag are shown
**And** the results are sorted by due date (soonest first)

**Given** I have applied multiple filters
**When** I click "Clear all filters"
**Then** all filters are removed
**And** all my tasks are shown again

### AC-10: Error Handling and User Experience

**Given** I am creating a task
**When** the network request fails
**Then** I see an error notification "Failed to create task. Please try again."
**And** I see a "Retry" button
**And** my form data is preserved

**Given** I am loading my task list
**When** the request is in progress
**Then** I see a loading spinner or skeleton screen
**And** the interface indicates that data is being loaded

**Given** I successfully complete an action (create, update, delete)
**When** the operation succeeds
**Then** I see a brief success notification
**And** the notification auto-dismisses after 3 seconds

## Technical Constraints

### TC-1: Technology Stack (Reference Only)

The following technology stack is defined in the constitution and must be used:
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS
- Backend: Python FastAPI, Pydantic models
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (frontend) + JWT verification (backend)

### TC-2: Database Schema (Reference Only)

The database must include the following entities:
- **Users**: Managed by authentication system (email, password hash, timestamps)
- **Tasks**: id, user_id, title, description, completed, priority, due_date, due_time, recurrence_pattern, created_at, updated_at
- **Tags**: id, name, user_id (for custom tags)
- **TaskTags**: Junction table (task_id, tag_id) for many-to-many relationship

Database indexes must be created on: user_id, priority, due_date, completed, created_at

### TC-3: API Design (Reference Only)

API must follow RESTful conventions:
- JSON request/response format
- API versioning: /api/v1/
- Consistent error response structure
- Standard HTTP status codes

## Out of Scope

The following features are explicitly **out of scope** for Phase 2:

- Real-time collaboration between multiple users
- Task sharing or delegation between users
- File attachments to tasks
- Task comments or discussion threads (beyond description field)
- Email or SMS notifications (architecture prepared but not implemented)
- Native mobile applications (iOS, Android)
- Offline mode or local-first architecture
- Task templates or task duplication
- Subtasks or task hierarchies
- Time tracking or task duration estimates
- Calendar view or timeline view
- Task dependencies (blocking relationships)
- Bulk operations (bulk delete, bulk update)
- Import/export functionality
- Third-party integrations (Google Calendar, Slack, etc.)

## Assumptions

1. **User Base**: Initial deployment targets up to 10,000 concurrent users
2. **Task Volume**: Average user will manage 50-200 tasks
3. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) from last 2 years
4. **Network**: Users have stable internet connection (no offline support)
5. **Notifications**: Browser notifications are sufficient for Phase 2 (email/SMS in future phases)
6. **Time Zones**: All times stored in UTC, displayed in user's local time zone
7. **Data Retention**: Tasks are retained indefinitely unless user deletes them
8. **Recurring Tasks**: Maximum 100 future occurrences can be generated
9. **Tags**: Maximum 20 tags per task
10. **Search**: Search is limited to title and description (not tags or other fields)

## Dependencies

### External Services
- Neon Serverless PostgreSQL database (account and connection credentials required)
- Authentication service configuration (Better Auth setup and secret keys)
- Vercel account for frontend deployment
- Container registry for backend deployment

### Development Tools
- Claude Code for AI-assisted development
- Spec-Kit Plus for specification management
- Git for version control

### Future Phase Dependencies
- Email service provider (for email notifications in Phase 3)
- SMS service provider (for SMS notifications in Phase 3)
- Message queue system (for background job processing in Phase 3+)

## Success Criteria

The feature is considered successful when:

1. **Feature Completeness**: All 10 feature categories are working end-to-end (Basic + Intermediate + Advanced)
2. **Authentication**: Users can register, login, logout, and maintain sessions across browser refreshes
3. **Data Isolation**: 100% user data isolation with zero cross-user data access incidents
4. **Task Operations**: All CRUD operations (create, read, update, delete, complete) work correctly
5. **Organization**: Priorities, tags, search, filter, and sort all function correctly
6. **Time Management**: Due dates, recurring tasks, and reminders work as specified
7. **Performance**: All operations complete within specified performance targets (< 500ms for CRUD, < 3s initial load)
8. **User Experience**: Loading states, error handling, and success feedback work consistently
9. **Security**: Zero security vulnerabilities in authentication and authorization flows
10. **Acceptance Criteria**: All 10 acceptance criteria scenarios pass testing
11. **Deployment**: Frontend deployed to Vercel and backend API accessible
12. **Documentation**: API endpoints documented and accessible to frontend developers

## Risks and Mitigation

### Risk 1: Recurring Task Complexity
**Risk**: Recurring task logic may be complex and error-prone
**Impact**: High - Could create duplicate tasks or miss occurrences
**Mitigation**: Implement comprehensive unit tests for recurrence calculation; start with simple patterns (daily, weekly) before complex ones

### Risk 2: Browser Notification Permissions
**Risk**: Users may deny notification permissions
**Impact**: Medium - Reminders won't work for those users
**Mitigation**: Provide clear explanation of why permissions are needed; offer alternative reminder methods in future phases

### Risk 3: Performance with Large Task Lists
**Risk**: Users with thousands of tasks may experience slow performance
**Impact**: Medium - Poor user experience for power users
**Mitigation**: Implement pagination or virtual scrolling; optimize database queries with proper indexes

### Risk 4: Time Zone Handling
**Risk**: Due dates and reminders may be confusing across time zones
**Impact**: Medium - Users may miss deadlines
**Mitigation**: Store all times in UTC; display in user's local time zone; show time zone in UI

### Risk 5: Authentication Token Security
**Risk**: Token theft or misuse could compromise user accounts
**Impact**: High - Security breach
**Mitigation**: Use secure token storage; implement token expiration; use HTTPS in production

## Next Steps

After specification approval:

1. **Planning Phase** (`/sp.plan`): Create detailed technical architecture and component design
2. **Task Breakdown** (`/sp.tasks`): Break plan into atomic, testable implementation tasks
3. **Implementation** (`/sp.implement`): Execute tasks using Claude Code
4. **Testing**: Validate all acceptance criteria
5. **Deployment**: Deploy to staging and production environments

---

**Specification Version**: 1.0
**Approved By**: [Pending]
**Approval Date**: [Pending]
