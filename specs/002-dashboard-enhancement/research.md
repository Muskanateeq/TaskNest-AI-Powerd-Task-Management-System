# Research & Technology Decisions

**Feature**: Dashboard Enhancement - Modern SaaS UI
**Date**: 2026-02-12
**Phase**: 0 - Research

## Overview

This document captures research findings and technology decisions for implementing the dashboard enhancement with 6 major new feature sections (Team, Calendar, Settings, Analytics, Projects, Notifications).

## CSS Architecture Decision

### Question
How to implement modern, animated UI matching landing page quality?

### Options Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Pure Vanilla CSS** | ✅ Already used in landing.css/auth.css<br>✅ No build dependencies<br>✅ Full control over animations<br>✅ Excellent performance | ⚠️ More verbose than utility classes<br>⚠️ Need to manage class naming | ✅ **SELECTED** |
| Tailwind CSS | ✅ Rapid development<br>✅ Utility-first | ❌ User explicitly rejected<br>❌ Issues in current implementation | ❌ Rejected |
| CSS Modules | ✅ Scoped styles<br>✅ Type-safe with TypeScript | ⚠️ Different from existing pattern<br>⚠️ Requires build configuration | ❌ Not needed |
| CSS-in-JS | ✅ Component-scoped<br>✅ Dynamic styling | ❌ Runtime overhead<br>❌ Larger bundle size<br>❌ Different from existing pattern | ❌ Rejected |

### Decision: Pure Vanilla CSS

**Rationale**:
- Existing landing.css and auth.css demonstrate successful vanilla CSS implementation
- User explicitly requested this approach
- Provides full control over animations and transitions
- No additional dependencies or build complexity
- Consistent with existing codebase patterns

**Implementation Pattern**:
```css
/* Use existing CSS custom properties */
:root {
    --primary: #E49B0F;
    --bg-dark: #0A0A0A;
    /* ... existing variables */
}

/* Follow existing card pattern */
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

/* Use existing animation patterns */
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
```

## Chart Library Selection

### Question
Which charting library for analytics visualizations?

### Options Considered

| Library | Pros | Cons | Decision |
|---------|------|------|----------|
| **Chart.js** | ✅ Lightweight (60KB)<br>✅ Simple API<br>✅ Good documentation<br>✅ Canvas-based (performant) | ⚠️ Less customizable than D3 | ✅ **SELECTED** |
| Recharts | ✅ React-native<br>✅ Declarative API | ❌ Larger bundle (200KB+)<br>❌ SVG-based (slower for large datasets) | ❌ Too heavy |
| D3.js | ✅ Extremely powerful<br>✅ Full customization | ❌ Steep learning curve<br>❌ Large bundle<br>❌ Overkill for requirements | ❌ Too complex |
| Victory | ✅ React-native<br>✅ Good mobile support | ❌ Large bundle<br>❌ Less popular | ❌ Not needed |

### Decision: Chart.js 4.x

**Rationale**:
- Lightweight and performant for our use case (completion charts, pie charts, heatmaps)
- Simple API reduces implementation time (critical for 2-week timeline)
- Canvas-based rendering performs well with large datasets
- Excellent documentation and community support
- Supports all required chart types: line, bar, pie, doughnut

**Implementation Approach**:
```typescript
import { Chart } from 'chart.js/auto';

// Wrap in React component
const CompletionChart = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};
```

## Drag-and-Drop Library Selection

### Question
Which library for calendar drag-and-drop and Gantt chart interactions?

### Options Considered

| Library | Pros | Cons | Decision |
|---------|------|------|----------|
| **@dnd-kit/core** | ✅ Modern React hooks API<br>✅ Accessible (WCAG)<br>✅ Lightweight (20KB)<br>✅ Touch support<br>✅ Active maintenance | ⚠️ Newer library | ✅ **SELECTED** |
| react-dnd | ✅ Mature and stable<br>✅ Large community | ❌ Older API (HOCs)<br>❌ Larger bundle<br>❌ Less accessible | ❌ Outdated API |
| react-beautiful-dnd | ✅ Beautiful animations<br>✅ Good DX | ❌ No longer maintained<br>❌ Limited to lists | ❌ Unmaintained |
| Native HTML5 | ✅ No dependencies | ❌ Complex API<br>❌ Poor touch support<br>❌ Accessibility issues | ❌ Too low-level |

### Decision: @dnd-kit/core

**Rationale**:
- Modern hooks-based API fits well with our React architecture
- Built-in accessibility support (keyboard navigation, screen readers)
- Excellent touch support for mobile devices
- Lightweight and performant
- Active maintenance and good documentation
- Supports complex use cases (calendar, Gantt chart)

**Implementation Approach**:
```typescript
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const CalendarView = () => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      // Update task due date
      updateTaskDueDate(active.id, over.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* Calendar grid with droppable dates */}
      {/* Draggable task cards */}
    </DndContext>
  );
};
```

## PDF Generation Library Selection

### Question
Which library for generating analytics reports as PDFs?

### Options Considered

| Library | Pros | Cons | Decision |
|---------|------|------|----------|
| **jsPDF** | ✅ Client-side generation<br>✅ Simple API<br>✅ Small bundle (50KB)<br>✅ Good documentation | ⚠️ Limited layout control | ✅ **SELECTED** |
| pdfmake | ✅ Declarative API<br>✅ Good layout control | ❌ Larger bundle (200KB+)<br>❌ More complex | ❌ Overkill |
| react-pdf | ✅ React components | ❌ Server-side only<br>❌ Requires Node.js backend | ❌ Wrong use case |
| Puppeteer | ✅ Perfect rendering | ❌ Server-side only<br>❌ Heavy resource usage<br>❌ Requires headless browser | ❌ Too heavy |

### Decision: jsPDF

**Rationale**:
- Client-side generation (no server load)
- Simple API for basic reports (task lists, statistics)
- Small bundle size
- Can be enhanced with jsPDF-AutoTable for tabular data
- Sufficient for our report requirements

**Implementation Approach**:
```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateReport = (tasks, stats) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('TaskNest Analytics Report', 20, 20);

  // Add statistics
  doc.setFontSize(12);
  doc.text(`Total Tasks: ${stats.total}`, 20, 40);
  doc.text(`Completed: ${stats.completed}`, 20, 50);

  // Add task table
  doc.autoTable({
    head: [['Title', 'Priority', 'Status', 'Due Date']],
    body: tasks.map(t => [t.title, t.priority, t.status, t.due_date])
  });

  doc.save('report.pdf');
};
```

## Email Service Selection

### Question
Which service for sending team invitation emails?

### Options Considered

| Service | Pros | Cons | Decision |
|---------|------|------|----------|
| **Backend Email Service** | ✅ Full control<br>✅ No external dependencies<br>✅ Can use SMTP | ⚠️ Need email server config | ✅ **SELECTED** |
| SendGrid | ✅ Reliable delivery<br>✅ Analytics | ❌ External dependency<br>❌ Cost<br>❌ API keys | ❌ Not needed yet |
| AWS SES | ✅ Cheap<br>✅ Scalable | ❌ AWS account required<br>❌ Complex setup | ❌ Overkill |
| Mailgun | ✅ Good API<br>✅ Free tier | ❌ External dependency<br>❌ API keys | ❌ Not needed yet |

### Decision: Backend SMTP Email Service

**Rationale**:
- Simple SMTP configuration sufficient for team invitations
- No external API dependencies or costs
- Can be upgraded to SendGrid/SES later if needed
- Python's `smtplib` or `email` library sufficient
- Environment variables for SMTP configuration

**Implementation Approach**:
```python
# backend/src/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def send_team_invitation(self, to_email: str, team_name: str, invite_link: str):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Invitation to join {team_name} on TaskNest'
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email

        html = f"""
        <html>
          <body>
            <h2>You've been invited to join {team_name}</h2>
            <p>Click the link below to accept:</p>
            <a href="{invite_link}">Accept Invitation</a>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, 'html'))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
```

## Database Schema Approach

### Question
How to structure new database models for teams, projects, notifications?

### Decision: Normalized Relational Schema

**Rationale**:
- SQLModel/SQLAlchemy supports complex relationships
- Normalized schema prevents data duplication
- Foreign keys ensure referential integrity
- Indexes on frequently queried fields (user_id, team_id, project_id)
- JSONB for flexible data (recurrence_pattern, notification_preferences)

**Key Relationships**:
```
User (existing)
  ├─ 1:N → Tasks (existing, add project_id, assigned_to)
  ├─ 1:N → TeamMembers
  ├─ 1:N → Projects
  ├─ 1:N → Notifications
  └─ 1:1 → NotificationPreferences

Team
  ├─ 1:N → TeamMembers
  ├─ 1:N → TeamInvitations
  └─ 1:N → Comments (via tasks)

Project
  ├─ 1:N → Tasks
  ├─ 1:N → Milestones
  └─ 1:N → TaskDependencies

Task (existing, enhanced)
  ├─ N:M → Tags (existing)
  ├─ 1:N → Comments
  ├─ 1:N → TaskAssignments
  └─ N:M → TaskDependencies
```

## Authentication & Authorization

### Question
How to handle team-based permissions?

### Decision: Role-Based Access Control (RBAC)

**Roles**:
- **Admin**: Full team management, can invite/remove members, delete team
- **Member**: Can view team tasks, assign tasks, add comments
- **Viewer**: Read-only access to team tasks

**Implementation**:
```python
# Check team membership and role
def check_team_permission(user_id: UUID, team_id: UUID, required_role: str):
    member = db.query(TeamMember).filter(
        TeamMember.user_id == user_id,
        TeamMember.team_id == team_id
    ).first()

    if not member:
        raise HTTPException(403, "Not a team member")

    if required_role == "admin" and member.role != "admin":
        raise HTTPException(403, "Admin access required")

    return member
```

## Performance Optimization Strategies

### Analytics Queries
- **Problem**: Complex aggregation queries for analytics can be slow
- **Solution**:
  - Create `analytics_snapshots` table for daily statistics
  - Background job to calculate and cache statistics
  - Real-time queries only for current day
  - Use database indexes on date fields

### Task List Pagination
- **Problem**: Users with 1000+ tasks need efficient loading
- **Solution**:
  - Cursor-based pagination (more efficient than offset)
  - Load 50 tasks per page
  - Infinite scroll on frontend
  - Index on (user_id, created_at) for fast queries

### Notification Delivery
- **Problem**: Real-time notifications for all users
- **Solution**:
  - Polling-based approach (every 30 seconds)
  - WebSocket upgrade can be added later
  - Notification queue in database
  - Mark as delivered after client acknowledges

## Summary

All technology decisions prioritize:
1. **Consistency** with existing codebase (vanilla CSS, FastAPI, SQLModel)
2. **Performance** (lightweight libraries, efficient queries)
3. **Timeline** (simple APIs, good documentation, proven solutions)
4. **Maintainability** (active projects, clear patterns)

No unresolved clarifications remain. All decisions are documented with rationale and implementation approaches.
