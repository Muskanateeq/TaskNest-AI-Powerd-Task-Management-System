# Quick Start Guide

**Feature**: Dashboard Enhancement - Modern SaaS UI
**Date**: 2026-02-12
**Phase**: 1 - Design

## Overview

This guide provides a quick reference for implementing the dashboard enhancement. Follow the priority order (P1 → P2 → P3) for incremental delivery within the 2-week timeline.

## Implementation Priority

### Week 1: P1 Features (MVP)

**Days 1-2: Core Dashboard & Navigation**
- Rename `/tasks` route to `/dashboard`
- Update Sidebar component with all navigation items
- Create dashboard.css following landing.css patterns
- Implement enhanced statistics with progress bars
- Add Edit/Delete buttons to task cards

**Days 3-4: Search, Filter, Sort Integration**
- Connect search bar to backend API
- Integrate FilterPanel component
- Integrate SortDropdown component
- Add URL parameter persistence
- Implement debouncing for search

**Days 5-7: Basic Team & Calendar**
- Backend: Team models, API endpoints
- Frontend: Team creation, member list
- Backend: Calendar API (tasks by date range)
- Frontend: Basic calendar month view
- CSS: teams.css, calendar.css

### Week 2: P2 Features (Enhanced)

**Days 8-9: Settings & Projects**
- Backend: Settings API, Projects models
- Frontend: Profile, Preferences, Account tabs
- Frontend: Project list, project detail
- CSS: settings.css, projects.css

**Days 10-11: Analytics & Notifications**
- Backend: Analytics API, Notifications
- Frontend: Charts (Chart.js integration)
- Frontend: Notification bell, dropdown
- CSS: analytics.css, notifications.css

**Days 12-14: Polish & Testing**
- Drag-and-drop for calendar
- Task detail modal
- Animations and transitions
- Bug fixes and testing
- Documentation

## CSS Implementation Pattern

### Step 1: Create CSS File

Create `frontend/TaskNest/src/app/dashboard.css`:

```css
/* Import existing variables */
@import './landing.css';

/* Dashboard-specific styles */
.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: rgba(10, 10, 10, 0.5);
    border: 1px solid rgba(228, 155, 15, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: 0 20px 40px rgba(228, 155, 15, 0.2);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    transition: width 0.5s ease;
    animation: progressSlide 0.5s ease-out;
}

@keyframes progressSlide {
    from {
        width: 0;
    }
}

.task-card {
    background: rgba(10, 10, 10, 0.5);
    border: 1px solid rgba(228, 155, 15, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    position: relative;
}

.task-card:hover {
    border-color: var(--primary);
    box-shadow: 0 10px 20px rgba(228, 155, 15, 0.15);
}

.task-card:hover .task-actions {
    opacity: 1;
}

.task-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
    .task-actions {
        opacity: 1; /* Always visible on mobile */
    }
}
```

### Step 2: Import in Page Component

```typescript
// frontend/TaskNest/src/app/(app)/dashboard/page.tsx
import '../../dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Dashboard content */}
    </div>
  );
}
```

## Backend Implementation Pattern

### Step 1: Create Model

```python
# backend/src/models/team.py
from sqlmodel import Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime

class Team(SQLModel, table=True):
    __tablename__ = "teams"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=255)
    description: str | None = None
    creator_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Step 2: Create Schema

```python
# backend/src/schemas/team.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class TeamCreate(BaseModel):
    name: str
    description: str | None = None

class TeamResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    creator_id: UUID
    created_at: datetime
    updated_at: datetime
```

### Step 3: Create Service

```python
# backend/src/services/team_service.py
from uuid import UUID
from sqlmodel import select
from backend.src.models.team import Team
from backend.src.schemas.team import TeamCreate

class TeamService:
    def __init__(self, db):
        self.db = db

    async def create_team(self, user_id: UUID, data: TeamCreate) -> Team:
        team = Team(
            name=data.name,
            description=data.description,
            creator_id=user_id
        )
        self.db.add(team)
        await self.db.commit()
        await self.db.refresh(team)
        return team

    async def get_user_teams(self, user_id: UUID) -> list[Team]:
        query = select(Team).where(Team.creator_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().all()
```

### Step 4: Create API Endpoint

```python
# backend/src/api/teams.py
from fastapi import APIRouter, Depends
from uuid import UUID
from backend.src.api.deps import get_current_user_id, get_db
from backend.src.services.team_service import TeamService
from backend.src.schemas.team import TeamCreate, TeamResponse

router = APIRouter(prefix="/teams", tags=["teams"])

@router.post("/", response_model=TeamResponse, status_code=201)
async def create_team(
    data: TeamCreate,
    user_id: UUID = Depends(get_current_user_id),
    db = Depends(get_db)
):
    service = TeamService(db)
    team = await service.create_team(user_id, data)
    return team

@router.get("/", response_model=list[TeamResponse])
async def list_teams(
    user_id: UUID = Depends(get_current_user_id),
    db = Depends(get_db)
):
    service = TeamService(db)
    teams = await service.get_user_teams(user_id)
    return teams
```

### Step 5: Register Router

```python
# backend/src/main.py
from backend.src.api import teams

app.include_router(teams.router, prefix="/api/v1")
```

## Frontend Implementation Pattern

### Step 1: Create API Client

```typescript
// frontend/TaskNest/src/lib/teams-api.ts
import { apiClient } from './api';

export interface Team {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export const teamsApi = {
  async list(): Promise<Team[]> {
    return apiClient.get('/teams');
  },

  async create(data: { name: string; description?: string }): Promise<Team> {
    return apiClient.post('/teams', data);
  },

  async get(teamId: string): Promise<Team> {
    return apiClient.get(`/teams/${teamId}`);
  }
};
```

### Step 2: Create Hook

```typescript
// frontend/TaskNest/src/hooks/useTeams.ts
import { useState, useEffect } from 'react';
import { teamsApi, Team } from '@/lib/teams-api';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsApi.list();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (data: { name: string; description?: string }) => {
    const team = await teamsApi.create(data);
    setTeams([...teams, team]);
    return team;
  };

  return { teams, loading, error, createTeam, refresh: loadTeams };
}
```

### Step 3: Create Component

```typescript
// frontend/TaskNest/src/components/teams/TeamList.tsx
'use client';

import { useTeams } from '@/hooks/useTeams';

export default function TeamList() {
  const { teams, loading, error } = useTeams();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="teams-grid">
      {teams.map(team => (
        <div key={team.id} className="team-card">
          <h3>{team.name}</h3>
          <p>{team.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Create Page

```typescript
// frontend/TaskNest/src/app/(app)/team/page.tsx
import TeamList from '@/components/teams/TeamList';
import '../../teams.css';

export default function TeamPage() {
  return (
    <div className="team-container">
      <h1>Teams</h1>
      <TeamList />
    </div>
  );
}
```

## Database Migration

```bash
# Create migration
cd backend
alembic revision --autogenerate -m "Add dashboard enhancement models"

# Review migration file
# backend/alembic/versions/xxx_add_dashboard_enhancement_models.py

# Apply migration
alembic upgrade head
```

## Testing Checklist

### Backend Tests
- [ ] Team CRUD operations
- [ ] User ownership validation
- [ ] Project CRUD operations
- [ ] Notification creation and delivery
- [ ] Analytics calculations
- [ ] Email service (team invitations)

### Frontend Tests
- [ ] Dashboard page renders
- [ ] Statistics display correctly
- [ ] Search functionality works
- [ ] Filter and sort work
- [ ] Team creation works
- [ ] Calendar displays tasks
- [ ] Settings update works
- [ ] Notifications display

### E2E Tests
- [ ] Complete user flow: create team → invite member → assign task
- [ ] Complete user flow: create project → add tasks → view Gantt chart
- [ ] Complete user flow: view analytics → generate report → download PDF

## Common Issues & Solutions

### Issue: CSS not loading
**Solution**: Ensure CSS file is imported in the page component, not in a client component

### Issue: API 401 Unauthorized
**Solution**: Check JWT token is being sent in Authorization header

### Issue: Database foreign key error
**Solution**: Ensure parent records exist before creating child records

### Issue: Animations not smooth
**Solution**: Use CSS transitions instead of JavaScript animations, ensure 60fps

### Issue: Search too slow
**Solution**: Implement debouncing (300ms delay) before API call

## Next Steps

After completing planning phase:

1. Run `/sp.tasks` to generate actionable task breakdown
2. Begin implementation following priority order (P1 → P2 → P3)
3. Test each feature as it's completed
4. Create git commits following spec-driven workflow
5. Deploy to staging for testing

## Resources

- **Spec**: `specs/001-dashboard-enhancement/spec.md`
- **Plan**: `specs/001-dashboard-enhancement/plan.md`
- **Data Model**: `specs/001-dashboard-enhancement/data-model.md`
- **API Contracts**: `specs/001-dashboard-enhancement/contracts/`
- **Research**: `specs/001-dashboard-enhancement/research.md`
