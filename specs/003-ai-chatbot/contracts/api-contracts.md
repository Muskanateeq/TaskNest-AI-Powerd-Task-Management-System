# Phase 3: AI Chatbot - API Contracts

**Feature ID**: 003-ai-chatbot
**Version**: 1.0
**Last Updated**: 2026-02-17

---

## Chat API Endpoint

### POST /api/v1/chat

Send a message to the AI chatbot and receive a response.

**Authentication**: Required (JWT Bearer token)

**Request**:
```json
{
  "conversation_id": 123,  // Optional: null or omit to create new conversation
  "message": "Add a high priority task to finish the report by Friday"
}
```

**Request Schema**:
```typescript
interface ChatRequest {
  conversation_id?: number | null;  // Optional conversation ID
  message: string;                   // User's message (1-2000 chars)
}
```

**Response** (Success - 200):
```json
{
  "conversation_id": 123,
  "response": "I've created a high priority task 'Finish the report' with a due date of Friday, February 21st. The task has been added to your list.",
  "tool_calls": [
    {
      "tool": "add_task",
      "arguments": {
        "user_id": "user_550e8400",
        "title": "Finish the report",
        "priority": "high",
        "due_date": "2026-02-21"
      },
      "result": {
        "id": 45,
        "title": "Finish the report",
        "description": null,
        "priority": "high",
        "due_date": "2026-02-21",
        "due_time": null,
        "completed": false,
        "recurrence_pattern": null,
        "created_at": "2026-02-17T10:30:00Z",
        "updated_at": "2026-02-17T10:30:00Z",
        "tags": []
      }
    }
  ]
}
```

**Response Schema**:
```typescript
interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCall[];
}

interface ToolCall {
  tool: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}
```

**Error Responses**:

**400 Bad Request**:
```json
{
  "detail": "Message is required and must be between 1 and 2000 characters"
}
```

**401 Unauthorized**:
```json
{
  "detail": "Not authenticated"
}
```

**403 Forbidden**:
```json
{
  "detail": "Access denied to this conversation"
}
```

**404 Not Found**:
```json
{
  "detail": "Conversation not found"
}
```

**500 Internal Server Error**:
```json
{
  "detail": "Failed to process message. Please try again."
}
```

---

## MCP Tools Specification

### Tool 1: add_task

Create a new task with full feature support.

**Parameters**:
```typescript
interface AddTaskParams {
  user_id: string;                    // Required: User ID (from JWT)
  title: string;                      // Required: Task title (1-200 chars)
  description?: string;               // Optional: Task description (max 1000 chars)
  priority?: "high" | "medium" | "low"; // Optional: Default "medium"
  due_date?: string;                  // Optional: ISO date "YYYY-MM-DD"
  due_time?: string;                  // Optional: Time "HH:MM:SS"
  recurrence_pattern?: {              // Optional: Recurring task pattern
    type: "daily" | "weekly" | "monthly" | "custom";
    interval?: number;                // For custom: repeat every N days/weeks/months
    days?: string[];                  // For weekly: ["monday", "wednesday"]
    end_date?: string;                // Optional: When to stop recurring
  };
  tag_ids?: number[];                 // Optional: Array of tag IDs
}
```

**Returns**:
```typescript
interface TaskResult {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  recurrence_pattern: object | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}
```

**Example Call**:
```json
{
  "user_id": "user_123",
  "title": "Weekly team meeting",
  "description": "Discuss project progress",
  "priority": "high",
  "due_date": "2026-02-21",
  "due_time": "14:00:00",
  "recurrence_pattern": {
    "type": "weekly",
    "interval": 1,
    "days": ["friday"]
  },
  "tag_ids": [1, 3]
}
```

---

### Tool 2: list_tasks

List tasks with filters and sorting.

**Parameters**:
```typescript
interface ListTasksParams {
  user_id: string;                    // Required: User ID (from JWT)
  status?: "all" | "pending" | "completed"; // Optional: Default "all"
  priority?: "high" | "medium" | "low"; // Optional: Filter by priority
  tags?: string[];                    // Optional: Filter by tag names
  due_date_range?: {                  // Optional: Filter by due date
    start?: string;                   // ISO date "YYYY-MM-DD"
    end?: string;                     // ISO date "YYYY-MM-DD"
  };
  sort_by?: "created_at" | "due_date" | "priority" | "title"; // Optional: Default "created_at"
  sort_order?: "asc" | "desc";        // Optional: Default "desc"
}
```

**Returns**:
```typescript
interface TaskListResult {
  tasks: TaskResult[];
  total: number;
}
```

**Example Call**:
```json
{
  "user_id": "user_123",
  "status": "pending",
  "priority": "high",
  "due_date_range": {
    "start": "2026-02-17",
    "end": "2026-02-23"
  },
  "sort_by": "due_date",
  "sort_order": "asc"
}
```

---

### Tool 3: complete_task

Mark a task as complete. If recurring, automatically generates next occurrence.

**Parameters**:
```typescript
interface CompleteTaskParams {
  user_id: string;    // Required: User ID (from JWT)
  task_id: number;    // Required: Task ID to complete
}
```

**Returns**:
```typescript
interface CompleteTaskResult {
  completed_task: TaskResult;
  next_task?: TaskResult;  // Present if task was recurring
}
```

**Example Call**:
```json
{
  "user_id": "user_123",
  "task_id": 45
}
```

**Example Response** (Recurring Task):
```json
{
  "completed_task": {
    "id": 45,
    "title": "Weekly team meeting",
    "completed": true,
    "due_date": "2026-02-21",
    ...
  },
  "next_task": {
    "id": 46,
    "title": "Weekly team meeting",
    "completed": false,
    "due_date": "2026-02-28",
    ...
  }
}
```

---

### Tool 4: update_task

Update any task field.

**Parameters**:
```typescript
interface UpdateTaskParams {
  user_id: string;                    // Required: User ID (from JWT)
  task_id: number;                    // Required: Task ID to update
  title?: string;                     // Optional: New title
  description?: string;               // Optional: New description
  priority?: "high" | "medium" | "low"; // Optional: New priority
  due_date?: string;                  // Optional: New due date
  due_time?: string;                  // Optional: New due time
  recurrence_pattern?: object;        // Optional: New recurrence pattern
  tag_ids?: number[];                 // Optional: New tag IDs (replaces existing)
}
```

**Returns**:
```typescript
interface UpdateTaskResult {
  task: TaskResult;
  updated_fields: string[];  // List of fields that were updated
}
```

**Example Call**:
```json
{
  "user_id": "user_123",
  "task_id": 45,
  "priority": "high",
  "due_date": "2026-02-25"
}
```

---

### Tool 5: delete_task

Delete a task permanently.

**Parameters**:
```typescript
interface DeleteTaskParams {
  user_id: string;    // Required: User ID (from JWT)
  task_id: number;    // Required: Task ID to delete
}
```

**Returns**:
```typescript
interface DeleteTaskResult {
  deleted_task_id: number;
  title: string;
  message: string;
}
```

**Example Call**:
```json
{
  "user_id": "user_123",
  "task_id": 45
}
```

**Example Response**:
```json
{
  "deleted_task_id": 45,
  "title": "Old task",
  "message": "Task 'Old task' has been deleted successfully"
}
```

---

## Natural Language Examples

### Creating Tasks

**User Input** → **Tool Call** → **Response**

1. "Add a task to buy groceries"
   - Tool: `add_task(title="Buy groceries")`
   - Response: "I've added a task 'Buy groceries' to your list."

2. "Create a high priority task to finish the report by Friday"
   - Tool: `add_task(title="Finish the report", priority="high", due_date="2026-02-21")`
   - Response: "I've created a high priority task 'Finish the report' due on Friday, February 21st."

3. "Add a weekly recurring task to review reports every Monday"
   - Tool: `add_task(title="Review reports", recurrence_pattern={type: "weekly", days: ["monday"]})`
   - Response: "I've created a weekly recurring task 'Review reports' scheduled for every Monday."

4. "Create a task tagged with 'work' and 'urgent' to call the client"
   - Tool: `add_task(title="Call the client", tag_ids=[1, 2])`
   - Response: "I've added a task 'Call the client' with tags 'work' and 'urgent'."

---

### Listing Tasks

**User Input** → **Tool Call** → **Response**

1. "Show me all my tasks"
   - Tool: `list_tasks(status="all")`
   - Response: "You have 12 tasks: 5 pending and 7 completed. Here are your pending tasks: [list]"

2. "What's due today?"
   - Tool: `list_tasks(due_date_range={start: "2026-02-17", end: "2026-02-17"})`
   - Response: "You have 3 tasks due today: [list]"

3. "Show me high priority tasks"
   - Tool: `list_tasks(priority="high", status="pending")`
   - Response: "You have 4 high priority tasks: [list]"

4. "List tasks tagged with 'work'"
   - Tool: `list_tasks(tags=["work"])`
   - Response: "You have 8 tasks tagged with 'work': [list]"

---

### Completing Tasks

**User Input** → **Tool Call** → **Response**

1. "Mark task 5 as complete"
   - Tool: `complete_task(task_id=5)`
   - Response: "Great! I've marked task 'Buy groceries' as complete."

2. "I finished the report"
   - Tool: `list_tasks(status="pending")` → find task → `complete_task(task_id=X)`
   - Response: "Excellent! I've marked 'Finish the report' as complete."

3. "Done with the weekly meeting" (recurring task)
   - Tool: `complete_task(task_id=10)`
   - Response: "I've marked this week's meeting as complete and created next week's meeting for February 28th."

---

### Updating Tasks

**User Input** → **Tool Call** → **Response**

1. "Change task 3 to high priority"
   - Tool: `update_task(task_id=3, priority="high")`
   - Response: "I've updated task 'Call client' to high priority."

2. "Move the meeting to tomorrow"
   - Tool: `list_tasks()` → find meeting → `update_task(task_id=X, due_date="2026-02-18")`
   - Response: "I've rescheduled the meeting to tomorrow, February 18th."

3. "Add 'urgent' tag to task 7"
   - Tool: `update_task(task_id=7, tag_ids=[existing_tags + urgent_tag_id])`
   - Response: "I've added the 'urgent' tag to task 'Review documents'."

---

### Deleting Tasks

**User Input** → **Tool Call** → **Response**

1. "Delete task 8"
   - Tool: `delete_task(task_id=8)`
   - Response: "I've deleted task 'Old meeting' from your list."

2. "Remove the grocery task"
   - Tool: `list_tasks()` → find grocery task → `delete_task(task_id=X)`
   - Response: "I've removed 'Buy groceries' from your task list."

---

## Error Handling

### Tool Execution Errors

**Task Not Found**:
```json
{
  "error": "task_not_found",
  "message": "Task with ID 999 not found",
  "task_id": 999
}
```

**Permission Denied**:
```json
{
  "error": "permission_denied",
  "message": "You don't have permission to access this task",
  "task_id": 45
}
```

**Validation Error**:
```json
{
  "error": "validation_error",
  "message": "Title must be between 1 and 200 characters",
  "field": "title"
}
```

**Agent Response to Errors**:
- "I couldn't find that task. Could you provide the task ID or describe it differently?"
- "I encountered an error while creating the task. Please try again with a shorter title."
- "I don't have permission to modify that task. Please check the task ID."

---

## Rate Limiting (Future)

**Limits** (not implemented in Phase 3.0):
- 60 requests per minute per user
- 1000 requests per hour per user

**Response** (429 Too Many Requests):
```json
{
  "detail": "Rate limit exceeded. Please try again in 30 seconds.",
  "retry_after": 30
}
```

---

## Webhooks (Future)

**Not implemented in Phase 3.0**

Future webhook events:
- `task.created`
- `task.completed`
- `task.updated`
- `task.deleted`
- `conversation.created`
- `message.sent`

---

**API Contracts Version**: 1.0
**Status**: Ready for Implementation
