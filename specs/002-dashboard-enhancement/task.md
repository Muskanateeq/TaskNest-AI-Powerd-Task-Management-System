  # Tasks: Dashboard Enhancement - Modern SaaS UI

  **Feature**: Dashboard Enhancement - Modern SaaS UI
  **Branch**: `001-dashboard-enhancement`
  **Date**: 2026-02-12
  **Status**: Ready for Implementation

  ## Overview

  This document breaks down the dashboard enhancement implementation into atomic, executable tasks organized by user story.   Each task follows the strict checklist format and includes specific file paths.

  **CSS Approach**: Pure vanilla CSS matching existing landing.css and auth.css patterns (NO Tailwind CSS)

  ## Task Summary

  - **Total Tasks**: 245
  - **Parallelizable Tasks**: 142 (marked with [P])
  - **User Stories**: 15
  - **Estimated Timeline**: 2 weeks

  ## Task Format

  - [TaskID] [P?] [Story?] Description with file path

  - **TaskID**: Sequential number (T001, T002, etc.)
  - **[P]**: Parallelizable (can be done independently)
  - **[Story]**: User story reference (US1, US2, etc.)
  - **Description**: Clear action with exact file path

  ---

  ## Phase 1: Setup (Shared Infrastructure)

  **Purpose**: Project initialization and CSS architecture setup

  - [ ] T001 Verify project structure matches plan.md requirements
  - [ ] T002 [P] Install Chart.js 4.x at frontend/TaskNest/package.json
  - [ ] T003 [P] Install @dnd-kit/core at frontend/TaskNest/package.json
  - [ ] T004 [P] Install jsPDF at frontend/TaskNest/package.json
  - [ ] T005 [P] Create dashboard.css following landing.css patterns at frontend/TaskNest/src/app/dashboard.css
  - [ ] T006 [P] Create teams.css following landing.css patterns at frontend/TaskNest/src/app/teams.css
  - [ ] T007 [P] Create calendar.css following landing.css patterns at frontend/TaskNest/src/app/calendar.css
  - [ ] T008 [P] Create settings.css following landing.css patterns at frontend/TaskNest/src/app/settings.css
  - [ ] T009 [P] Create analytics.css following landing.css patterns at frontend/TaskNest/src/app/analytics.css
  - [ ] T010 [P] Create projects.css following landing.css patterns at frontend/TaskNest/src/app/projects.css
  - [ ] T011 [P] Create notifications.css following landing.css patterns at frontend/TaskNest/src/app/notifications.css    

  ---

  ## Phase 2: Foundational (Blocking Prerequisites)

  **Purpose**: Core infrastructure that MUST be complete before ANY user story

  **⚠️ CRITICAL**: No user story work can begin until this phase is complete

  ### Backend Foundation

  - [ ] T012 [P] Create Team model at backend/src/models/team.py
  - [ ] T013 [P] Create TeamMember model at backend/src/models/team_member.py
  - [ ] T014 [P] Create TeamInvitation model at backend/src/models/team_invitation.py
  - [ ] T015 [P] Create Comment model at backend/src/models/comment.py
  - [ ] T016 [P] Create TaskAssignment model at backend/src/models/task_assignment.py
  - [ ] T017 [P] Create Project model at backend/src/models/project.py
  - [ ] T018 [P] Create Milestone model at backend/src/models/milestone.py
  - [ ] T019 [P] Create TaskDependency model at backend/src/models/task_dependency.py
  - [ ] T020 [P] Create Notification model at backend/src/models/notification.py
  - [ ] T021 [P] Create NotificationPreference model at backend/src/models/notification_preference.py
  - [ ] T022 [P] Create AnalyticsSnapshot model at backend/src/models/analytics_snapshot.py
  - [ ] T023 [P] Create CustomReport model at backend/src/models/custom_report.py
  - [ ] T024 Enhance Task model with project_id and assigned_to fields at backend/src/models/task.py
  - [ ] T025 Create Alembic migration for all new models at backend/alembic/versions/
  - [ ] T026 Run database migration to create all tables

  ### Frontend Foundation

  - [ ] T027 [P] Create base API client utilities at frontend/TaskNest/src/lib/api.ts
  - [ ] T028 [P] Create TypeScript types for all new entities at frontend/TaskNest/src/lib/types.ts

  **Checkpoint**: Foundation ready - user story implementation can now begin in parallel

  ---

  ## Phase 3: User Story 1 - Core Dashboard Navigation and Task Management (Priority: P1) 🎯 MVP

  **Goal**: Rename /tasks to /dashboard, implement search, filters, sorting, and task card operations

  **Independent Test**: Navigate to /dashboard, create task, search for it, filter by status/priority, edit and delete from   card

  ### Implementation for User Story 1

  - [ ] T029 [US1] Rename route from (app)/tasks to (app)/dashboard at frontend/TaskNest/src/app/(app)/dashboard/page.tsx  
  - [ ] T030 [US1] Update all internal links from /tasks to /dashboard at frontend/TaskNest/src/components/
  - [ ] T031 [US1] Import dashboard.css in dashboard page at frontend/TaskNest/src/app/(app)/dashboard/page.tsx
  - [ ] T032 [P] [US1] Create enhanced statistics component with progress bars at
  frontend/TaskNest/src/components/dashboard/Statistics.tsx
  - [ ] T033 [P] [US1] Add CSS for stat cards with animations at frontend/TaskNest/src/app/dashboard.css
  - [ ] T034 [US1] Connect search bar to backend API with debouncing at
  frontend/TaskNest/src/components/dashboard/SearchBar.tsx
  - [ ] T035 [US1] Integrate FilterPanel component at frontend/TaskNest/src/components/dashboard/FilterPanel.tsx
  - [ ] T036 [US1] Integrate SortDropdown component at frontend/TaskNest/src/components/dashboard/SortDropdown.tsx
  - [ ] T037 [US1] Add URL parameter persistence for search/filter/sort at
  frontend/TaskNest/src/app/(app)/dashboard/page.tsx
  - [ ] T038 [P] [US1] Add Edit button to task cards at frontend/TaskNest/src/components/tasks/TaskCard.tsx
  - [ ] T039 [P] [US1] Add Delete button to task cards at frontend/TaskNest/src/components/tasks/TaskCard.tsx
  - [ ] T040 [P] [US1] Create TaskDetailModal component at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx
  - [ ] T041 [US1] Add click handler to open detail modal at frontend/TaskNest/src/components/tasks/TaskCard.tsx
  - [ ] T042 [P] [US1] Add CSS for task card hover effects at frontend/TaskNest/src/app/dashboard.css
  - [ ] T043 [P] [US1] Add CSS for modal animations at frontend/TaskNest/src/app/dashboard.css

  **Checkpoint**: User Story 1 complete - dashboard with full search/filter/sort and task operations working

  ---

  ## Phase 4: User Story 2 - Enhanced Sidebar Navigation (Priority: P1)

  **Goal**: Update sidebar with all navigation items and proper routing

  **Independent Test**: Click each sidebar item and verify routing and active state highlighting

  ### Implementation for User Story 2

  - [ ] T044 [US2] Update Sidebar component with all navigation items at
  frontend/TaskNest/src/components/layout/Sidebar.tsx
  - [ ] T045 [P] [US2] Add Dashboard navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx      
  - [ ] T046 [P] [US2] Add My Tasks navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx       
  - [ ] T047 [P] [US2] Add Team navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx
  - [ ] T048 [P] [US2] Add Calendar navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx       
  - [ ] T049 [P] [US2] Add Settings navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx       
  - [ ] T050 [P] [US2] Add Analytics navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx      
  - [ ] T051 [P] [US2] Add Project navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx        
  - [ ] T052 [P] [US2] Add Notifications navigation item with icon at frontend/TaskNest/src/components/layout/Sidebar.tsx  
  - [ ] T053 [US2] Implement active route highlighting logic at frontend/TaskNest/src/components/layout/Sidebar.tsx        
  - [ ] T054 [US2] Add mobile menu toggle functionality at frontend/TaskNest/src/components/layout/Sidebar.tsx

  **Checkpoint**: User Story 2 complete - all sidebar navigation functional

  ---

  ## Phase 5: User Story 3 - Visual Statistics Dashboard (Priority: P2)

  **Goal**: Add animated progress bars, percentages, and trend indicators to statistics

  **Independent Test**: View dashboard with various task states and verify statistics display correctly

  ### Backend for User Story 3

  - [ ] T055 [P] [US3] Create statistics calculation service at backend/src/services/stats_service.py
  - [ ] T056 [US3] Create GET /tasks/stats/summary endpoint at backend/src/api/tasks.py

  ### Frontend for User Story 3

  - [ ] T057 [P] [US3] Create ProgressBar component with animations at
  frontend/TaskNest/src/components/dashboard/ProgressBar.tsx
  - [ ] T058 [P] [US3] Create TrendIndicator component at frontend/TaskNest/src/components/dashboard/TrendIndicator.tsx    
  - [ ] T059 [US3] Update Statistics component with progress bars at
  frontend/TaskNest/src/components/dashboard/Statistics.tsx
  - [ ] T060 [P] [US3] Add CSS for progress bar animations at frontend/TaskNest/src/app/dashboard.css
  - [ ] T061 [US3] Connect statistics to API at frontend/TaskNest/src/components/dashboard/Statistics.tsx
  - [ ] T062 [US3] Implement real-time statistics updates at frontend/TaskNest/src/hooks/useStats.ts

  **Checkpoint**: User Story 3 complete - visual statistics with animations working

  ---

  ## Phase 6: User Story 4 - Task Detail View (Priority: P2)

  **Goal**: Implement comprehensive task detail modal

  **Independent Test**: Click task card and verify all details display in modal

  ### Implementation for User Story 4

  - [ ] T063 [P] [US4] Add all task fields to TaskDetailModal at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx  - [ ] T064 [P] [US4] Add priority badge to modal at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx
  - [ ] T065 [P] [US4] Add due date display with overdue indicator at
  frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx
  - [ ] T066 [P] [US4] Add tags display as chips at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx
  - [ ] T067 [P] [US4] Add recurrence pattern display at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx        
  - [ ] T068 [US4] Add modal close handlers (click outside, Escape key) at
  frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx
  - [ ] T069 [US4] Implement focus trap for accessibility at frontend/TaskNest/src/components/tasks/TaskDetailModal.tsx    
  - [ ] T070 [P] [US4] Add CSS for modal styling at frontend/TaskNest/src/app/dashboard.css

  **Checkpoint**: User Story 4 complete - task detail modal fully functional

  ---

  ## Phase 7: User Story 5 - Advanced Sorting and Filtering (Priority: P2)

  **Goal**: Implement advanced sort options and filter combinations

  **Independent Test**: Apply multiple filters and sort options, verify results

  ### Backend for User Story 5

  - [ ] T071 [US5] Enhance filter logic for multiple criteria at backend/src/services/task_service.py
  - [ ] T072 [US5] Add sort by creation date at backend/src/services/task_service.py
  - [ ] T073 [US5] Add sort by due date with overdue first at backend/src/services/task_service.py
  - [ ] T074 [US5] Add sort by priority (High→Medium→Low) at backend/src/services/task_service.py
  - [ ] T075 [US5] Add sort by title (A-Z) at backend/src/services/task_service.py

  ### Frontend for User Story 5

  - [ ] T076 [US5] Update SortDropdown with all options at frontend/TaskNest/src/components/dashboard/SortDropdown.tsx     
  - [ ] T077 [US5] Update FilterPanel with combined filter logic at
  frontend/TaskNest/src/components/dashboard/FilterPanel.tsx
  - [ ] T078 [US5] Add filter persistence in URL params at frontend/TaskNest/src/app/(app)/dashboard/page.tsx
  - [ ] T079 [US5] Add sort persistence in URL params at frontend/TaskNest/src/app/(app)/dashboard/page.tsx

  **Checkpoint**: User Story 5 complete - advanced sorting and filtering working

  ---

  ## Phase 8: User Story 6 - Modern Design and Animations (Priority: P2)

  **Goal**: Implement modern design matching landing page with smooth animations

  **Independent Test**: View dashboard on different devices, verify design consistency and animations

  ### Implementation for User Story 6

  - [ ] T080 [P] [US6] Verify color scheme matches landing page at frontend/TaskNest/src/app/dashboard.css
  - [ ] T081 [P] [US6] Add hover effects to all interactive elements at frontend/TaskNest/src/app/dashboard.css
  - [ ] T082 [P] [US6] Add smooth transitions (60fps) at frontend/TaskNest/src/app/dashboard.css
  - [ ] T083 [P] [US6] Create skeleton loader components at frontend/TaskNest/src/components/ui/Skeleton.tsx
  - [ ] T084 [P] [US6] Create empty state component at frontend/TaskNest/src/components/dashboard/EmptyState.tsx
  - [ ] T085 [US6] Implement responsive grid (4 cols desktop, 2 tablet, 1 mobile) at
  frontend/TaskNest/src/app/dashboard.css
  - [ ] T086 [US6] Add mobile touch-friendly tap targets at frontend/TaskNest/src/app/dashboard.css
  - [ ] T087 [P] [US6] Add loading states to dashboard at frontend/TaskNest/src/app/(app)/dashboard/page.tsx

  **Checkpoint**: User Story 6 complete - modern design and animations implemented

  ---

  ## Phase 9: User Story 7 - Bulk Task Operations (Priority: P3)

  **Goal**: Implement bulk selection and operations

  **Independent Test**: Select multiple tasks and perform bulk actions

  ### Implementation for User Story 7

  - [ ] T088 [P] [US7] Add bulk selection mode toggle at frontend/TaskNest/src/components/dashboard/BulkActions.tsx        
  - [ ] T089 [P] [US7] Add checkboxes to task cards at frontend/TaskNest/src/components/tasks/TaskCard.tsx
  - [ ] T090 [P] [US7] Create bulk actions toolbar at frontend/TaskNest/src/components/dashboard/BulkActions.tsx
  - [ ] T091 [US7] Implement bulk complete action at frontend/TaskNest/src/components/dashboard/BulkActions.tsx
  - [ ] T092 [US7] Implement bulk delete action at frontend/TaskNest/src/components/dashboard/BulkActions.tsx
  - [ ] T093 [US7] Implement bulk add tag action at frontend/TaskNest/src/components/dashboard/BulkActions.tsx
  - [ ] T094 [P] [US7] Add CSS for bulk selection UI at frontend/TaskNest/src/app/dashboard.css

  **Checkpoint**: User Story 7 complete - bulk operations working

  ---

  ## Phase 10: User Story 8 - Task Grouping and Views (Priority: P3)

  **Goal**: Implement task grouping by date, priority, and status

  **Independent Test**: Switch between grouping options and verify tasks are organized correctly

  ### Implementation for User Story 8

  - [ ] T095 [P] [US8] Create GroupSelector component at frontend/TaskNest/src/components/dashboard/GroupSelector.tsx      
  - [ ] T096 [US8] Implement group by date logic at frontend/TaskNest/src/hooks/useTasks.ts
  - [ ] T097 [US8] Implement group by priority logic at frontend/TaskNest/src/hooks/useTasks.ts
  - [ ] T098 [US8] Implement group by status logic at frontend/TaskNest/src/hooks/useTasks.ts
  - [ ] T099 [P] [US8] Create GroupHeader component at frontend/TaskNest/src/components/dashboard/GroupHeader.tsx
  - [ ] T100 [US8] Update TaskList to support grouping at frontend/TaskNest/src/components/tasks/TaskList.tsx
  - [ ] T101 [P] [US8] Add CSS for grouped layout at frontend/TaskNest/src/app/dashboard.css

  **Checkpoint**: User Story 8 complete - task grouping working

  ---

  ## Phase 11: User Story 9 - Export and Keyboard Shortcuts (Priority: P3)

  **Goal**: Implement CSV/JSON export and keyboard shortcuts

  **Independent Test**: Export tasks and use keyboard shortcuts for common actions

  ### Implementation for User Story 9

  - [ ] T102 [P] [US9] Create export utility for CSV at frontend/TaskNest/src/lib/export.ts
  - [ ] T103 [P] [US9] Create export utility for JSON at frontend/TaskNest/src/lib/export.ts
  - [ ] T104 [P] [US9] Create ExportButton component at frontend/TaskNest/src/components/dashboard/ExportButton.tsx        
  - [ ] T105 [US9] Implement keyboard shortcut handler at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T106 [US9] Add "N" shortcut for new task at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T107 [US9] Add "S" shortcut for search at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T108 [US9] Add "F" shortcut for filters at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T109 [US9] Add "E" shortcut for edit at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T110 [US9] Add "Delete" shortcut for delete at frontend/TaskNest/src/hooks/useKeyboardShortcuts.ts
  - [ ] T111 [P] [US9] Create keyboard shortcuts help dialog at
  frontend/TaskNest/src/components/dashboard/ShortcutsHelp.tsx

  **Checkpoint**: User Story 9 complete - export and shortcuts working

  ---

  ## Phase 12: User Story 10 - Team Collaboration System (Priority: P2)

  **Goal**: Implement team creation, invitations, assignments, and comments

  **Independent Test**: Create team, invite members, assign tasks, add comments with mentions

  ### Backend for User Story 10

  - [ ] T112 [P] [US10] Create team schemas at backend/src/schemas/team.py
  - [ ] T113 [P] [US10] Create TeamService at backend/src/services/team_service.py
  - [ ] T114 [US10] Create POST /teams endpoint at backend/src/api/teams.py
  - [ ] T115 [US10] Create GET /teams endpoint at backend/src/api/teams.py
  - [ ] T116 [US10] Create GET /teams/{id} endpoint at backend/src/api/teams.py
  - [ ] T117 [US10] Create GET /teams/{id}/members endpoint at backend/src/api/teams.py
  - [ ] T118 [US10] Create POST /teams/{id}/invite endpoint at backend/src/api/teams.py
  - [ ] T119 [P] [US10] Create email service for invitations at backend/src/services/email_service.py
  - [ ] T120 [P] [US10] Create comment schemas at backend/src/schemas/comment.py
  - [ ] T121 [P] [US10] Create CommentService at backend/src/services/comment_service.py
  - [ ] T122 [US10] Create POST /tasks/{id}/comments endpoint at backend/src/api/tasks.py
  - [ ] T123 [US10] Create GET /tasks/{id}/comments endpoint at backend/src/api/tasks.py
  - [ ] T124 [US10] Update task assignment logic at backend/src/services/task_service.py

  ### Frontend for User Story 10

  - [ ] T125 [P] [US10] Create teams API client at frontend/TaskNest/src/lib/teams-api.ts
  - [ ] T126 [P] [US10] Create useTeams hook at frontend/TaskNest/src/hooks/useTeams.ts
  - [ ] T127 [US10] Create Team page at frontend/TaskNest/src/app/(app)/team/page.tsx
  - [ ] T128 [US10] Import teams.css in Team page at frontend/TaskNest/src/app/(app)/team/page.tsx
  - [ ] T129 [P] [US10] Create TeamList component at frontend/TaskNest/src/components/teams/TeamList.tsx
  - [ ] T130 [P] [US10] Create CreateTeamModal component at frontend/TaskNest/src/components/teams/CreateTeamModal.tsx     
  - [ ] T131 [P] [US10] Create InviteMemberModal component at frontend/TaskNest/src/components/teams/InviteMemberModal.tsx 
  - [ ] T132 [P] [US10] Create MemberList component at frontend/TaskNest/src/components/teams/MemberList.tsx
  - [ ] T133 [P] [US10] Create TaskAssignment component at frontend/TaskNest/src/components/tasks/TaskAssignment.tsx       
  - [ ] T134 [P] [US10] Create CommentThread component at frontend/TaskNest/src/components/tasks/CommentThread.tsx
  - [ ] T135 [P] [US10] Add mention autocomplete at frontend/TaskNest/src/components/tasks/CommentInput.tsx
  - [ ] T136 [P] [US10] Add CSS for team components at frontend/TaskNest/src/app/teams.css

  **Checkpoint**: User Story 10 complete - team collaboration working

  ---

  ## Phase 13: User Story 11 - Full Calendar with Drag-Drop (Priority: P2)

  **Goal**: Implement calendar view with month/week/day views and drag-drop rescheduling

  **Independent Test**: View tasks on calendar, drag to reschedule, switch views

  ### Backend for User Story 11

  - [ ] T137 [US11] Create GET /calendar/tasks endpoint at backend/src/api/calendar.py
  - [ ] T138 [US11] Create PATCH /tasks/{id}/reschedule endpoint at backend/src/api/tasks.py

  ### Frontend for User Story 11

  - [ ] T139 [P] [US11] Create calendar API client at frontend/TaskNest/src/lib/calendar-api.ts
  - [ ] T140 [US11] Create Calendar page at frontend/TaskNest/src/app/(app)/calendar/page.tsx
  - [ ] T141 [US11] Import calendar.css in Calendar page at frontend/TaskNest/src/app/(app)/calendar/page.tsx
  - [ ] T142 [P] [US11] Create CalendarView component at frontend/TaskNest/src/components/calendar/CalendarView.tsx        
  - [ ] T143 [P] [US11] Create MonthView component at frontend/TaskNest/src/components/calendar/MonthView.tsx
  - [ ] T144 [P] [US11] Create WeekView component at frontend/TaskNest/src/components/calendar/WeekView.tsx
  - [ ] T145 [P] [US11] Create DayView component at frontend/TaskNest/src/components/calendar/DayView.tsx
  - [ ] T146 [US11] Implement drag-drop with @dnd-kit at frontend/TaskNest/src/components/calendar/CalendarView.tsx        
  - [ ] T147 [US11] Add reschedule API integration at frontend/TaskNest/src/components/calendar/CalendarView.tsx
  - [ ] T148 [P] [US11] Add CSS for calendar layout at frontend/TaskNest/src/app/calendar.css
  - [ ] T149 [P] [US11] Add CSS for drag-drop animations at frontend/TaskNest/src/app/calendar.css

  **Checkpoint**: User Story 11 complete - calendar with drag-drop working

  ---

  ## Phase 14: User Story 12 - Complete Settings & Account Management (Priority: P2)

  **Goal**: Implement profile, preferences, and account management

  **Independent Test**: Update profile, change preferences, export data, test account deletion flow

  ### Backend for User Story 12

  - [ ] T150 [US12] Create GET /settings/profile endpoint at backend/src/api/settings.py
  - [ ] T151 [US12] Create PUT /settings/profile endpoint at backend/src/api/settings.py
  - [ ] T152 [US12] Create PUT /settings/password endpoint at backend/src/api/settings.py
  - [ ] T153 [US12] Create POST /settings/export-data endpoint at backend/src/api/settings.py
  - [ ] T154 [US12] Create DELETE /settings/delete-account endpoint at backend/src/api/settings.py

  ### Frontend for User Story 12

  - [ ] T155 [P] [US12] Create settings API client at frontend/TaskNest/src/lib/settings-api.ts
  - [ ] T156 [US12] Create Settings page at frontend/TaskNest/src/app/(app)/settings/page.tsx
  - [ ] T157 [US12] Import settings.css in Settings page at frontend/TaskNest/src/app/(app)/settings/page.tsx
  - [ ] T158 [P] [US12] Create ProfileTab component at frontend/TaskNest/src/components/settings/ProfileTab.tsx
  - [ ] T159 [P] [US12] Create PreferencesTab component at frontend/TaskNest/src/components/settings/PreferencesTab.tsx    
  - [ ] T160 [P] [US12] Create NotificationsTab component at frontend/TaskNest/src/components/settings/NotificationsTab.tsx  - [ ] T161 [P] [US12] Create AccountTab component at frontend/TaskNest/src/components/settings/AccountTab.tsx
  - [ ] T162 [P] [US12] Create ChangePasswordModal component at
  frontend/TaskNest/src/components/settings/ChangePasswordModal.tsx
  - [ ] T163 [P] [US12] Create DeleteAccountModal component at
  frontend/TaskNest/src/components/settings/DeleteAccountModal.tsx
  - [ ] T164 [P] [US12] Add CSS for settings layout at frontend/TaskNest/src/app/settings.css

  **Checkpoint**: User Story 12 complete - settings and account management working

  ---

  ## Phase 15: User Story 13 - Full Analytics Dashboard (Priority: P2)

  **Goal**: Implement analytics with charts, insights, and custom reports

  **Independent Test**: View charts, filter by date range, generate and download reports

  ### Backend for User Story 13

  - [ ] T165 [P] [US13] Create AnalyticsService at backend/src/services/analytics_service.py
  - [ ] T166 [US13] Create GET /analytics/completion-rate endpoint at backend/src/api/analytics.py
  - [ ] T167 [US13] Create GET /analytics/priority-distribution endpoint at backend/src/api/analytics.py
  - [ ] T168 [US13] Create POST /analytics/reports endpoint at backend/src/api/analytics.py

  ### Frontend for User Story 13

  - [ ] T169 [P] [US13] Create analytics API client at frontend/TaskNest/src/lib/analytics-api.ts
  - [ ] T170 [US13] Create Analytics page at frontend/TaskNest/src/app/(app)/analytics/page.tsx
  - [ ] T171 [US13] Import analytics.css in Analytics page at frontend/TaskNest/src/app/(app)/analytics/page.tsx
  - [ ] T172 [P] [US13] Create CompletionRateChart component with Chart.js at
  frontend/TaskNest/src/components/analytics/CompletionRateChart.tsx
  - [ ] T173 [P] [US13] Create PriorityDistributionChart component at
  frontend/TaskNest/src/components/analytics/PriorityDistributionChart.tsx
  - [ ] T174 [P] [US13] Create ProductivityHeatmap component at
  frontend/TaskNest/src/components/analytics/ProductivityHeatmap.tsx
  - [ ] T175 [P] [US13] Create DateRangeFilter component at frontend/TaskNest/src/components/analytics/DateRangeFilter.tsx 
  - [ ] T176 [P] [US13] Create ReportGenerator component at frontend/TaskNest/src/components/analytics/ReportGenerator.tsx 
  - [ ] T177 [US13] Implement PDF generation with jsPDF at frontend/TaskNest/src/lib/pdf-generator.ts
  - [ ] T178 [P] [US13] Add CSS for analytics layout at frontend/TaskNest/src/app/analytics.css

  **Checkpoint**: User Story 13 complete - analytics dashboard working

  ---

  ## Phase 16: User Story 14 - Full Project Management (Priority: P2)

  **Goal**: Implement projects, milestones, dependencies, and Gantt charts

  **Independent Test**: Create project, add tasks with dependencies, view Gantt chart, drag to reschedule

  ### Backend for User Story 14

  - [ ] T179 [P] [US14] Create project schemas at backend/src/schemas/project.py
  - [ ] T180 [P] [US14] Create ProjectService at backend/src/services/project_service.py
  - [ ] T181 [US14] Create POST /projects endpoint at backend/src/api/projects.py
  - [ ] T182 [US14] Create GET /projects endpoint at backend/src/api/projects.py
  - [ ] T183 [US14] Create GET /projects/{id} endpoint at backend/src/api/projects.py
  - [ ] T184 [US14] Create POST /projects/{id}/milestones endpoint at backend/src/api/projects.py
  - [ ] T185 [US14] Create GET /projects/{id}/milestones endpoint at backend/src/api/projects.py
  - [ ] T186 [US14] Add dependency validation logic at backend/src/services/project_service.py

  ### Frontend for User Story 14

  - [ ] T187 [P] [US14] Create projects API client at frontend/TaskNest/src/lib/projects-api.ts
  - [ ] T188 [US14] Create Projects page at frontend/TaskNest/src/app/(app)/projects/page.tsx
  - [ ] T189 [US14] Import projects.css in Projects page at frontend/TaskNest/src/app/(app)/project
    /page.tsx
  - [ ] T190 [P] [US14] Create ProjectList component at frontend/TaskNest/src/components/projects/ProjectList.tsx
  - [ ] T191 [P] [US14] Create ProjectDetail component at frontend/TaskNest/src/components/projects/ProjectDetail.tsx      
  - [ ] T192 [P] [US14] Create MilestoneList component at frontend/TaskNest/src/components/projects/MilestoneList.tsx      
  - [ ] T193 [P] [US14] Create GanttChart component with @dnd-kit at
  frontend/TaskNest/src/components/projects/GanttChart.tsx
  - [ ] T194 [P] [US14] Create DependencyGraph component at frontend/TaskNest/src/components/projects/DependencyGraph.tsx  
  - [ ] T195 [US14] Implement drag-drop for Gantt chart at frontend/TaskNest/src/components/projects/GanttChart.tsx        
  - [ ] T196 [P] [US14] Add CSS for project layout at frontend/TaskNest/src/app/projects.css
  - [ ] T197 [P] [US14] Add CSS for Gantt chart at frontend/TaskNest/src/app/projects.css

  **Checkpoint**: User Story 14 complete - project management with Gantt charts working

  ---

  ## Phase 17: User Story 15 - Notification Center with History (Priority: P2)

  **Goal**: Implement notification center, preferences, and history with filtering

  **Independent Test**: Trigger notifications, view in center, configure preferences, filter history

  ### Backend for User Story 15

  - [ ] T198 [P] [US15] Create notification schemas at backend/src/schemas/notification.py
  - [ ] T199 [P] [US15] Create NotificationService at backend/src/services/notification_service.py
  - [ ] T200 [US15] Create GET /notifications endpoint at backend/src/api/notifications.py
  - [ ] T201 [US15] Create POST /notifications/mark-all-read endpoint at backend/src/api/notifications.py
  - [ ] T202 [US15] Create GET /notifications/preferences endpoint at backend/src/api/notifications.py
  - [ ] T203 [US15] Create PUT /notifications/preferences endpoint at backend/src/api/notifications.py

  ### Frontend for User Story 15

  - [ ] T204 [P] [US15] Create notifications API client at frontend/TaskNest/src/lib/notifications-api.ts
  - [ ] T205 [P] [US15] Create useNotifications hook at frontend/TaskNest/src/hooks/useNotifications.ts
  - [ ] T206 [P] [US15] Create NotificationBell component at
  frontend/TaskNest/src/components/notifications/NotificationBell.tsx
  - [ ] T207 [P] [US15] Create NotificationDropdown component at
  frontend/TaskNest/src/components/notifications/NotificationDropdown.tsx
  - [ ] T208 [US15] Create Notifications page at frontend/TaskNest/src/app/(app)/notifications/page.tsx
  - [ ] T209 [US15] Import notifications.css in Notifications page at
  frontend/TaskNest/src/app/(app)/notifications/page.tsx
  - [ ] T210 [P] [US15] Create NotificationList component at
  frontend/TaskNest/src/components/notifications/NotificationList.tsx
  - [ ] T211 [P] [US15] Create NotificationItem component at
  frontend/TaskNest/src/components/notifications/NotificationItem.tsx
  - [ ] T212 [P] [US15] Create NotificationFilters component at
  frontend/TaskNest/src/components/notifications/NotificationFilters.tsx
  - [ ] T213 [P] [US15] Create NotificationPreferences component at
  frontend/TaskNest/src/components/notifications/NotificationPreferences.tsx
  - [ ] T214 [US15] Add notification bell to layout at frontend/TaskNest/src/app/(app)/layout.tsx
  - [ ] T215 [P] [US15] Add CSS for notification components at frontend/TaskNest/src/app/notifications.css

  **Checkpoint**: User Story 15 complete - notification center fully functional

  ---

  ## Phase 18: Polish & Cross-Cutting Concerns

  **Purpose**: Final improvements affecting multiple user stories

  - [ ] T216 [P] Add loading skeletons to all pages at frontend/TaskNest/src/components/ui/Skeleton.tsx
  - [ ] T217 [P] Add error boundaries to all major sections at frontend/TaskNest/src/components/ErrorBoundary.tsx
  - [ ] T218 [P] Implement optimistic updates for all mutations at frontend/TaskNest/src/hooks/
  - [ ] T219 [P] Add toast notifications for all actions at frontend/TaskNest/src/components/ui/Toast.tsx
  - [ ] T220 [P] Verify all animations run at 60fps at frontend/TaskNest/src/app/*.css
  - [ ] T221 [P] Add ARIA labels to all interactive elements at frontend/TaskNest/src/components/
  - [ ] T222 [P] Implement keyboard navigation for all modals at frontend/TaskNest/src/components/
  - [ ] T223 [P] Add focus management for accessibility at frontend/TaskNest/src/components/
  - [ ] T224 [P] Test responsive design on mobile/tablet/desktop
  - [ ] T225 [P] Verify color contrast ratios (WCAG AA) at frontend/TaskNest/src/app/*.css
  - [ ] T226 [P] Add empty states to all list views at frontend/TaskNest/src/components/
  - [ ] T227 [P] Implement search debouncing (300ms) at frontend/TaskNest/src/hooks/
  - [ ] T228 [P] Add pagination/infinite scroll for large lists at frontend/TaskNest/src/components/
  - [ ] T229 [P] Optimize bundle size and code splitting
  - [ ] T230 [P] Add performance monitoring
  - [ ] T231 Run quickstart.md validation scenarios
  - [ ] T232 Create user documentation at docs/user-guide.md
  - [ ] T233 Create developer documentation at docs/developer-guide.md
  - [ ] T234 Update README.md with feature overview
  - [ ] T235 Final code review and cleanup

  ---

  ## Dependencies & Execution Order

  ### Phase Dependencies

  - **Setup (Phase 1)**: No dependencies - can start immediately
  - **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - **User Stories (Phase 3-17)**: All depend on Foundational phase completion
    - User stories can then proceed in parallel (if staffed)
    - Or sequentially in priority order (P1 → P2 → P3)
  - **Polish (Phase 18)**: Depends on all desired user stories being complete

  ### User Story Dependencies

  **P1 Stories (MVP - Must Complete First)**:
  - **User Story 1 (Phase 3)**: Can start after Foundational - No dependencies on other stories
  - **User Story 2 (Phase 4)**: Can start after Foundational - No dependencies on other stories

  **P2 Stories (Enhanced Features)**:
  - **User Story 3 (Phase 5)**: Can start after Foundational - No dependencies
  - **User Story 4 (Phase 6)**: Can start after Foundational - No dependencies
  - **User Story 5 (Phase 7)**: Can start after Foundational - No dependencies
  - **User Story 6 (Phase 8)**: Can start after Foundational - No dependencies
  - **User Story 10 (Phase 12)**: Can start after Foundational - No dependencies
  - **User Story 11 (Phase 13)**: Can start after Foundational - No dependencies
  - **User Story 12 (Phase 14)**: Can start after Foundational - No dependencies
  - **User Story 13 (Phase 15)**: Can start after Foundational - No dependencies
  - **User Story 14 (Phase 16)**: Can start after Foundational - No dependencies
  - **User Story 15 (Phase 17)**: Can start after Foundational - No dependencies

  **P3 Stories (Power User Features)**:
  - **User Story 7 (Phase 9)**: Can start after Foundational - No dependencies
  - **User Story 8 (Phase 10)**: Can start after Foundational - No dependencies
  - **User Story 9 (Phase 11)**: Can start after Foundational - No dependencies

  ### Within Each User Story

  - Backend models/services before API endpoints
  - API endpoints before frontend integration
  - Core components before integration
  - Story complete before moving to next priority

  ### Parallel Opportunities

  **Phase 1 (Setup)**: All tasks T002-T011 can run in parallel

  **Phase 2 (Foundational)**:
  - Backend models T012-T024 can run in parallel
  - Frontend foundation T027-T028 can run in parallel

  **After Phase 2 Completes**:
  - All P1 user stories (US1, US2) can start in parallel
  - All P2 user stories (US3-US6, US10-US15) can start in parallel
  - All P3 user stories (US7-US9) can start in parallel

  **Within Each User Story**:
  - Tasks marked [P] can run in parallel
  - Backend and frontend tasks for same story can overlap once API contracts are defined

  ---

  ## Parallel Example: User Story 1

  ```bash
  # After Foundational phase completes, launch User Story 1 tasks in parallel:

  # Frontend CSS and components (can run together):
  Task T032: "Create enhanced statistics component"
  Task T033: "Add CSS for stat cards"
  Task T038: "Add Edit button to task cards"
  Task T039: "Add Delete button to task cards"
  Task T040: "Create TaskDetailModal component"
  Task T042: "Add CSS for task card hover effects"
  Task T043: "Add CSS for modal animations"

  # Integration tasks (run after components ready):
  Task T034: "Connect search bar to backend API"
  Task T035: "Integrate FilterPanel component"
  Task T036: "Integrate SortDropdown component"

  ---
  Parallel Example: User Story 10 (Team Collaboration)

  # Backend tasks (can run in parallel):
  Task T112: "Create team schemas"
  Task T113: "Create TeamService"
  Task T119: "Create email service"
  Task T120: "Create comment schemas"
  Task T121: "Create CommentService"

  # Frontend components (can run in parallel after backend ready):
  Task T125: "Create teams API client"
  Task T129: "Create TeamList component"
  Task T130: "Create CreateTeamModal component"
  Task T131: "Create InviteMemberModal component"
  Task T132: "Create MemberList component"
  Task T133: "Create TaskAssignment component"
  Task T134: "Create CommentThread component"
  Task T136: "Add CSS for team components"

  ---
  Implementation Strategy

  MVP First (P1 Stories Only)

  Week 1 Focus:
  1. Complete Phase 1: Setup (T001-T011)
  2. Complete Phase 2: Foundational (T012-T028)
  3. Complete Phase 3: User Story 1 - Core Dashboard (T029-T043)
  4. Complete Phase 4: User Story 2 - Sidebar Navigation (T044-T054)

  MVP Deliverable: Functional dashboard at /dashboard with search, filter, sort, and enhanced sidebar navigation

  Estimated: 54 tasks

  Incremental Delivery (2-Week Timeline)

  Week 1 (Days 1-7): P1 Features
  - Days 1-2: Phase 1 (Setup) + Phase 2 (Foundational)
  - Days 3-4: Phase 3 (User Story 1 - Core Dashboard)
  - Days 5-7: Phase 4 (User Story 2 - Sidebar Navigation)

  Week 2 (Days 8-14): P2 Features
  - Days 8-9: Phase 5-8 (User Stories 3-6: Visual Stats, Detail View, Advanced Sort/Filter, Design)
  - Days 10-11: Phase 12-13 (User Stories 10-11: Team Collaboration, Calendar)
  - Days 12-13: Phase 14-17 (User Stories 12-15: Settings, Analytics, Projects, Notifications)
  - Day 14: Phase 18 (Polish & Testing)

  P3 Features (Optional/Future):
  - Phase 9-11 (User Stories 7-9: Bulk Operations, Grouping, Export/Shortcuts)

  Parallel Team Strategy

  With 3 developers:

  Week 1:
  - All: Complete Phase 1-2 together (Setup + Foundation)
  - Developer A: User Story 1 (Core Dashboard)
  - Developer B: User Story 2 (Sidebar Navigation)
  - Developer C: User Story 3 (Visual Statistics)

  Week 2:
  - Developer A: User Stories 10-11 (Team + Calendar)
  - Developer B: User Stories 12-13 (Settings + Analytics)
  - Developer C: User Stories 14-15 (Projects + Notifications)
  - All: Phase 18 (Polish) together

  ---
  CSS Implementation Guidelines

  Following Existing Patterns

  All CSS files MUST follow the patterns established in landing.css and auth.css:

  CSS Custom Properties (use existing variables):
  :root {
      --primary: #E49B0F;
      --bg-dark: #0A0A0A;
      --text-light: #FFFFFF;
  }

  Card Pattern:
  .dashboard-card {
      background: rgba(10, 10, 10, 0.5);
      border: 1px solid rgba(228, 155, 15, 0.2);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
  }

  .dashboard-card:hover {
      transform: translateY(-5px);
      border-color: var(--primary);
      box-shadow: 0 20px 40px rgba(228, 155, 15, 0.2);
  }

  Animation Pattern:
  @keyframes fadeInUp {
      from {
          opacity: 0;
          transform: translateY(30px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  .animate-in {
      animation: fadeInUp 0.5s ease-out;
  }

  ---
  Validation Checklist

  Before marking phase complete, verify:

  - All tasks in phase completed
  - Independent test criteria passing
  - No console errors or warnings
  - Responsive design working (mobile, tablet, desktop)
  - Pure vanilla CSS (NO Tailwind classes)
  - CSS follows landing.css/auth.css patterns
  - Animations smooth at 60fps
  - Loading states implemented
  - Error handling working
  - ARIA labels present
  - Keyboard navigation working
  - Code follows project structure from plan.md
  - Git commits follow convention

  ---
  Notes

  - [P] tasks = different files, no dependencies, can run in parallel
  - [Story] label maps task to specific user story for traceability
  - Each user story should be independently completable and testable
  - Pure vanilla CSS only - NO Tailwind CSS classes
  - Follow existing CSS patterns from landing.css and auth.css
  - All animations must run at 60fps
  - Commit after each task or logical group
  - Stop at any checkpoint to validate story independently
  - 2-week deadline is aggressive - prioritize P1 stories first

  ---