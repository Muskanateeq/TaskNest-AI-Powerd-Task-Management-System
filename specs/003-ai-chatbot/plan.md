# Phase 3: AI Chatbot - Implementation Plan

**Feature ID**: 003-ai-chatbot
**Version**: 1.0
**Status**: Planning
**Last Updated**: 2026-02-17

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                         │
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Dashboard UI    │              │   Chat UI        │        │
│  │  (Phase 2)       │              │   (Phase 3)      │        │
│  │  - TaskList      │              │   - ChatKit      │        │
│  │  - TaskForm      │              │   - Messages     │        │
│  │  - Filters       │              │   - History      │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                  │                   │
│           │         SAME USER DATA           │                   │
│           │                                  │                   │
└───────────┼──────────────────────────────────┼───────────────────┘
            │                                  │
            │  JWT Token                       │  JWT Token
            │                                  │
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Task API        │              │   Chat API       │        │
│  │  (Phase 2)       │              │   (Phase 3)      │        │
│  │  /api/v1/tasks   │              │   /api/v1/chat   │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                  │                   │
│           │                                  ▼                   │
│           │                    ┌──────────────────────────┐     │
│           │                    │  Chat Service            │     │
│           │                    │  - Conversation Manager  │     │
│           │                    │  - Message Handler       │     │
│           │                    └──────────┬───────────────┘     │
│           │                               │                      │
│           │                               ▼                      │
│           │                    ┌──────────────────────────┐     │
│           │                    │  OpenAI Agents SDK       │     │
│           │                    │  - Agent                 │     │
│           │                    │  - Runner                │     │
│           │                    │  - System Prompt         │     │
│           │                    └──────────┬───────────────┘     │
│           │                               │                      │
│           │                               ▼                      │
│           │                    ┌──────────────────────────┐     │
│           │                    │  MCP Server              │     │
│           │                    │  - add_task              │     │
│           │                    │  - list_tasks            │     │
│           │                    │  - complete_task         │     │
│           │                    │  - update_task           │     │
│           │                    │  - delete_task           │     │
│           │                    └──────────┬───────────────┘     │
│           │                               │                      │
│           └───────────────────────────────┘                      │
│                                   │                              │
│                    ┌──────────────▼──────────────┐              │
│                    │  Task Service (Phase 2)     │              │
│                    │  - CRUD operations          │              │
│                    │  - Recurring task logic     │              │
│                    │  - Tag management           │              │
│                    └──────────────┬──────────────┘              │
│                                   │                              │
└───────────────────────────────────┼──────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │  Neon PostgreSQL             │
                    │  - users (Phase 2)           │
                    │  - tasks (Phase 2)           │
                    │  - tags (Phase 2)            │
                    │  - task_tags (Phase 2)       │
                    │  - conversations (NEW)       │
                    │  - messages (NEW)            │
                    └──────────────────────────────┘
```

---

## 2. Component Design

### 2.1 Frontend Components

#### **Chat Page Component**
```typescript
// app/chat/page.tsx
- Renders ChatKit UI
- Manages conversation state
- Handles message sending
- Displays conversation history
- Shows loading states
- Handles errors
```

#### **ChatKit Integration**
```typescript
// Uses @openai/chatkit-react
- Configure with domain key
- Set up API endpoints
- Handle streaming responses
- Display tool calls
- Theme matching TaskNest design
```

#### **Chat API Client**
```typescript
// lib/chat-api.ts
- sendMessage(conversationId, message)
- getConversationHistory(conversationId)
- createConversation()
- Uses JWT authentication
```

---

### 2.2 Backend Components

#### **Chat Router**
```python
# src/api/chat.py
@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    user: User = Depends(get_current_user)
):
    """
    Main chat endpoint
    - Validates user authentication
    - Creates/loads conversation
    - Processes message through agent
    - Stores messages in database
    - Returns AI response
    """
```

#### **Chat Service**
```python
# src/services/chat_service.py
class ChatService:
    async def process_message(
        user_id: str,
        conversation_id: int | None,
        message: str
    ) -> ChatResponse:
        """
        1. Get or create conversation
        2. Store user message
        3. Load conversation history
        4. Build context for agent
        5. Execute agent with MCP tools
        6. Store assistant response
        7. Return response
        """
```

#### **Conversation Service**
```python
# src/services/conversation_service.py
class ConversationService:
    async def create_conversation(user_id: str) -> Conversation
    async def get_conversation(conversation_id: int, user_id: str) -> Conversation
    async def get_messages(conversation_id: int, limit: int = 50) -> List[Message]
    async def add_message(conversation_id: int, role: str, content: str) -> Message
```

#### **MCP Server**
```python
# src/mcp/server.py
class TaskMCPServer:
    """
    MCP Server with 5 tools that wrap task_service methods
    """

    @tool
    async def add_task(
        user_id: str,
        title: str,
        description: str = None,
        priority: str = "medium",
        due_date: date = None,
        due_time: time = None,
        recurrence_pattern: dict = None,
        tag_ids: List[int] = []
    ) -> dict:
        """Create a new task with all features"""
        return await task_service.create_task(...)

    @tool
    async def list_tasks(
        user_id: str,
        status: str = "all",
        priority: str = None,
        tags: List[str] = None,
        due_date_range: dict = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> List[dict]:
        """List tasks with filters and sorting"""
        return await task_service.list_tasks(...)

    @tool
    async def complete_task(
        user_id: str,
        task_id: int
    ) -> dict:
        """Mark task complete (auto-generates recurring)"""
        return await task_service.toggle_complete(...)

    @tool
    async def update_task(
        user_id: str,
        task_id: int,
        **updates
    ) -> dict:
        """Update any task field"""
        return await task_service.update_task(...)

    @tool
    async def delete_task(
        user_id: str,
        task_id: int
    ) -> dict:
        """Delete a task"""
        return await task_service.delete_task(...)
```

#### **Agent Configuration**
```python
# src/agents/task_agent.py
from openai import OpenAI
from openai.agents import Agent

SYSTEM_PROMPT = """
You are TaskNest AI, a helpful assistant for managing tasks.

Capabilities:
- Create tasks with title, description, priority (high/medium/low), due date/time, recurrence (daily/weekly/monthly/custom), and tags
- List tasks with filters: status (all/pending/completed), priority, tags, due date range
- Sort tasks by: created_at, due_date, priority, title
- Mark tasks complete (recurring tasks auto-generate next occurrence)
- Update any task field
- Delete tasks

Guidelines:
- Always confirm actions taken with details
- Be concise and friendly
- Ask for clarification if intent is unclear
- Extract priority, due dates, and tags from natural language
- Suggest helpful actions based on context

Examples:
User: "Add a high priority task to finish the report by Friday"
You: Call add_task with priority="high", due_date=<next_friday>

User: "Show me what's due this week"
You: Call list_tasks with due_date_range={"start": <monday>, "end": <sunday>}

User: "Mark task 5 as done"
You: Call complete_task with task_id=5
"""

agent = Agent(
    name="TaskNest AI",
    instructions=SYSTEM_PROMPT,
    tools=[mcp_server.get_tools()],
    model="gpt-4o"
)
```

---

## 3. Database Schema

### 3.1 New Tables

#### **Conversations Table**
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_conversation_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
```

**Purpose**: Track chat conversations per user

**Fields**:
- `id`: Unique conversation identifier
- `user_id`: Owner of the conversation
- `created_at`: When conversation started
- `updated_at`: Last message timestamp

---

#### **Messages Table**
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_message_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

**Purpose**: Store individual messages in conversations

**Fields**:
- `id`: Unique message identifier
- `conversation_id`: Which conversation this belongs to
- `user_id`: Message owner (for data isolation)
- `role`: "user" or "assistant"
- `content`: Message text
- `created_at`: Message timestamp

---

### 3.2 Alembic Migration

```python
# alembic/versions/003_add_chat_tables.py
"""Add conversations and messages tables for Phase 3

Revision ID: 003
Revises: 002
Create Date: 2026-02-17
"""

def upgrade():
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversations_updated_at', 'conversations', ['updated_at'], postgresql_using='btree', postgresql_ops={'updated_at': 'DESC'})

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(255), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.CheckConstraint("role IN ('user', 'assistant')", name='ck_message_role')
    )
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])

def downgrade():
    op.drop_table('messages')
    op.drop_table('conversations')
```

---

## 4. API Design

### 4.1 Chat Endpoint

**Endpoint**: `POST /api/v1/chat`

**Authentication**: Required (JWT Bearer token)

**Request Schema**:
```python
class ChatRequest(BaseModel):
    conversation_id: int | None = None  # null = new conversation
    message: str = Field(min_length=1, max_length=2000)
```

**Response Schema**:
```python
class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[ToolCall] = []

class ToolCall(BaseModel):
    tool: str
    arguments: dict
    result: dict
```

**Example Request**:
```json
POST /api/v1/chat
Authorization: Bearer <jwt_token>

{
  "conversation_id": null,
  "message": "Add a high priority task to finish the report by Friday"
}
```

**Example Response**:
```json
{
  "conversation_id": 123,
  "response": "I've created a high priority task 'Finish the report' with a due date of Friday, February 21st. The task has been added to your list.",
  "tool_calls": [
    {
      "tool": "add_task",
      "arguments": {
        "user_id": "user_123",
        "title": "Finish the report",
        "priority": "high",
        "due_date": "2026-02-21"
      },
      "result": {
        "id": 45,
        "title": "Finish the report",
        "priority": "high",
        "due_date": "2026-02-21",
        "completed": false
      }
    }
  ]
}
```

---

### 4.2 Conversation History Endpoint (Optional)

**Endpoint**: `GET /api/v1/conversations/{conversation_id}/messages`

**Authentication**: Required

**Query Parameters**:
- `limit`: int (default: 50, max: 100)
- `offset`: int (default: 0)

**Response**:
```python
class MessageListResponse(BaseModel):
    messages: List[Message]
    total: int
    has_more: bool
```

---

## 5. Integration Strategy

### 5.1 Phase 2 Integration Points

**Reuse Existing Services**:
```python
# MCP tools call existing task_service methods
from src.services.task_service import TaskService

class TaskMCPServer:
    def __init__(self):
        self.task_service = TaskService()

    @tool
    async def add_task(self, **kwargs):
        # Reuse Phase 2 logic
        return await self.task_service.create_task(**kwargs)
```

**Shared Authentication**:
```python
# Same JWT verification for both APIs
from src.api.deps import get_current_user

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    user: User = Depends(get_current_user)  # Same as Phase 2
):
    ...
```

**Shared Database Connection**:
```python
# Same database session
from src.database import get_session

async def process_message(...):
    async with get_session() as session:
        # Access tasks, tags, conversations, messages
        ...
```

---

### 5.2 Data Consistency

**Real-time Sync**:
- Chat operations immediately update database
- Dashboard queries same database
- No caching layer needed initially
- Changes visible across both interfaces instantly

**Transaction Management**:
```python
async def complete_task_with_recurring(task_id: int, user_id: str):
    async with get_session() as session:
        async with session.begin():
            # Mark task complete
            task = await task_service.toggle_complete(task_id, user_id)

            # If recurring, create next occurrence
            if task.recurrence_pattern:
                next_task = await task_service.create_recurring_task(task)

            # Commit both operations atomically
            await session.commit()
```

---

## 6. Technology Stack

### 6.1 New Dependencies

**Backend**:
```toml
# pyproject.toml additions
[project.dependencies]
openai = "^1.54.0"              # OpenAI Agents SDK
mcp = "^1.0.0"                  # Official MCP SDK
python-dateutil = "^2.8.2"      # Date parsing for NL
```

**Frontend**:
```json
// package.json additions
{
  "dependencies": {
    "@openai/chatkit-react": "^1.0.0",
    "@openai/chatkit": "^1.0.0"
  }
}
```

---

### 6.2 Environment Variables

**Backend** (`.env`):
```bash
# Existing
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...

# New for Phase 3
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
MCP_SERVER_PORT=8001
```

**Frontend** (`.env.local`):
```bash
# Existing
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=...

# New for Phase 3
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=...
NEXT_PUBLIC_CHAT_ENABLED=true
```

---

## 7. Stateless Architecture

### 7.1 Design Principles

**No In-Memory State**:
- Server holds no conversation state
- All state persisted to database
- Each request is independent
- Horizontal scaling possible

**Request Flow**:
```
1. Receive chat request
2. Load conversation from DB
3. Load message history from DB
4. Build context array
5. Execute agent with context
6. Store response in DB
7. Return response
8. Server forgets everything
```

**Benefits**:
- Server restart doesn't lose data
- Load balancer can route to any instance
- Easy to scale horizontally
- Testable (no hidden state)

---

### 7.2 Context Window Management

**Strategy**:
```python
async def build_agent_context(conversation_id: int, limit: int = 20):
    """
    Load last N messages for context
    - Prevents context window overflow
    - Keeps recent conversation relevant
    - Older messages archived but accessible
    """
    messages = await conversation_service.get_messages(
        conversation_id,
        limit=limit,
        order_by="created_at DESC"
    )

    # Format for agent
    context = [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(messages)
    ]

    return context
```

---

## 8. Error Handling

### 8.1 Error Categories

**User Errors** (4xx):
- Invalid message format
- Conversation not found
- Unauthorized access
- Rate limit exceeded

**System Errors** (5xx):
- OpenAI API failure
- Database connection error
- MCP tool execution failure
- Agent timeout

**Agent Errors**:
- Ambiguous command
- Missing required information
- Tool call failure
- Invalid parameters

---

### 8.2 Error Recovery

**Graceful Degradation**:
```python
try:
    response = await agent.run(message, tools=mcp_tools)
except OpenAIError as e:
    # Fallback response
    response = "I'm having trouble processing that right now. Please try again or use the dashboard."
except ToolExecutionError as e:
    # Inform user of specific failure
    response = f"I couldn't complete that action: {e.message}. Please check the details and try again."
```

**Retry Logic**:
```python
@retry(max_attempts=3, backoff=exponential)
async def call_openai_agent(message: str, context: List[dict]):
    return await agent.run(message, context=context)
```

---

## 9. Performance Optimization

### 9.1 Database Queries

**Indexed Queries**:
- Conversations by user_id (indexed)
- Messages by conversation_id (indexed)
- Recent messages (created_at indexed)

**Query Optimization**:
```python
# Load messages with single query
messages = await session.execute(
    select(Message)
    .where(Message.conversation_id == conv_id)
    .order_by(Message.created_at.desc())
    .limit(20)
)
```

---

### 9.2 Caching Strategy

**Phase 3.1** (Initial):
- No caching (simplicity first)
- Direct database queries
- Acceptable for MVP

**Phase 3.2** (Future):
- Redis cache for conversation history
- Cache invalidation on new messages
- Reduce database load

---

## 10. Testing Strategy

### 10.1 Unit Tests

**MCP Tools**:
```python
# tests/test_mcp_tools.py
async def test_add_task_tool():
    result = await mcp_server.add_task(
        user_id="test_user",
        title="Test task",
        priority="high"
    )
    assert result["priority"] == "high"
    assert result["title"] == "Test task"
```

**Conversation Service**:
```python
# tests/test_conversation_service.py
async def test_create_conversation():
    conv = await conversation_service.create_conversation("user_123")
    assert conv.user_id == "user_123"
    assert conv.id is not None
```

---

### 10.2 Integration Tests

**Chat Endpoint**:
```python
# tests/test_chat_api.py
async def test_chat_endpoint_creates_task(client, auth_token):
    response = await client.post(
        "/api/v1/chat",
        json={"message": "Add a task to buy milk"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert "buy milk" in data["response"].lower()
```

---

### 10.3 E2E Tests

**Complete User Flow**:
```python
async def test_complete_chat_flow():
    # 1. User sends message
    # 2. Task is created
    # 3. Task appears in dashboard
    # 4. User completes via chat
    # 5. Dashboard shows completed
    # 6. Recurring task auto-generates
    ...
```

---

## 11. Deployment Considerations

### 11.1 Environment Setup

**Development**:
- Local OpenAI API key
- Local database
- ChatKit localhost mode

**Production**:
- OpenAI API key in secrets
- Neon PostgreSQL
- ChatKit domain allowlist configured
- Environment variables secured

---

### 11.2 Monitoring

**Metrics to Track**:
- Chat endpoint response time
- OpenAI API latency
- MCP tool execution time
- Error rates by type
- Conversation creation rate
- Messages per conversation

**Logging**:
```python
logger.info("Chat request", extra={
    "user_id": user.id,
    "conversation_id": conv_id,
    "message_length": len(message),
    "tool_calls": len(tool_calls)
})
```

---

## 12. Security Considerations

### 12.1 Authentication

- JWT required for all chat endpoints
- User ID extracted from token
- No user ID in request body
- Conversation ownership verified

### 12.2 Data Isolation

```python
# Always filter by user_id
async def get_conversation(conv_id: int, user_id: str):
    conv = await session.get(Conversation, conv_id)
    if conv.user_id != user_id:
        raise HTTPException(403, "Access denied")
    return conv
```

### 12.3 Input Validation

- Message length limits (max 2000 chars)
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize output)
- Rate limiting (future enhancement)

---

## 13. Rollout Plan

### 13.1 Phase 3.0 (MVP)

**Week 1-2**:
- Database models
- MCP server with 5 tools
- OpenAI Agents SDK integration
- Basic chat endpoint
- ChatKit UI integration

**Features**:
- Create, list, complete, update, delete tasks
- Basic conversation history
- All Phase 2 features supported

---

### 13.2 Phase 3.1 (Enhancements)

**Week 3-4**:
- Conversation management UI
- Better error messages
- Typing indicators
- Tool call visualization
- Performance optimization

---

### 13.3 Phase 3.2 (Advanced)

**Future**:
- Voice input/output
- Multi-language support
- Conversation search
- Export conversations
- Advanced analytics

---

## 14. Success Criteria

**Technical**:
- [ ] All 5 MCP tools working
- [ ] Chat endpoint < 3s response time
- [ ] 100% feature parity with dashboard
- [ ] Stateless architecture verified
- [ ] All tests passing

**User Experience**:
- [ ] Natural language commands understood
- [ ] Clear confirmations provided
- [ ] Errors handled gracefully
- [ ] Conversation history loads quickly
- [ ] Mobile responsive

**Integration**:
- [ ] Dashboard and chat show same data
- [ ] Changes sync immediately
- [ ] No data loss or corruption
- [ ] Authentication works seamlessly

---

## 15. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OpenAI API rate limits | High | Medium | Implement rate limiting, caching, fallback messages |
| ChatKit domain allowlist delay | Medium | Low | Use localhost mode, prepare domain early |
| Agent misunderstanding | Medium | Medium | Comprehensive system prompt, examples, clarification flow |
| Performance issues | Medium | Low | Database indexing, query optimization, monitoring |
| Security vulnerabilities | High | Low | Input validation, data isolation, security review |

---

**Plan Version**: 1.0
**Status**: Ready for Implementation
**Next Step**: Create tasks.md breakdown
