# Data Model: TaskNest Phase 2

**Feature**: Phase 2 TaskNest Full-Stack Web Application
**Date**: 2026-02-02
**Database**: PostgreSQL 15+ (Neon Serverless)
**ORM**: SQLModel 0.0.14+

## Overview

This document defines the complete database schema for TaskNest Phase 2, including all entities, relationships, constraints, and indexes. The schema supports all Basic, Intermediate, and Advanced task management features as a unified system.

## Design Principles

1. **User Data Isolation**: Every entity (except User) has user_id foreign key
2. **Referential Integrity**: All foreign keys with CASCADE/RESTRICT as appropriate
3. **Performance**: Indexes on frequently queried fields
4. **Validation**: Database-level constraints for data integrity
5. **Timestamps**: All entities track creation and modification times
6. **Type Safety**: SQLModel provides Pydantic validation + SQL schema

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
│  (Better Auth)  │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────▼────────────────┐
    │                     │
    │                     │
┌───▼────┐           ┌───▼────┐
│  Task  │           │  Tag   │
└───┬────┘           └───┬────┘
    │                    │
    │         N:M        │
    └────────┬───────────┘
             │
        ┌────▼────────┐
        │  TaskTag    │
        │ (Junction)  │
        └─────────────┘
```

## Entities

### 1. User

**Purpose**: Stores user account information for authentication and authorization.

**Managed By**: Better Auth (frontend authentication library)

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique user identifier (UUID from Better Auth) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| name | VARCHAR(255) | NULL | User display name (optional) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Notes**:
- Better Auth manages this table structure
- Backend only reads from this table (no writes except via Better Auth)
- Password is never stored in plain text

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

### 2. Task

**Purpose**: Core entity storing all task information including Basic, Intermediate, and Advanced features.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique task identifier |
| user_id | VARCHAR(255) | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner of the task |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 characters) |
| description | TEXT | NULL | Task description (max 1000 characters) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| priority | VARCHAR(10) | NOT NULL, DEFAULT 'medium', CHECK IN ('high', 'medium', 'low') | Task priority level |
| due_date | DATE | NULL | Due date (without time) |
| due_time | TIME | NULL | Due time (optional, requires due_date) |
| recurrence_pattern | JSONB | NULL | Recurrence configuration (see below) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp (UTC) |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for filtering by owner)
- INDEX on `completed` (for status filtering)
- INDEX on `priority` (for priority filtering)
- INDEX on `due_date` (for date filtering and sorting)
- INDEX on `created_at` (for default sorting)
- COMPOSITE INDEX on `(user_id, completed)` (common query pattern)
- COMPOSITE INDEX on `(user_id, due_date)` (due date queries)

**Foreign Keys**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Check Constraints**:
- `priority IN ('high', 'medium', 'low')`
- `title` length between 1 and 200 characters
- `description` length max 1000 characters (enforced at application level)
- If `due_time` is set, `due_date` must also be set

**Recurrence Pattern JSON Schema**:
```json
{
  "type": "daily" | "weekly" | "monthly",
  "interval": 1,  // Every N days/weeks/months
  "days_of_week": [1, 3, 5],  // For weekly: 1=Monday, 7=Sunday
  "day_of_month": 15  // For monthly: 1-31
}
```

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from datetime import datetime, date, time
from typing import Optional
from enum import Enum

class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM, index=True)
    due_date: Optional[date] = Field(default=None, index=True)
    due_time: Optional[time] = Field(default=None)
    recurrence_pattern: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Business Rules**:
1. All queries MUST filter by `user_id` (ownership enforcement)
2. When `completed=True` and `recurrence_pattern` exists, generate next occurrence
3. `due_time` requires `due_date` to be set
4. Timestamps stored in UTC, displayed in user's local time zone
5. Soft delete not implemented (hard delete only)

---

### 3. Tag

**Purpose**: User-specific tags for task categorization and organization.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique tag identifier |
| user_id | VARCHAR(255) | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner of the tag |
| name | VARCHAR(50) | NOT NULL | Tag name (e.g., "Work", "Home") |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for filtering by owner)
- UNIQUE INDEX on `(user_id, name)` (prevent duplicate tag names per user)

**Foreign Keys**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Check Constraints**:
- `name` length between 1 and 50 characters
- `name` cannot be empty or whitespace only

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Tag(SQLModel, table=True):
    __tablename__ = "tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=255)
    name: str = Field(min_length=1, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # Ensure unique tag names per user
        table_args = (
            UniqueConstraint('user_id', 'name', name='uq_user_tag_name'),
        )
```

**Business Rules**:
1. Tag names are case-sensitive (user can have "Work" and "work" as different tags)
2. Each user has their own tag namespace (no global tags)
3. Predefined tags (Work, Home, Personal, Shopping, Health, Finance) created on user signup
4. Users can create unlimited custom tags
5. Deleting a tag removes all task-tag associations

---

### 4. TaskTag (Junction Table)

**Purpose**: Many-to-many relationship between tasks and tags.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| task_id | INTEGER | FOREIGN KEY (tasks.id), NOT NULL | Reference to task |
| tag_id | INTEGER | FOREIGN KEY (tags.id), NOT NULL | Reference to tag |

**Indexes**:
- PRIMARY KEY on `(task_id, tag_id)` (composite)
- INDEX on `task_id` (for finding tags of a task)
- INDEX on `tag_id` (for finding tasks with a tag)

**Foreign Keys**:
- `task_id` REFERENCES `tasks(id)` ON DELETE CASCADE
- `tag_id` REFERENCES `tags(id)` ON DELETE CASCADE

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field

class TaskTag(SQLModel, table=True):
    __tablename__ = "task_tags"

    task_id: int = Field(foreign_key="tasks.id", primary_key=True)
    tag_id: int = Field(foreign_key="tags.id", primary_key=True)
```

**Business Rules**:
1. A task can have multiple tags (0 to N)
2. A tag can be applied to multiple tasks
3. Duplicate associations prevented by composite primary key
4. Deleting a task removes all its tag associations (CASCADE)
5. Deleting a tag removes all task associations (CASCADE)

---

## Database Migrations

**Migration Tool**: Alembic

**Initial Migration** (001_initial_schema.py):
```python
"""Initial schema

Revision ID: 001
Create Date: 2026-02-02
"""

def upgrade():
    # Create users table (managed by Better Auth)
    op.create_table(
        'users',
        sa.Column('id', sa.String(255), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP, server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.String(255), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('completed', sa.Boolean, default=False, nullable=False),
        sa.Column('priority', sa.String(10), default='medium', nullable=False),
        sa.Column('due_date', sa.Date, nullable=True),
        sa.Column('due_time', sa.Time, nullable=True),
        sa.Column('recurrence_pattern', sa.JSON, nullable=True),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP, server_default=sa.func.now()),
        sa.CheckConstraint("priority IN ('high', 'medium', 'low')", name='ck_task_priority'),
        sa.CheckConstraint("length(title) >= 1 AND length(title) <= 200", name='ck_task_title_length'),
    )
    op.create_index('ix_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('ix_tasks_completed', 'tasks', ['completed'])
    op.create_index('ix_tasks_priority', 'tasks', ['priority'])
    op.create_index('ix_tasks_due_date', 'tasks', ['due_date'])
    op.create_index('ix_tasks_created_at', 'tasks', ['created_at'])
    op.create_index('ix_tasks_user_completed', 'tasks', ['user_id', 'completed'])
    op.create_index('ix_tasks_user_due_date', 'tasks', ['user_id', 'due_date'])

    # Create tags table
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.String(255), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),
        sa.UniqueConstraint('user_id', 'name', name='uq_user_tag_name'),
    )
    op.create_index('ix_tags_user_id', 'tags', ['user_id'])

    # Create task_tags junction table
    op.create_table(
        'task_tags',
        sa.Column('task_id', sa.Integer, sa.ForeignKey('tasks.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('tag_id', sa.Integer, sa.ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
    )
    op.create_index('ix_task_tags_task_id', 'task_tags', ['task_id'])
    op.create_index('ix_task_tags_tag_id', 'task_tags', ['tag_id'])

def downgrade():
    op.drop_table('task_tags')
    op.drop_table('tags')
    op.drop_table('tasks')
    op.drop_table('users')
```

---

## Query Patterns

### Common Queries with Ownership Enforcement

**1. Get all tasks for a user (with filters)**
```sql
SELECT * FROM tasks
WHERE user_id = :user_id
  AND completed = :completed  -- Optional filter
  AND priority = :priority    -- Optional filter
  AND due_date >= :start_date -- Optional filter
ORDER BY created_at DESC;
```

**2. Search tasks by keyword**
```sql
SELECT * FROM tasks
WHERE user_id = :user_id
  AND (title ILIKE :keyword OR description ILIKE :keyword)
ORDER BY created_at DESC;
```

**3. Get tasks with specific tags**
```sql
SELECT t.* FROM tasks t
JOIN task_tags tt ON t.id = tt.task_id
JOIN tags tg ON tt.tag_id = tg.id
WHERE t.user_id = :user_id
  AND tg.name IN (:tag_names)
GROUP BY t.id
HAVING COUNT(DISTINCT tg.id) = :tag_count  -- For AND logic
ORDER BY t.created_at DESC;
```

**4. Get overdue tasks**
```sql
SELECT * FROM tasks
WHERE user_id = :user_id
  AND completed = FALSE
  AND due_date < CURRENT_DATE
ORDER BY due_date ASC;
```

**5. Get tasks due today**
```sql
SELECT * FROM tasks
WHERE user_id = :user_id
  AND completed = FALSE
  AND due_date = CURRENT_DATE
ORDER BY due_time ASC NULLS LAST;
```

---

## Performance Considerations

### Index Strategy

1. **Single-column indexes**: user_id, completed, priority, due_date, created_at
2. **Composite indexes**: (user_id, completed), (user_id, due_date)
3. **Unique indexes**: email, (user_id, name) for tags

### Query Optimization

1. Always filter by `user_id` first (uses index)
2. Use composite indexes for common filter combinations
3. Limit result sets with pagination (LIMIT/OFFSET)
4. Use EXPLAIN ANALYZE to verify query plans

### Expected Performance

- Task list retrieval: < 50ms for 1000 tasks
- Search query: < 100ms for 1000 tasks
- Filter query: < 50ms with proper indexes
- Tag filtering: < 100ms with joins

---

## Data Validation

### Application-Level Validation (Pydantic)

```python
from pydantic import BaseModel, Field, validator
from datetime import date, time
from typing import Optional

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    recurrence_pattern: Optional[dict] = None

    @validator('due_time')
    def validate_due_time(cls, v, values):
        if v is not None and values.get('due_date') is None:
            raise ValueError('due_time requires due_date to be set')
        return v

    @validator('recurrence_pattern')
    def validate_recurrence(cls, v):
        if v is not None:
            required_fields = ['type', 'interval']
            if not all(field in v for field in required_fields):
                raise ValueError('recurrence_pattern must include type and interval')
            if v['type'] not in ['daily', 'weekly', 'monthly']:
                raise ValueError('Invalid recurrence type')
        return v
```

---

## Security Considerations

1. **User Isolation**: All queries MUST include `WHERE user_id = :authenticated_user_id`
2. **SQL Injection**: Use parameterized queries (SQLModel handles this)
3. **Password Storage**: Never store plain text passwords (Better Auth handles hashing)
4. **Cascade Deletes**: User deletion cascades to all tasks, tags, and associations
5. **Input Validation**: Validate at both application and database levels

---

## Future Schema Evolution

### Phase 3 Additions (Planned)
- `notifications` table for email/SMS reminders
- `task_history` table for audit trail
- `shared_tasks` table for task sharing between users

### Phase 4 Additions (Planned)
- `subtasks` table for task hierarchies
- `attachments` table for file uploads
- `comments` table for task discussions

---

**Data Model Version**: 1.0
**Status**: Ready for Implementation
**Next Step**: Generate API contracts (OpenAPI specification)
