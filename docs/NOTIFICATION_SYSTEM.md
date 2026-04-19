# TaskNest Notification System

## Overview

TaskNest implements a modern, SaaS-style notification system with real-time updates, user-friendly interactions, and proper state management.

## Architecture

### Backend (FastAPI + PostgreSQL)

**Database Model** (`backend/src/models/notification.py`)
- `id`: Unique notification identifier
- `user_id`: Owner of the notification
- `type`: Notification category (task_update, mention, assignment, reminder)
- `content`: Notification message text
- `related_item_type`: Type of related entity (task, comment, etc.)
- `related_item_id`: ID of related entity
- `read`: Boolean flag for read status
- `created_at`: Timestamp

**API Endpoints** (`backend/src/api/notifications.py`)
- `GET /notifications` - Fetch user notifications (with filters)
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/{id}/read` - Mark single notification as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/{id}` - Delete notification

**Service Layer** (`backend/src/services/notification_service.py`)
- Business logic for CRUD operations
- Authorization checks (users can only access their own notifications)
- Efficient querying with filters and limits

### Frontend (Next.js + React)

**API Client** (`frontend/src/lib/notifications-api.ts`)
- Centralized API communication
- Type-safe with TypeScript interfaces
- Uses PUT method (matching backend)

**Custom Hook** (`frontend/src/hooks/useInAppNotifications.ts`)
- State management for notifications
- Auto-polling every 30 seconds for unread count
- Optimistic UI updates
- Error handling

**Components**

1. **NotificationBell** (`components/notifications/NotificationBell.tsx`)
   - Header dropdown with badge showing unread count
   - Quick access to recent notifications
   - Filter: Show all / Unread only
   - Auto-refresh every 30 seconds
   - Click notification to mark as read
   - Delete with confirmation modal

2. **NotificationsPage** (`app/(app)/notifications/page.tsx`)
   - Full notification center
   - Advanced filtering by type and status
   - Bulk actions (Mark all as read)
   - Click-to-read functionality
   - Delete with confirmation

3. **ConfirmDialog** (`components/notifications/ConfirmDialog.tsx`)
   - Reusable confirmation modal
   - SaaS-style design (no browser alerts)
   - Variants: danger, warning, info
   - Prevents accidental deletions

## Key Features

### 1. Click-to-Read
Notifications are automatically marked as read when clicked in both:
- Notification bell dropdown
- Full notifications page

### 2. Real-time Updates
- Unread count badge updates every 30 seconds
- Notifications list refreshes when dropdown opens
- Optimistic UI updates for instant feedback

### 3. Smart Filtering
- **By Type**: task_update, mention, assignment, reminder
- **By Status**: all, unread, read
- **Unread Only** toggle in bell dropdown

### 4. Professional UX
- Confirmation modals instead of browser alerts
- Smooth animations and transitions
- Loading states and empty states
- Relative timestamps (e.g., "5m ago", "2h ago")
- Visual distinction between read/unread

### 5. Security
- All operations require authentication
- Users can only access their own notifications
- Authorization checks at service layer

## Notification Types

| Type | Icon | Use Case |
|------|------|----------|
| `task_update` | 📝 | Task status changes, updates |
| `mention` | @ | User mentioned in comment |
| `assignment` | 👤 | Task assigned to user |
| `reminder` | ⏰ | Due date reminders |

## User Flows

### Viewing Notifications
1. User clicks bell icon in header
2. Dropdown opens showing recent notifications
3. Badge shows unread count
4. User can toggle "Unread Only" filter
5. Click notification to mark as read
6. Click "View All" to go to full page

### Marking as Read
**Individual:**
- Click notification anywhere (bell or page)
- Click checkmark button (explicit action)

**Bulk:**
- Click "Mark All as Read" button

### Deleting Notifications
1. User clicks delete (X) button
2. Confirmation modal appears
3. User confirms or cancels
4. Notification removed from list
5. Unread count updates if needed

## Technical Decisions

### Why PUT instead of PATCH?
Backend uses PUT for mark-as-read operations. While PATCH is semantically more correct for partial updates, PUT works fine for this simple boolean toggle and maintains consistency with the existing backend implementation.

### Why Polling instead of WebSockets?
- Simpler implementation
- 30-second interval is sufficient for notifications
- Lower server resource usage
- Easier to debug and maintain
- Can upgrade to WebSockets later if needed

### Why Separate API File?
- Single source of truth for API calls
- Easier to maintain and update
- Type safety with TypeScript
- Prevents duplicate code and method mismatches

## Future Enhancements

1. **Push Notifications**
   - Browser push API integration
   - Service worker for background notifications
   - User preference management

2. **WebSocket Real-time**
   - Instant notification delivery
   - Live updates without polling
   - Better for high-frequency notifications

3. **Notification Preferences**
   - Per-type enable/disable
   - Email digest options
   - Quiet hours

4. **Rich Notifications**
   - Action buttons (Approve, Reject)
   - Inline replies
   - Embedded previews

5. **Notification Groups**
   - Collapse similar notifications
   - "5 tasks updated" instead of 5 separate items

## Troubleshooting

### 405 Method Not Allowed
**Cause**: Frontend using PATCH, backend expecting PUT
**Fix**: Updated `notifications-api.ts` to use PUT method

### Notifications Not Updating
**Cause**: Duplicate API files with different implementations
**Fix**: Removed `notificationsApi.ts`, kept `notifications-api.ts`

### Delete Confirmation Not Showing
**Cause**: Using browser `confirm()` instead of custom modal
**Fix**: Implemented `ConfirmDialog` component

### Click Not Marking as Read
**Cause**: Missing click handler on notification items
**Fix**: Added `handleNotificationClick` with mark-as-read logic

## Code References

- Backend API: `backend/src/api/notifications.py:62-85`
- Service Layer: `backend/src/services/notification_service.py:110-152`
- Frontend API: `frontend/src/lib/notifications-api.ts:30-38`
- Bell Component: `frontend/src/components/notifications/NotificationBell.tsx:81-85`
- Page Component: `frontend/src/app/(app)/notifications/page.tsx:56-67`
