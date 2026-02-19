# TaskNest - Comprehensive Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to systematically test all features of TaskNest.

---

## 1️⃣ Authentication Testing

### Registration
- [ ] Navigate to http://localhost:3001/signup
- [ ] **Test Case 1.1**: Register with valid email and password
  - Email: test@example.com
  - Password: Test123456!
  - Expected: Success, redirect to login
- [ ] **Test Case 1.2**: Register with existing email
  - Expected: Error message "Email already exists"
- [ ] **Test Case 1.3**: Register with weak password
  - Password: 123
  - Expected: Validation error
- [ ] **Test Case 1.4**: Register with invalid email
  - Email: notanemail
  - Expected: Validation error

### Login
- [ ] Navigate to http://localhost:3001/login
- [ ] **Test Case 2.1**: Login with correct credentials
  - Expected: Success, redirect to /tasks
- [ ] **Test Case 2.2**: Login with wrong password
  - Expected: Error "Invalid credentials"
- [ ] **Test Case 2.3**: Login with non-existent email
  - Expected: Error "Invalid credentials"
- [ ] **Test Case 2.4**: Try accessing /tasks without login
  - Expected: Redirect to /login

### Logout
- [ ] **Test Case 3.1**: Click logout button
  - Expected: Redirect to /login, session cleared
- [ ] **Test Case 3.2**: Try accessing /tasks after logout
  - Expected: Redirect to /login

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 2️⃣ Task CRUD Operations

### Create Task
- [ ] **Test Case 4.1**: Create basic task
  - Title: "Test Task 1"
  - Description: "This is a test"
  - Priority: Medium
  - Expected: Task appears in list
- [ ] **Test Case 4.2**: Create task with all fields
  - Title: "Complete Task"
  - Description: "Full details"
  - Priority: High
  - Due Date: Tomorrow
  - Due Time: 14:00
  - Tags: Work, Urgent
  - Expected: All fields saved correctly
- [ ] **Test Case 4.3**: Create task without title
  - Expected: Validation error "Title is required"
- [ ] **Test Case 4.4**: Create task with very long title (>200 chars)
  - Expected: Validation error
- [ ] **Test Case 4.5**: Create task with template
  - Select "Daily Standup" template
  - Expected: Form pre-filled with template values

### Read/View Tasks
- [ ] **Test Case 5.1**: View all tasks
  - Expected: All created tasks visible
- [ ] **Test Case 5.2**: View task details
  - Click on a task
  - Expected: All details displayed correctly
- [ ] **Test Case 5.3**: View empty state
  - Delete all tasks
  - Expected: "No tasks found" message with icon

### Update Task
- [ ] **Test Case 6.1**: Edit task title
  - Change title to "Updated Task"
  - Expected: Title updated in list
- [ ] **Test Case 6.2**: Edit task priority
  - Change from Medium to High
  - Expected: Priority badge color changes
- [ ] **Test Case 6.3**: Add tags to existing task
  - Add "Important" tag
  - Expected: Tag appears on task
- [ ] **Test Case 6.4**: Update due date
  - Set due date to next week
  - Expected: Due date updated
- [ ] **Test Case 6.5**: Toggle task completion
  - Click checkbox
  - Expected: Task marked complete with strikethrough
  - Click again
  - Expected: Task marked incomplete

### Delete Task
- [ ] **Test Case 7.1**: Delete task
  - Click delete button
  - Expected: Confirmation dialog appears
- [ ] **Test Case 7.2**: Confirm deletion
  - Click "Confirm"
  - Expected: Task removed from list
- [ ] **Test Case 7.3**: Cancel deletion
  - Click "Cancel"
  - Expected: Task remains in list

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 3️⃣ Tags System

### Create Tags
- [ ] **Test Case 8.1**: Create new tag
  - Name: "Work"
  - Expected: Tag created and available
- [ ] **Test Case 8.2**: Create duplicate tag
  - Name: "Work" (already exists)
  - Expected: Error or tag reused
- [ ] **Test Case 8.3**: Create tag with special characters
  - Name: "Work@Home!"
  - Expected: Tag created successfully

### Assign Tags
- [ ] **Test Case 9.1**: Assign single tag to task
  - Expected: Tag appears on task
- [ ] **Test Case 9.2**: Assign multiple tags to task
  - Add 3 different tags
  - Expected: All tags visible
- [ ] **Test Case 9.3**: Remove tag from task
  - Click X on tag badge
  - Expected: Tag removed

### Filter by Tags
- [ ] **Test Case 10.1**: Filter by single tag
  - Select "Work" tag
  - Expected: Only tasks with "Work" tag shown
- [ ] **Test Case 10.2**: Filter by multiple tags
  - Select "Work" and "Urgent"
  - Expected: Tasks with either tag shown
- [ ] **Test Case 10.3**: Clear tag filter
  - Deselect all tags
  - Expected: All tasks shown

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 4️⃣ Search Functionality

- [ ] **Test Case 11.1**: Search by task title
  - Search: "Test"
  - Expected: Tasks with "Test" in title shown
- [ ] **Test Case 11.2**: Search by description
  - Search: "important"
  - Expected: Tasks with "important" in description shown
- [ ] **Test Case 11.3**: Search with no results
  - Search: "xyz123nonexistent"
  - Expected: "No tasks found" message
- [ ] **Test Case 11.4**: Clear search
  - Clear search box
  - Expected: All tasks shown
- [ ] **Test Case 11.5**: Keyboard shortcut
  - Press Cmd+K (Mac) or Ctrl+K (Windows)
  - Expected: Search box focused
- [ ] **Test Case 11.6**: Debouncing
  - Type quickly: "t-e-s-t"
  - Expected: Search waits 300ms before filtering

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 5️⃣ Filter & Sort

### Filter by Status
- [ ] **Test Case 12.1**: Filter "Pending"
  - Expected: Only incomplete tasks shown
- [ ] **Test Case 12.2**: Filter "Completed"
  - Expected: Only completed tasks shown
- [ ] **Test Case 12.3**: Filter "All"
  - Expected: All tasks shown

### Filter by Priority
- [ ] **Test Case 13.1**: Filter "High Priority"
  - Expected: Only high priority tasks shown
- [ ] **Test Case 13.2**: Filter "Medium Priority"
  - Expected: Only medium priority tasks shown
- [ ] **Test Case 13.3**: Filter "Low Priority"
  - Expected: Only low priority tasks shown

### Sort Options
- [ ] **Test Case 14.1**: Sort by "Created Date"
  - Expected: Newest/oldest first (toggle)
- [ ] **Test Case 14.2**: Sort by "Due Date"
  - Expected: Earliest/latest due date first
- [ ] **Test Case 14.3**: Sort by "Priority"
  - Expected: High → Medium → Low
- [ ] **Test Case 14.4**: Sort by "Title"
  - Expected: Alphabetical A-Z or Z-A

### Combined Filters
- [ ] **Test Case 15.1**: Filter + Search
  - Filter: High Priority + Search: "Test"
  - Expected: High priority tasks with "Test" shown
- [ ] **Test Case 15.2**: Filter + Sort
  - Filter: Pending + Sort: Due Date
  - Expected: Pending tasks sorted by due date

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 6️⃣ Recurring Tasks

### Create Recurring Task
- [ ] **Test Case 16.1**: Daily recurring task
  - Pattern: Daily, Every 1 day
  - Expected: Recurrence pattern saved
- [ ] **Test Case 16.2**: Weekly recurring task
  - Pattern: Weekly, Every 1 week, on Monday
  - Expected: Days of week saved
- [ ] **Test Case 16.3**: Monthly recurring task
  - Pattern: Monthly, Every 1 month, on day 15
  - Expected: Day of month saved
- [ ] **Test Case 16.4**: Custom recurring task
  - Pattern: Custom, Every 3 days
  - Expected: Custom interval saved
- [ ] **Test Case 16.5**: Recurring with end date
  - Set end date: 1 month from now
  - Expected: End date saved

### View Recurring Tasks
- [ ] **Test Case 17.1**: Recurring indicator visible
  - Expected: 🔄 icon or badge shown
- [ ] **Test Case 17.2**: View recurrence details
  - Expected: Pattern displayed (e.g., "Every 1 day")

### Edit Recurring Tasks
- [ ] **Test Case 18.1**: Change recurrence pattern
  - Change from daily to weekly
  - Expected: Pattern updated
- [ ] **Test Case 18.2**: Disable recurrence
  - Uncheck "Repeat this task"
  - Expected: Recurrence removed

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 7️⃣ Browser Notifications

### Permission & Setup
- [ ] **Test Case 19.1**: Request notification permission
  - Click bell icon
  - Expected: Browser permission prompt
- [ ] **Test Case 19.2**: Grant permission
  - Click "Allow"
  - Expected: Test notification appears
- [ ] **Test Case 19.3**: Open notification settings
  - Click settings gear icon
  - Expected: Settings modal opens

### Configure Notifications
- [ ] **Test Case 20.1**: Change notification timing
  - Set to 30 minutes before
  - Save settings
  - Expected: Setting saved to localStorage
- [ ] **Test Case 20.2**: Test notification
  - Click "Send Test Notification"
  - Expected: Test notification appears
- [ ] **Test Case 20.3**: Toggle notifications on/off
  - Click toggle
  - Expected: Notifications enabled/disabled

### Notification Behavior
- [ ] **Test Case 21.1**: Create task due in 10 minutes
  - Set due time: 10 minutes from now
  - Wait for notification
  - Expected: Notification appears at configured time
- [ ] **Test Case 21.2**: Click notification
  - Click on notification
  - Expected: Window focuses
- [ ] **Test Case 21.3**: Multiple notifications
  - Create 3 tasks due soon
  - Expected: Separate notification for each
- [ ] **Test Case 21.4**: No duplicate notifications
  - Expected: Same task not notified twice

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 8️⃣ Task Templates

### View Templates
- [ ] **Test Case 22.1**: Open template selector
  - Click "Use a Template" in new task form
  - Expected: Template grid appears
- [ ] **Test Case 22.2**: View default templates
  - Expected: 4 default templates visible
    - Daily Standup
    - Weekly Review
    - Monthly Report
    - Quick Task

### Use Templates
- [ ] **Test Case 23.1**: Select template
  - Click "Daily Standup"
  - Expected: Form pre-filled with template values
- [ ] **Test Case 23.2**: Modify template values
  - Change title and priority
  - Expected: Can customize before creating
- [ ] **Test Case 23.3**: Create task from template
  - Submit form
  - Expected: Task created, template use count incremented

### Manage Templates
- [ ] **Test Case 24.1**: Open template manager
  - Click template icon in header
  - Expected: Template manager modal opens
- [ ] **Test Case 24.2**: Create custom template
  - Name: "My Custom Template"
  - Set priority, tags, recurrence
  - Expected: Template created
- [ ] **Test Case 24.3**: Edit template
  - Click "Edit" on custom template
  - Change name
  - Expected: Template updated
- [ ] **Test Case 24.4**: Delete custom template
  - Click "Delete"
  - Expected: Template removed
- [ ] **Test Case 24.5**: Cannot delete default templates
  - Try to delete "Daily Standup"
  - Expected: No delete button or error

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 9️⃣ UI/UX Testing

### Loading States
- [ ] **Test Case 25.1**: Initial page load
  - Refresh page
  - Expected: Skeleton loaders appear
- [ ] **Test Case 25.2**: Creating task
  - Submit form
  - Expected: Loading spinner on button
- [ ] **Test Case 25.3**: Deleting task
  - Click delete
  - Expected: Loading state during deletion

### Error Handling
- [ ] **Test Case 26.1**: Network error
  - Disconnect internet
  - Try to create task
  - Expected: Error message displayed
- [ ] **Test Case 26.2**: Invalid data
  - Submit form with invalid data
  - Expected: Validation errors shown
- [ ] **Test Case 26.3**: Session expired
  - Wait for JWT to expire
  - Try to perform action
  - Expected: Redirect to login

### Animations
- [ ] **Test Case 27.1**: Modal animations
  - Open/close modals
  - Expected: Smooth fade and scale animations
- [ ] **Test Case 27.2**: Task list animations
  - Add/remove tasks
  - Expected: Smooth transitions
- [ ] **Test Case 27.3**: Hover effects
  - Hover over buttons and cards
  - Expected: Visual feedback

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 🔟 Responsive Design

### Mobile (320px - 639px)
- [ ] **Test Case 28.1**: Open on mobile
  - Resize browser to 375px width
  - Expected: Layout adapts, no horizontal scroll
- [ ] **Test Case 28.2**: Touch targets
  - Expected: All buttons at least 44x44px
- [ ] **Test Case 28.3**: Navigation
  - Expected: Mobile-friendly navigation
- [ ] **Test Case 28.4**: Forms
  - Expected: Full-width inputs, large touch areas

### Tablet (640px - 1023px)
- [ ] **Test Case 29.1**: Open on tablet
  - Resize to 768px width
  - Expected: 2-column layout where appropriate
- [ ] **Test Case 29.2**: Modals
  - Expected: Properly sized, not too wide

### Desktop (1024px+)
- [ ] **Test Case 30.1**: Open on desktop
  - Full screen
  - Expected: Multi-column layout, sidebar visible
- [ ] **Test Case 30.2**: Large screens
  - 1920px+ width
  - Expected: Content centered, max-width applied

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 1️⃣1️⃣ Accessibility Testing

### Keyboard Navigation
- [ ] **Test Case 31.1**: Tab through page
  - Press Tab repeatedly
  - Expected: Focus moves through all interactive elements
- [ ] **Test Case 31.2**: Modal focus trap
  - Open modal, press Tab
  - Expected: Focus stays within modal
- [ ] **Test Case 31.3**: Escape key
  - Press Escape in modal
  - Expected: Modal closes
- [ ] **Test Case 31.4**: Enter key
  - Focus on button, press Enter
  - Expected: Button activates

### Screen Reader
- [ ] **Test Case 32.1**: ARIA labels
  - Inspect elements
  - Expected: Proper aria-label attributes
- [ ] **Test Case 32.2**: Form labels
  - Expected: All inputs have associated labels
- [ ] **Test Case 32.3**: Error announcements
  - Submit invalid form
  - Expected: Errors announced to screen reader

### Visual
- [ ] **Test Case 33.1**: Focus indicators
  - Tab through page
  - Expected: Clear focus outline visible
- [ ] **Test Case 33.2**: Color contrast
  - Check text on backgrounds
  - Expected: Sufficient contrast ratio
- [ ] **Test Case 33.3**: Text scaling
  - Zoom to 200%
  - Expected: Text readable, no overlap

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 1️⃣2️⃣ Performance Testing

### Load Time
- [ ] **Test Case 34.1**: Initial page load
  - Clear cache, reload
  - Expected: Page loads in < 3 seconds
- [ ] **Test Case 34.2**: Subsequent loads
  - Reload page
  - Expected: Faster with caching

### Interactions
- [ ] **Test Case 35.1**: Search responsiveness
  - Type in search box
  - Expected: Results update smoothly
- [ ] **Test Case 35.2**: Large task list
  - Create 50+ tasks
  - Expected: Scrolling remains smooth
- [ ] **Test Case 35.3**: Filter/sort speed
  - Apply filters
  - Expected: Instant response

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 1️⃣3️⃣ Security Testing

### Authentication
- [ ] **Test Case 36.1**: Protected routes
  - Try accessing /tasks without login
  - Expected: Redirect to /login
- [ ] **Test Case 36.2**: JWT expiration
  - Wait for token to expire
  - Expected: Redirect to login on next action
- [ ] **Test Case 36.3**: Logout clears session
  - Logout, check localStorage
  - Expected: Auth tokens removed

### Data Isolation
- [ ] **Test Case 37.1**: User data separation
  - Create tasks with User A
  - Login as User B
  - Expected: User B cannot see User A's tasks
- [ ] **Test Case 37.2**: API authorization
  - Try to access another user's task via API
  - Expected: 403 Forbidden error

**Status**: ✅ PASS / ❌ FAIL
**Notes**: _____________________

---

## 📊 Testing Summary

### Overall Results

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Authentication | 9 | ___ | ___ | ___% |
| Task CRUD | 18 | ___ | ___ | ___% |
| Tags | 9 | ___ | ___ | ___% |
| Search | 6 | ___ | ___ | ___% |
| Filter & Sort | 11 | ___ | ___ | ___% |
| Recurring Tasks | 8 | ___ | ___ | ___% |
| Notifications | 9 | ___ | ___ | ___% |
| Templates | 9 | ___ | ___ | ___% |
| UI/UX | 9 | ___ | ___ | ___% |
| Responsive | 7 | ___ | ___ | ___% |
| Accessibility | 9 | ___ | ___ | ___% |
| Performance | 5 | ___ | ___ | ___% |
| Security | 5 | ___ | ___ | ___% |
| **TOTAL** | **113** | ___ | ___ | ___% |

### Critical Issues Found
1. _____________________
2. _____________________
3. _____________________

### Minor Issues Found
1. _____________________
2. _____________________
3. _____________________

### Recommendations
1. _____________________
2. _____________________
3. _____________________

---

## ✅ Sign-Off

**Tested By**: _____________________
**Date**: _____________________
**Environment**:
- Frontend: http://localhost:3001
- Backend: http://localhost:8000
- Database: Neon PostgreSQL

**Overall Status**:
- [ ] ✅ READY FOR PRODUCTION
- [ ] ⚠️ NEEDS FIXES
- [ ] ❌ NOT READY

**Notes**: _____________________

---

**Testing Completed**: _____________________
