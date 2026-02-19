# Data Model

**Feature**: Dashboard Enhancement - Modern SaaS UI
**Date**: 2026-02-12
**Phase**: 1 - Design

## Overview

This document defines the database schema for all new entities required for the dashboard enhancement. All models use SQLModel (SQLAlchemy + Pydantic) with async PostgreSQL via asyncpg.

## Existing Models (Enhanced)

### Task (Enhanced)

**Changes**: Add project_id and assigned_to fields

```python
from sqlmodel import Field, SQLModel, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    # Existing fields
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = None
    completed: bool = Field(default=False, index=True)
    priority: str = Field(default="medium", index=True)  # high, medium, low
    due_date: Optional[datetime] = Field(default=None, index=True)
    due_time: Optional[str] = None
    recurrence_pattern: Optional[dict] = Field(default=None, sa_column_kwargs={"type_": "JSONB"})
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # NEW fields
    project_id: Optional[UUID] = Field(default=None, foreign_key="projects.id", index=True)
    assigned_to: Optional[UUID] = Field(default=None, foreign_key="users.id", index=True)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    tags: list["Tag"] = Relationship(back_populates="tasks", link_model="TaskTag")
    project: Optional["Project"] = Relationship(back_populates="tasks")
    assignee: Optional["User"] = Relationship()
    comments: list["Comment"] = Relationship(back_populates="task")
    assignments: list["TaskAssignment"] = Relationship(back_populates="task")
    dependencies_as_predecessor: list["TaskDependency"] = Relationship(back_populates="predecessor_task")
    dependencies_as_successor: list["TaskDependency"] = Relationship(back_populates="successor_task")
```

**Indexes**:
- `user_id` (existing)
- `completed` (existing)
- `priority` (existing)
- `due_date` (existing)
- `created_at` (existing)
- `project_id` (new)
- `assigned_to` (new)

## New Models - Team Collaboration

### Team

```python
class Team(SQLModel, table=True):
    __tablename__ = "teams"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=255)
    description: Optional[str] = None
    creator_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    creator: "User" = Relationship()
    members: list["TeamMember"] = Relationship(back_populates="team")
    invitations: list["TeamInvitation"] = Relationship(back_populates="team")
```

**Indexes**:
- `creator_id`

### TeamMember

```python
class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    team_id: UUID = Field(foreign_key="teams.id", index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    role: str = Field(default="member")  # admin, member, viewer
    joined_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    team: "Team" = Relationship(back_populates="members")
    user: "User" = Relationship()

    # Unique constraint: user can only be in team once
    __table_args__ = (
        UniqueConstraint("team_id", "user_id", name="unique_team_member"),
    )
```

**Indexes**:
- `team_id`
- `user_id`
- Unique constraint on (team_id, user_id)

### TeamInvitation

```python
class TeamInvitation(SQLModel, table=True):
    __tablename__ = "team_invitations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    team_id: UUID = Field(foreign_key="teams.id", index=True)
    email: str = Field(max_length=255, index=True)
    inviter_id: UUID = Field(foreign_key="users.id")
    status: str = Field(default="pending")  # pending, accepted, declined, expired
    token: str = Field(unique=True, index=True)  # Unique invitation token
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    team: "Team" = Relationship(back_populates="invitations")
    inviter: "User" = Relationship()
```

**Indexes**:
- `team_id`
- `email`
- `token` (unique)

### Comment

```python
class Comment(SQLModel, table=True):
    __tablename__ = "comments"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: UUID = Field(foreign_key="tasks.id", index=True)
    author_id: UUID = Field(foreign_key="users.id", index=True)
    content: str
    mentions: Optional[list[UUID]] = Field(default=None, sa_column_kwargs={"type_": "JSONB"})
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="comments")
    author: "User" = Relationship()
```

**Indexes**:
- `task_id`
- `author_id`
- `created_at`

### TaskAssignment

```python
class TaskAssignment(SQLModel, table=True):
    __tablename__ = "task_assignments"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: UUID = Field(foreign_key="tasks.id", index=True)
    assignee_id: UUID = Field(foreign_key="users.id", index=True)
    assigner_id: UUID = Field(foreign_key="users.id")
    assigned_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="assignments")
    assignee: "User" = Relationship()
    assigner: "User" = Relationship()
```

**Indexes**:
- `task_id`
- `assignee_id`

## New Models - Project Management

### Project

```python
class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    name: str = Field(max_length=255)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = Field(default="active", index=True)  # active, completed, archived
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship()
    tasks: list["Task"] = Relationship(back_populates="project")
    milestones: list["Milestone"] = Relationship(back_populates="project")
```

**Indexes**:
- `user_id`
- `status`

### Milestone

```python
class Milestone(SQLModel, table=True):
    __tablename__ = "milestones"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(foreign_key="projects.id", index=True)
    name: str = Field(max_length=255)
    description: Optional[str] = None
    date: datetime
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    project: "Project" = Relationship(back_populates="milestones")
```

**Indexes**:
- `project_id`

### TaskDependency

```python
class TaskDependency(SQLModel, table=True):
    __tablename__ = "task_dependencies"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    predecessor_task_id: UUID = Field(foreign_key="tasks.id", index=True)
    successor_task_id: UUID = Field(foreign_key="tasks.id", index=True)
    dependency_type: str = Field(default="finish_to_start")  # finish_to_start
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    predecessor_task: "Task" = Relationship(back_populates="dependencies_as_predecessor")
    successor_task: "Task" = Relationship(back_populates="dependencies_as_successor")

    # Unique constraint: prevent duplicate dependencies
    __table_args__ = (
        UniqueConstraint("predecessor_task_id", "successor_task_id", name="unique_dependency"),
        CheckConstraint("predecessor_task_id != successor_task_id", name="no_self_dependency"),
    )
```

**Indexes**:
- `predecessor_task_id`
- `successor_task_id`
- Unique constraint on (predecessor_task_id, successor_task_id)
- Check constraint: no self-dependencies

## New Models - Notifications

### Notification

```python
class Notification(SQLModel, table=True):
    __tablename__ = "notifications"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    type: str = Field(index=True)  # task_update, mention, assignment, reminder
    content: str
    related_item_type: Optional[str] = None  # task, comment, project
    related_item_id: Optional[UUID] = None
    read: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    # Relationships
    user: "User" = Relationship()
```

**Indexes**:
- `user_id`
- `type`
- `read`
- `created_at`
- Composite index on (user_id, read, created_at) for efficient queries

### NotificationPreference

```python
class NotificationPreference(SQLModel, table=True):
    __tablename__ = "notification_preferences"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, index=True)
    enabled_types: dict = Field(sa_column_kwargs={"type_": "JSONB"})  # {task_update: true, mention: true, ...}
    enabled_channels: dict = Field(sa_column_kwargs={"type_": "JSONB"})  # {in_app: true, browser: true, email: false}
    dnd_start_hour: Optional[int] = None  # 0-23
    dnd_end_hour: Optional[int] = None  # 0-23
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship()
```

**Indexes**:
- `user_id` (unique)

## New Models - Analytics

### AnalyticsSnapshot

```python
class AnalyticsSnapshot(SQLModel, table=True):
    __tablename__ = "analytics_snapshots"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    date: datetime = Field(index=True)
    tasks_created: int = Field(default=0)
    tasks_completed: int = Field(default=0)
    average_completion_time_hours: Optional[float] = None
    priority_distribution: dict = Field(sa_column_kwargs={"type_": "JSONB"})  # {high: 5, medium: 10, low: 3}
    tag_distribution: dict = Field(sa_column_kwargs={"type_": "JSONB"})  # {work: 8, personal: 5}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship()

    # Unique constraint: one snapshot per user per day
    __table_args__ = (
        UniqueConstraint("user_id", "date", name="unique_user_date_snapshot"),
    )
```

**Indexes**:
- `user_id`
- `date`
- Unique constraint on (user_id, date)

### CustomReport

```python
class CustomReport(SQLModel, table=True):
    __tablename__ = "custom_reports"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    name: str = Field(max_length=255)
    metrics: list[str] = Field(sa_column_kwargs={"type_": "JSONB"})  # ["completion_rate", "priority_distribution"]
    date_range_start: datetime
    date_range_end: datetime
    shareable_token: Optional[str] = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship()
```

**Indexes**:
- `user_id`
- `shareable_token` (unique)

## Migration Strategy

### Phase 1: Add New Tables
```sql
-- Create all new tables in order of dependencies
CREATE TABLE teams (...);
CREATE TABLE team_members (...);
CREATE TABLE team_invitations (...);
CREATE TABLE projects (...);
CREATE TABLE milestones (...);
CREATE TABLE comments (...);
CREATE TABLE task_assignments (...);
CREATE TABLE task_dependencies (...);
CREATE TABLE notifications (...);
CREATE TABLE notification_preferences (...);
CREATE TABLE analytics_snapshots (...);
CREATE TABLE custom_reports (...);
```

### Phase 2: Alter Existing Tables
```sql
-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects(id);
ALTER TABLE tasks ADD COLUMN assigned_to UUID REFERENCES users(id);

-- Create indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
```

### Phase 3: Create Composite Indexes
```sql
-- Composite index for efficient notification queries
CREATE INDEX idx_notifications_user_read_created
ON notifications(user_id, read, created_at DESC);

-- Composite index for task queries with project filter
CREATE INDEX idx_tasks_user_project_created
ON tasks(user_id, project_id, created_at DESC);
```

## Data Integrity Rules

1. **User Ownership**: All entities must have user_id or be related to user via foreign key
2. **Cascade Deletes**:
   - Delete team → cascade delete team_members, team_invitations
   - Delete project → cascade delete milestones, set tasks.project_id to NULL
   - Delete task → cascade delete comments, task_assignments, task_dependencies
   - Delete user → handle carefully (may want to reassign or archive)
3. **Circular Dependency Prevention**: Check constraint on task_dependencies prevents self-references
4. **Unique Constraints**:
   - TeamMember: (team_id, user_id)
   - TaskDependency: (predecessor_task_id, successor_task_id)
   - AnalyticsSnapshot: (user_id, date)
   - NotificationPreference: user_id

## Performance Considerations

1. **Indexes on Foreign Keys**: All foreign key columns have indexes
2. **Indexes on Query Filters**: Indexes on commonly filtered fields (status, priority, read, type)
3. **Composite Indexes**: For common query patterns (user_id + read + created_at)
4. **JSONB Fields**: Use JSONB for flexible data (recurrence_pattern, preferences) with GIN indexes if needed
5. **Pagination**: Use cursor-based pagination with indexed created_at fields

## Summary

- **13 new models** added
- **2 existing models** enhanced (Task)
- **25+ indexes** for query performance
- **5 unique constraints** for data integrity
- **2 check constraints** for business rules
- All models follow SQLModel patterns with proper relationships
