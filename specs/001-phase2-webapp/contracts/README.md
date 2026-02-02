# TaskNest API Documentation

**Version**: 1.0.0
**Base URL**: `http://localhost:8000/api/v1` (development)

## Overview

TaskNest API provides a complete RESTful interface for managing tasks with authentication, priorities, tags, search, filtering, and recurring tasks. All endpoints return JSON and require JWT authentication (except auth endpoints).

## Quick Links

- [OpenAPI Specification](./openapi.yaml) - Complete API contract
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Authentication

### JWT Token Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800,
  "user": {
    "id": "user-uuid-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Token Expiration

- Tokens expire after 7 days
- Use `/auth/refresh` to get a new token before expiration
- Expired tokens return `401 Unauthorized`

## Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh` | Refresh JWT token | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | List all tasks (with filters) | Yes |
| POST | `/tasks` | Create new task | Yes |
| GET | `/tasks/{id}` | Get task by ID | Yes |
| PUT | `/tasks/{id}` | Update task | Yes |
| DELETE | `/tasks/{id}` | Delete task | Yes |
| PATCH | `/tasks/{id}/complete` | Toggle completion | Yes |

### Tags

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tags` | List all tags | Yes |
| POST | `/tags` | Create new tag | Yes |
| DELETE | `/tags/{id}` | Delete tag | Yes |

## Examples

### Create a Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "high",
    "due_date": "2026-02-05",
    "due_time": "15:00:00",
    "tag_ids": [1, 2]
  }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": "user-uuid-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "priority": "high",
  "due_date": "2026-02-05",
  "due_time": "15:00:00",
  "recurrence_pattern": null,
  "tags": [
    {"id": 1, "name": "Work"},
    {"id": 2, "name": "Urgent"}
  ],
  "created_at": "2026-02-02T10:30:00Z",
  "updated_at": "2026-02-02T10:30:00Z"
}
```

### List Tasks with Filters

```bash
# Get all high priority pending tasks
curl -X GET "http://localhost:8000/api/v1/tasks?priority=high&completed=pending" \
  -H "Authorization: Bearer <token>"

# Search for tasks containing "grocery"
curl -X GET "http://localhost:8000/api/v1/tasks?search=grocery" \
  -H "Authorization: Bearer <token>"

# Get tasks with specific tags
curl -X GET "http://localhost:8000/api/v1/tasks?tags=Work,Urgent" \
  -H "Authorization: Bearer <token>"

# Get overdue tasks
curl -X GET "http://localhost:8000/api/v1/tasks?due_date_filter=overdue" \
  -H "Authorization: Bearer <token>"

# Sort by due date (ascending)
curl -X GET "http://localhost:8000/api/v1/tasks?sort_by=due_date&sort_order=asc" \
  -H "Authorization: Bearer <token>"
```

### Create a Recurring Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly team meeting",
    "description": "Every Monday at 10 AM",
    "priority": "medium",
    "due_date": "2026-02-03",
    "due_time": "10:00:00",
    "recurrence_pattern": {
      "type": "weekly",
      "interval": 1,
      "days_of_week": [1]
    },
    "tag_ids": [1]
  }'
```

### Mark Task as Complete (Recurring)

```bash
curl -X PATCH http://localhost:8000/api/v1/tasks/1/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Response (with next occurrence):**
```json
{
  "task": {
    "id": 1,
    "title": "Weekly team meeting",
    "completed": true,
    ...
  },
  "next_occurrence": {
    "id": 2,
    "title": "Weekly team meeting",
    "completed": false,
    "due_date": "2026-02-10",
    "due_time": "10:00:00",
    ...
  }
}
```

### Update a Task

```bash
curl -X PUT http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and fruits",
    "priority": "medium",
    "tag_ids": [1, 2, 3]
  }'
```

### Delete a Task

```bash
curl -X DELETE http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer <token>"
```

### Create a Tag

```bash
curl -X POST http://localhost:8000/api/v1/tags \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Personal"}'
```

### List All Tags

```bash
curl -X GET http://localhost:8000/api/v1/tags \
  -H "Authorization: Bearer <token>"
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or business logic error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "error": "Error type",
  "detail": "Detailed error message"
}
```

### Validation Error Format

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Common Errors

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "detail": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "detail": "Task not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Bad Request",
  "detail": "due_time requires due_date to be set"
}
```

## Query Parameters

### Task List Filters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `completed` | string | `all`, `pending`, `completed` | Filter by completion status |
| `priority` | string | `all`, `high`, `medium`, `low` | Filter by priority |
| `tags` | string | Comma-separated tag names | Filter by tags (AND logic) |
| `due_date_filter` | string | `all`, `overdue`, `today`, `this_week`, `this_month`, `no_due_date` | Filter by due date |
| `search` | string | Any text | Search in title and description |
| `sort_by` | string | `created_at`, `due_date`, `priority`, `title` | Sort field |
| `sort_order` | string | `asc`, `desc` | Sort direction |
| `limit` | integer | 1-1000 | Max results (default: 100) |
| `offset` | integer | 0+ | Skip results (pagination) |

### Combining Filters

Filters use AND logic. Example:
```
/tasks?priority=high&completed=pending&tags=Work&sort_by=due_date
```
Returns: High priority, pending tasks with "Work" tag, sorted by due date

## Data Models

### Task Object

```typescript
{
  id: number;
  user_id: string;
  title: string;              // 1-200 characters
  description: string | null; // max 1000 characters
  completed: boolean;
  priority: "high" | "medium" | "low";
  due_date: string | null;    // ISO date: "2026-02-05"
  due_time: string | null;    // ISO time: "15:00:00"
  recurrence_pattern: RecurrencePattern | null;
  tags: Tag[];
  created_at: string;         // ISO datetime
  updated_at: string;         // ISO datetime
}
```

### Recurrence Pattern

```typescript
{
  type: "daily" | "weekly" | "monthly";
  interval: number;           // Every N days/weeks/months
  days_of_week?: number[];    // For weekly: [1-7] (1=Monday)
  day_of_month?: number;      // For monthly: 1-31
}
```

### Tag Object

```typescript
{
  id: number;
  user_id: string;
  name: string;               // 1-50 characters
  created_at: string;         // ISO datetime
}
```

## Rate Limiting

Currently no rate limiting is implemented. Future versions may include:
- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination

Use `limit` and `offset` parameters for pagination:

```bash
# Page 1 (first 20 tasks)
GET /tasks?limit=20&offset=0

# Page 2 (next 20 tasks)
GET /tasks?limit=20&offset=20

# Page 3 (next 20 tasks)
GET /tasks?limit=20&offset=40
```

Response includes total count:
```json
{
  "tasks": [...],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

## Best Practices

1. **Always include Authorization header** (except auth endpoints)
2. **Handle token expiration** - Refresh before 7 days
3. **Use pagination** for large result sets
4. **Validate input** on client side before API calls
5. **Handle errors gracefully** - Show user-friendly messages
6. **Cache tags** - They don't change frequently
7. **Debounce search** - Wait for user to stop typing
8. **Use optimistic updates** - Update UI before API response

## Testing

Use the OpenAPI specification with tools like:
- **Swagger UI**: Interactive API documentation
- **Postman**: Import OpenAPI spec for testing
- **curl**: Command-line testing (examples above)

## Support

For API issues or questions:
- Email: support@tasknest.example.com
- GitHub Issues: [repository link]
- Documentation: [docs link]

---

**Last Updated**: 2026-02-02
**API Version**: 1.0.0
