# Phase 3: AI Chatbot - Task Breakdown

**Feature ID**: 003-ai-chatbot
**Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: 2026-02-17

---

## Task Organization

Tasks are organized in dependency order. Complete tasks in sequence within each phase.

**Legend**:
- 🔴 **Blocked**: Cannot start (dependencies incomplete)
- 🟡 **Ready**: Can start now
- 🟢 **In Progress**: Currently being worked on
- ✅ **Complete**: Done and tested

---

## Phase 1: Backend Foundation (Week 1)

### Task 1.1: Database Models - Conversation & Message
**Status**: 🟡 Ready
**Estimated Time**: 2-3 hours
**Dependencies**: None
**Priority**: High

**Description**:
Create SQLModel models for conversations and messages tables.

**Implementation Steps**:
1. Create `backend/src/models/conversation.py`
2. Create `backend/src/models/message.py`
3. Define Conversation model with fields: id, user_id, created_at, updated_at
4. Define Message model with fields: id, conversation_id, user_id, role, content, created_at
5. Add relationships and foreign keys
6. Create Pydantic schemas for API requests/responses

**Files to Create**:
- `backend/src/models/conversation.py`
- `backend/src/models/message.py`

**Acceptance Criteria**:
- [ ] Conversation model has all required fields
- [ ] Message model has all required fields
- [ ] Foreign key constraints defined
- [ ] Check constraint on role field (user/assistant)
- [ ] Models imported in `backend/src/models/__init__.py`
- [ ] No syntax errors

**Testing**:
```python
# Can instantiate models
conv = Conversation(user_id="test_user")
msg = Message(conversation_id=1, user_id="test_user", role="user", content="Hello")
```

---

### Task 1.2: Alembic Migration for Chat Tables
**Status**: 🔴 Blocked (depends on 1.1)
**Estimated Time**: 1-2 hours
**Dependencies**: Task 1.1
**Priority**: High

**Description**:
Create Alembic migration to add conversations and messages tables to database.

**Implementation Steps**:
1. Generate migration: `alembic revision -m "add_chat_tables"`
2. Write upgrade() function to create tables
3. Write downgrade() function to drop tables
4. Add indexes for performance
5. Test migration up and down

**Files to Create**:
- `backend/alembic/versions/003_add_chat_tables.py`

**Acceptance Criteria**:
- [ ] Migration file created
- [ ] upgrade() creates both tables with all fields
- [ ] downgrade() drops both tables
- [ ] Indexes created on user_id, conversation_id, created_at
- [ ] Migration runs successfully: `alembic upgrade head`
- [ ] Migration rolls back successfully: `alembic downgrade -1`
- [ ] Tables visible in database

**Testing**:
```bash
# Run migration
alembic upgrade head

# Verify tables exist
psql -d tasknest -c "\dt conversations"
psql -d tasknest -c "\dt messages"

# Rollback
alembic downgrade -1
```

---

### Task 1.3: Conversation Service
**Status**: 🔴 Blocked (depends on 1.2)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 1.2
**Priority**: High

**Description**:
Create service layer for conversation and message management.

**Implementation Steps**:
1. Create `backend/src/services/conversation_service.py`
2. Implement `create_conversation(user_id)` method
3. Implement `get_conversation(conversation_id, user_id)` method
4. Implement `get_user_conversations(user_id, limit, offset)` method
5. Implement `add_message(conversation_id, user_id, role, content)` method
6. Implement `get_messages(conversation_id, limit, offset)` method
7. Add user ownership verification
8. Handle errors gracefully

**Files to Create**:
- `backend/src/services/conversation_service.py`

**Acceptance Criteria**:
- [ ] All methods implemented
- [ ] User ownership verified (403 if not owner)
- [ ] Database queries use async/await
- [ ] Proper error handling (404, 403, 500)
- [ ] Type hints on all methods
- [ ] Docstrings for all public methods

**Testing**:
```python
# Unit tests
async def test_create_conversation():
    conv = await conversation_service.create_conversation("user_123")
    assert conv.user_id == "user_123"

async def test_add_message():
    msg = await conversation_service.add_message(
        conversation_id=1,
        user_id="user_123",
        role="user",
        content="Hello"
    )
    assert msg.role == "user"
```

---

### Task 1.4: MCP Server - Tool Definitions
**Status**: 🔴 Blocked (depends on 1.3)
**Estimated Time**: 4-5 hours
**Dependencies**: Task 1.3
**Priority**: High

**Description**:
Create MCP server with 5 tools that wrap existing task_service methods.

**Implementation Steps**:
1. Create `backend/src/mcp/server.py`
2. Install MCP SDK: `uv add mcp`
3. Define `add_task` tool with all parameters (title, description, priority, due_date, due_time, recurrence_pattern, tag_ids)
4. Define `list_tasks` tool with filters (status, priority, tags, due_date_range, sort_by, sort_order)
5. Define `complete_task` tool
6. Define `update_task` tool with all updatable fields
7. Define `delete_task` tool
8. Each tool calls corresponding task_service method
9. Add proper error handling and return structured responses

**Files to Create**:
- `backend/src/mcp/__init__.py`
- `backend/src/mcp/server.py`

**Acceptance Criteria**:
- [ ] All 5 tools defined
- [ ] Tools use @tool decorator from MCP SDK
- [ ] Each tool has proper type hints
- [ ] Each tool has descriptive docstring
- [ ] Tools call existing task_service methods
- [ ] Error handling returns structured errors
- [ ] Tools return JSON-serializable results

**Testing**:
```python
# Test each tool
async def test_add_task_tool():
    result = await mcp_server.add_task(
        user_id="test_user",
        title="Test task",
        priority="high"
    )
    assert result["title"] == "Test task"
    assert result["priority"] == "high"

async def test_list_tasks_tool():
    result = await mcp_server.list_tasks(
        user_id="test_user",
        status="pending"
    )
    assert isinstance(result, list)
```

---

### Task 1.5: OpenAI Agents SDK Integration
**Status**: 🔴 Blocked (depends on 1.4)
**Estimated Time**: 4-5 hours
**Dependencies**: Task 1.4
**Priority**: High

**Description**:
Set up OpenAI Agents SDK with system prompt and MCP tools.

**Implementation Steps**:
1. Create `backend/src/agents/__init__.py`
2. Create `backend/src/agents/task_agent.py`
3. Install OpenAI SDK: `uv add openai`
4. Write comprehensive system prompt
5. Initialize Agent with system prompt
6. Register MCP tools with agent
7. Create agent runner function
8. Handle streaming responses
9. Add error handling for API failures

**Files to Create**:
- `backend/src/agents/__init__.py`
- `backend/src/agents/task_agent.py`

**Acceptance Criteria**:
- [ ] Agent initialized with system prompt
- [ ] All 5 MCP tools registered
- [ ] Agent can execute tools
- [ ] Streaming responses supported
- [ ] Error handling for OpenAI API failures
- [ ] Environment variable for API key
- [ ] Retry logic for transient failures

**Testing**:
```python
# Test agent execution
async def test_agent_create_task():
    response = await agent.run(
        "Add a high priority task to buy groceries",
        user_id="test_user"
    )
    assert "groceries" in response.lower()
    # Verify task was created in database
```

---

### Task 1.6: Chat Service
**Status**: 🔴 Blocked (depends on 1.5)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 1.5
**Priority**: High

**Description**:
Create chat service that orchestrates conversation management and agent execution.

**Implementation Steps**:
1. Create `backend/src/services/chat_service.py`
2. Implement `process_message(user_id, conversation_id, message)` method
3. Get or create conversation
4. Store user message
5. Load conversation history (last 20 messages)
6. Build context for agent
7. Execute agent with MCP tools
8. Store assistant response
9. Return response with tool calls

**Files to Create**:
- `backend/src/services/chat_service.py`

**Acceptance Criteria**:
- [ ] process_message method implemented
- [ ] Conversation created if not exists
- [ ] Messages stored in database
- [ ] Conversation history loaded for context
- [ ] Agent executed with proper context
- [ ] Response stored in database
- [ ] Tool calls tracked and returned
- [ ] Stateless design (no in-memory state)

**Testing**:
```python
async def test_process_message():
    response = await chat_service.process_message(
        user_id="test_user",
        conversation_id=None,
        message="Add a task to buy milk"
    )
    assert response.conversation_id is not None
    assert "milk" in response.response.lower()
    assert len(response.tool_calls) > 0
```

---

### Task 1.7: Chat API Endpoint
**Status**: 🔴 Blocked (depends on 1.6)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 1.6
**Priority**: High

**Description**:
Create FastAPI endpoint for chat functionality.

**Implementation Steps**:
1. Create `backend/src/api/chat.py`
2. Define ChatRequest schema
3. Define ChatResponse schema
4. Implement POST /api/v1/chat endpoint
5. Add JWT authentication dependency
6. Call chat_service.process_message
7. Handle errors (400, 401, 403, 500)
8. Add request validation
9. Add response serialization

**Files to Create**:
- `backend/src/api/chat.py`

**Acceptance Criteria**:
- [ ] POST /api/v1/chat endpoint created
- [ ] JWT authentication required
- [ ] Request validation working
- [ ] Calls chat_service correctly
- [ ] Returns proper response format
- [ ] Error handling for all cases
- [ ] Endpoint registered in main.py

**Testing**:
```python
async def test_chat_endpoint(client, auth_token):
    response = await client.post(
        "/api/v1/chat",
        json={"message": "Add a task to buy milk"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert "response" in data
```

---

### Task 1.8: Backend Testing
**Status**: 🔴 Blocked (depends on 1.7)
**Estimated Time**: 4-5 hours
**Dependencies**: Task 1.7
**Priority**: High

**Description**:
Write comprehensive tests for all Phase 3 backend components.

**Implementation Steps**:
1. Create `backend/tests/test_conversation_service.py`
2. Create `backend/tests/test_mcp_tools.py`
3. Create `backend/tests/test_chat_service.py`
4. Create `backend/tests/test_chat_api.py`
5. Write unit tests for each service method
6. Write integration tests for API endpoints
7. Mock OpenAI API calls
8. Test error scenarios
9. Ensure all tests pass

**Files to Create**:
- `backend/tests/test_conversation_service.py`
- `backend/tests/test_mcp_tools.py`
- `backend/tests/test_chat_service.py`
- `backend/tests/test_chat_api.py`

**Acceptance Criteria**:
- [ ] 20+ test cases written
- [ ] All services tested
- [ ] All API endpoints tested
- [ ] Error scenarios covered
- [ ] OpenAI API mocked
- [ ] All tests passing
- [ ] Test coverage > 80%

**Testing**:
```bash
cd backend
uv run pytest tests/test_conversation_service.py -v
uv run pytest tests/test_mcp_tools.py -v
uv run pytest tests/test_chat_service.py -v
uv run pytest tests/test_chat_api.py -v
```

---

## Phase 2: Frontend Integration (Week 2)

### Task 2.1: Install ChatKit Dependencies
**Status**: 🔴 Blocked (depends on Phase 1)
**Estimated Time**: 30 minutes
**Dependencies**: Phase 1 complete
**Priority**: High

**Description**:
Install OpenAI ChatKit packages and configure.

**Implementation Steps**:
1. Navigate to frontend directory
2. Install: `npm install @openai/chatkit-react @openai/chatkit`
3. Update package.json
4. Verify installation

**Files to Modify**:
- `frontend/TaskNest/package.json`

**Acceptance Criteria**:
- [ ] Packages installed successfully
- [ ] No dependency conflicts
- [ ] package.json updated
- [ ] node_modules contains packages

**Testing**:
```bash
cd frontend/TaskNest
npm install
npm run build  # Should succeed
```

---

### Task 2.2: ChatKit Configuration
**Status**: 🔴 Blocked (depends on 2.1)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 2.1
**Priority**: High

**Description**:
Configure ChatKit with domain allowlist and API endpoints.

**Implementation Steps**:
1. Sign up for OpenAI ChatKit
2. Add domain to allowlist (localhost for dev)
3. Get domain key
4. Add to environment variables
5. Create ChatKit configuration file
6. Set up API endpoint URLs
7. Configure theme to match TaskNest

**Files to Create**:
- `frontend/TaskNest/src/lib/chatkit-config.ts`

**Files to Modify**:
- `frontend/TaskNest/.env.local`

**Acceptance Criteria**:
- [ ] Domain added to allowlist
- [ ] Domain key obtained
- [ ] Environment variables set
- [ ] Configuration file created
- [ ] Theme matches TaskNest design
- [ ] API endpoints configured

**Testing**:
```typescript
// Verify config loads
import { chatKitConfig } from '@/lib/chatkit-config';
console.log(chatKitConfig.domainKey); // Should not be undefined
```

---

### Task 2.3: Chat API Client
**Status**: 🔴 Blocked (depends on 2.2)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 2.2
**Priority**: High

**Description**:
Create API client methods for chat functionality.

**Implementation Steps**:
1. Create `frontend/TaskNest/src/lib/chat-api.ts`
2. Implement `sendMessage(conversationId, message)` method
3. Implement `getConversationHistory(conversationId)` method
4. Implement `createConversation()` method
5. Add JWT token injection
6. Add error handling
7. Add TypeScript types

**Files to Create**:
- `frontend/TaskNest/src/lib/chat-api.ts`
- `frontend/TaskNest/src/lib/types/chat.ts`

**Acceptance Criteria**:
- [ ] All methods implemented
- [ ] JWT token automatically included
- [ ] Error handling for network failures
- [ ] TypeScript types defined
- [ ] Proper async/await usage
- [ ] Response parsing correct

**Testing**:
```typescript
// Test API client
const response = await chatApi.sendMessage(null, "Hello");
expect(response.conversation_id).toBeDefined();
expect(response.response).toBeDefined();
```

---

### Task 2.4: Chat Page Component
**Status**: 🔴 Blocked (depends on 2.3)
**Estimated Time**: 4-5 hours
**Dependencies**: Task 2.3
**Priority**: High

**Description**:
Create chat page with ChatKit UI integration.

**Implementation Steps**:
1. Create `frontend/TaskNest/src/app/(app)/chat/page.tsx`
2. Import ChatKit components
3. Set up useChatKit hook
4. Configure API endpoints
5. Handle message sending
6. Display conversation history
7. Add loading states
8. Add error handling
9. Style to match TaskNest theme

**Files to Create**:
- `frontend/TaskNest/src/app/(app)/chat/page.tsx`
- `frontend/TaskNest/src/app/chat.css`

**Acceptance Criteria**:
- [ ] Chat page renders correctly
- [ ] ChatKit UI integrated
- [ ] Messages send successfully
- [ ] Responses display correctly
- [ ] Conversation history loads
- [ ] Loading states shown
- [ ] Errors handled gracefully
- [ ] Mobile responsive
- [ ] Matches TaskNest design

**Testing**:
```typescript
// Manual testing
// 1. Navigate to /chat
// 2. Send message "Add a task to buy milk"
// 3. Verify response appears
// 4. Verify task created in dashboard
```

---

### Task 2.5: Navigation Integration
**Status**: 🔴 Blocked (depends on 2.4)
**Estimated Time**: 1-2 hours
**Dependencies**: Task 2.4
**Priority**: Medium

**Description**:
Add chat link to main navigation.

**Implementation Steps**:
1. Open `frontend/TaskNest/src/components/layout/Sidebar.tsx` (or equivalent)
2. Add "Chat" navigation item
3. Add chat icon
4. Link to /chat route
5. Add active state styling
6. Test navigation

**Files to Modify**:
- `frontend/TaskNest/src/components/layout/Sidebar.tsx` (or navigation component)

**Acceptance Criteria**:
- [ ] Chat link visible in navigation
- [ ] Icon displayed correctly
- [ ] Link navigates to /chat
- [ ] Active state works
- [ ] Accessible (keyboard navigation)
- [ ] Mobile menu includes chat

**Testing**:
```typescript
// Click chat link
// Verify URL changes to /chat
// Verify chat page loads
```

---

### Task 2.6: Chat UI Polish
**Status**: 🔴 Blocked (depends on 2.5)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 2.5
**Priority**: Medium

**Description**:
Polish chat interface with better UX.

**Implementation Steps**:
1. Add typing indicators
2. Add message timestamps
3. Add tool call visualization
4. Add conversation list (optional)
5. Add new conversation button
6. Improve error messages
7. Add empty state
8. Add keyboard shortcuts
9. Optimize performance

**Files to Modify**:
- `frontend/TaskNest/src/app/(app)/chat/page.tsx`
- `frontend/TaskNest/src/app/chat.css`

**Acceptance Criteria**:
- [ ] Typing indicator shows during AI processing
- [ ] Timestamps visible on messages
- [ ] Tool calls displayed clearly
- [ ] Empty state for new conversations
- [ ] Error messages user-friendly
- [ ] Smooth animations
- [ ] No performance issues

**Testing**:
```typescript
// Send multiple messages
// Verify smooth experience
// Check performance (no lag)
```

---

### Task 2.7: Frontend Testing
**Status**: 🔴 Blocked (depends on 2.6)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 2.6
**Priority**: High

**Description**:
Write tests for chat components and API client.

**Implementation Steps**:
1. Create `frontend/TaskNest/src/lib/__tests__/chat-api.test.ts`
2. Create `frontend/TaskNest/src/app/(app)/chat/__tests__/page.test.tsx`
3. Write unit tests for API client
4. Write component tests for chat page
5. Mock API responses
6. Test error scenarios
7. Ensure all tests pass

**Files to Create**:
- `frontend/TaskNest/src/lib/__tests__/chat-api.test.ts`
- `frontend/TaskNest/src/app/(app)/chat/__tests__/page.test.tsx`

**Acceptance Criteria**:
- [ ] 15+ test cases written
- [ ] API client tested
- [ ] Chat page tested
- [ ] Error scenarios covered
- [ ] All tests passing
- [ ] Test coverage > 70%

**Testing**:
```bash
cd frontend/TaskNest
npm test -- chat-api.test.ts
npm test -- page.test.tsx
```

---

## Phase 3: Integration & Testing (Week 3)

### Task 3.1: End-to-End Testing
**Status**: 🔴 Blocked (depends on Phase 2)
**Estimated Time**: 4-5 hours
**Dependencies**: Phase 2 complete
**Priority**: High

**Description**:
Test complete user flows from chat to dashboard.

**Test Scenarios**:
1. Create task via chat → Verify in dashboard
2. Complete task via chat → Verify in dashboard
3. Update task via chat → Verify in dashboard
4. Delete task via chat → Verify in dashboard
5. List tasks via chat → Verify matches dashboard
6. Recurring task completion → Verify auto-generation
7. Tag assignment via chat → Verify in dashboard
8. Priority setting via chat → Verify in dashboard

**Acceptance Criteria**:
- [ ] All 8 scenarios pass
- [ ] Data consistency verified
- [ ] No data loss
- [ ] Changes sync immediately
- [ ] Recurring tasks auto-generate
- [ ] All features work via chat

**Testing**:
```bash
# Manual E2E testing
# Run through all scenarios
# Document any issues
```

---

### Task 3.2: Performance Testing
**Status**: 🔴 Blocked (depends on 3.1)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 3.1
**Priority**: Medium

**Description**:
Test and optimize performance.

**Test Areas**:
1. Chat response time
2. Conversation history loading
3. Database query performance
4. OpenAI API latency
5. Frontend rendering performance

**Acceptance Criteria**:
- [ ] Chat response < 3 seconds
- [ ] History loads < 1 second
- [ ] No UI blocking
- [ ] Database queries optimized
- [ ] No memory leaks

**Testing**:
```bash
# Load testing
# Send 100 messages
# Measure response times
# Check database performance
```

---

### Task 3.3: Security Review
**Status**: 🔴 Blocked (depends on 3.2)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 3.2
**Priority**: High

**Description**:
Review and fix security issues.

**Review Areas**:
1. JWT authentication
2. User data isolation
3. Input validation
4. SQL injection prevention
5. XSS prevention
6. API key security

**Acceptance Criteria**:
- [ ] JWT required on all endpoints
- [ ] User data properly isolated
- [ ] Input validated and sanitized
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] API keys in environment variables

**Testing**:
```bash
# Security testing
# Try accessing other user's conversations
# Try SQL injection
# Try XSS attacks
```

---

### Task 3.4: Documentation
**Status**: 🔴 Blocked (depends on 3.3)
**Estimated Time**: 3-4 hours
**Dependencies**: Task 3.3
**Priority**: Medium

**Description**:
Write comprehensive documentation.

**Documentation to Create**:
1. Update README.md with Phase 3 info
2. API documentation for chat endpoint
3. MCP tools documentation
4. User guide for chat interface
5. Deployment guide updates
6. Environment variables documentation

**Files to Create/Modify**:
- `README.md`
- `docs/CHAT_API.md`
- `docs/MCP_TOOLS.md`
- `docs/USER_GUIDE.md`
- `DEPLOYMENT.md`

**Acceptance Criteria**:
- [ ] README updated
- [ ] API documented
- [ ] MCP tools documented
- [ ] User guide written
- [ ] Deployment guide updated
- [ ] All examples working

---

### Task 3.5: Deployment Preparation
**Status**: 🔴 Blocked (depends on 3.4)
**Estimated Time**: 2-3 hours
**Dependencies**: Task 3.4
**Priority**: High

**Description**:
Prepare for production deployment.

**Preparation Steps**:
1. Set up production environment variables
2. Configure ChatKit domain allowlist for production
3. Test production build
4. Update docker-compose.yml
5. Create deployment checklist
6. Test deployment locally

**Files to Modify**:
- `docker-compose.yml`
- `.env.example`
- `frontend/TaskNest/.env.local.example`

**Acceptance Criteria**:
- [ ] Environment variables documented
- [ ] Production domain configured
- [ ] Docker build succeeds
- [ ] Local deployment works
- [ ] Deployment checklist created

---

## Summary

**Total Tasks**: 25
**Estimated Time**: 2-3 weeks
**Critical Path**: Tasks 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 2.1 → 2.2 → 2.3 → 2.4

**Phase Breakdown**:
- Phase 1 (Backend): 8 tasks, ~25-30 hours
- Phase 2 (Frontend): 7 tasks, ~18-22 hours
- Phase 3 (Integration): 5 tasks, ~15-18 hours

**Next Steps**:
1. Review and approve this task breakdown
2. Set up development environment
3. Start with Task 1.1
4. Complete tasks in order
5. Test thoroughly at each step

---

**Task Breakdown Version**: 1.0
**Status**: Ready for Implementation
**Approved By**: [Pending]
