# Phase 3: AI-Powered Todo Chatbot

**Feature ID**: 003-ai-chatbot
**Phase**: III
**Status**: Planning
**Priority**: High
**Estimated Effort**: 2-3 weeks
**Dependencies**: Phase 2 (Complete)

---

## 1. Overview

### 1.1 Purpose
Add an AI-powered conversational interface to TaskNest that allows users to manage their tasks through natural language commands. This interface will coexist with the existing dashboard UI, giving users the choice between visual and conversational task management.

### 1.2 Goals
- Enable natural language task management via AI chatbot
- **Maintain 100% feature parity with dashboard UI** (Basic + Intermediate + Advanced)
- Support ALL Phase 2 features via chat:
  - ✅ Basic: CRUD operations, task completion
  - ✅ Intermediate: Priorities, tags, search, filter, sort
  - ✅ Advanced: Due dates/times, recurring tasks with auto-generation, notifications
- Implement stateless, scalable chat architecture
- Preserve conversation history across sessions
- Provide seamless integration with existing Phase 2 features

### 1.3 Non-Goals
- Replace or remove existing dashboard UI
- Voice input/output (bonus feature for later)
- Multi-language support (bonus feature for later)
- Real-time collaboration in chat
- File attachments in chat

---

## 2. User Stories

### 2.1 Core User Stories

**US-1: Access Chat Interface**
- **As a** TaskNest user
- **I want to** access a chat interface from the main navigation
- **So that** I can manage tasks through conversation

**Acceptance Criteria:**
- Chat link visible in main navigation
- Chat page loads with ChatKit UI
- User can send messages and receive responses
- Chat history persists across page refreshes

---

**US-2: Create Tasks via Chat**
- **As a** user
- **I want to** create tasks by describing them in natural language
- **So that** I can quickly add tasks without filling forms

**Examples:**
- "Add a task to buy groceries"
- "Remind me to call mom tomorrow at 2pm"
- "Create a high priority task to finish the report"

**Acceptance Criteria:**
- AI understands task creation intent
- Task is created with correct title and description
- Priority and due date are extracted when mentioned
- Confirmation message shows task details
- Task appears in dashboard immediately

---

**US-3: List Tasks via Chat**
- **As a** user
- **I want to** view my tasks by asking in natural language
- **So that** I can quickly check my task list

**Examples:**
- "Show me all my tasks"
- "What's due today?"
- "List my high priority tasks"
- "Show pending tasks"

**Acceptance Criteria:**
- AI understands list/view intent
- Correct filter is applied (status, priority, due date)
- Tasks are displayed in readable format
- Empty state handled gracefully

---

**US-4: Complete Tasks via Chat**
- **As a** user
- **I want to** mark tasks complete through conversation
- **So that** I can update status without clicking checkboxes

**Examples:**
- "Mark task 5 as complete"
- "I finished buying groceries"
- "Complete the report task"

**Acceptance Criteria:**
- AI identifies task by ID or title
- Task completion status updates
- Recurring tasks auto-generate next occurrence
- Confirmation message shows updated status
- Dashboard reflects change immediately

---

**US-5: Update Tasks via Chat**
- **As a** user
- **I want to** modify task details through conversation
- **So that** I can make quick edits

**Examples:**
- "Change task 3 title to 'Buy milk and eggs'"
- "Update the report task to high priority"
- "Move the meeting to tomorrow"

**Acceptance Criteria:**
- AI identifies task to update
- Specified fields are updated
- Other fields remain unchanged
- Confirmation shows what changed
- Dashboard reflects updates

---

**US-6: Delete Tasks via Chat**
- **As a** user
- **I want to** remove tasks through conversation
- **So that** I can clean up my task list

**Examples:**
- "Delete task 7"
- "Remove the old meeting task"
- "Cancel the grocery task"

**Acceptance Criteria:**
- AI identifies task to delete
- Task is removed from database
- Confirmation message shown
- Dashboard updates immediately

---

**US-7: Conversation History**
- **As a** user
- **I want to** see my previous chat messages
- **So that** I can review what I asked and what the AI did

**Acceptance Criteria:**
- Previous messages load on page load
- Messages show user and assistant roles
- Timestamps visible
- Conversation persists after server restart
- Can start new conversation

---

## 3. Technical Requirements

### 3.1 Frontend Requirements

**ChatKit Integration:**
- Install `@openai/chatkit-react` package
- Configure ChatKit with domain allowlist
- Create chat page at `/app/chat/page.tsx`
- Add chat navigation link to sidebar
- Handle streaming responses
- Display tool calls and confirmations

**API Integration:**
- Create chat API client methods
- Handle conversation ID management
- Send user messages to backend
- Receive and display AI responses
- Handle errors gracefully

**UI/UX:**
- Modern chat interface matching TaskNest design
- Message bubbles for user and assistant
- Loading indicators during AI processing
- Tool call visualization
- Mobile-responsive layout

---

### 3.2 Backend Requirements

**Chat Endpoint:**
```python
POST /api/v1/chat
Authorization: Bearer <jwt_token>

Request:
{
  "conversation_id": int | null,  # null creates new conversation
  "message": str                   # user's message
}

Response:
{
  "conversation_id": int,
  "response": str,                 # AI's response
  "tool_calls": [                  # tools invoked
    {
      "tool": "add_task",
      "arguments": {...},
      "result": {...}
    }
  ]
}
```

**OpenAI Agents SDK:**
- Initialize agent with system prompt
- Configure MCP tools
- Implement runner for agent execution
- Handle streaming responses
- Manage conversation context

**MCP Server:**
- Implement 5 required tools with **FULL feature support**:
  1. `add_task(user_id, title, description, priority, due_date, due_time, recurrence_pattern, tag_ids)`
     - Supports: Basic creation + Priorities + Tags + Due dates + Recurring patterns
  2. `list_tasks(user_id, status, priority, tags, due_date_range, sort_by, sort_order)`
     - Supports: All filters (status, priority, tags, dates) + All sort options
  3. `complete_task(user_id, task_id)`
     - Supports: Basic completion + Auto-generation for recurring tasks
  4. `delete_task(user_id, task_id)`
     - Supports: Basic deletion with cascade (removes tags associations)
  5. `update_task(user_id, task_id, title, description, priority, due_date, due_time, recurrence_pattern, tag_ids)`
     - Supports: Update ANY field (Basic + Intermediate + Advanced)

**Conversation Management:**
- Store conversations in database
- Store messages with role and content
- Load conversation history for context
- Support conversation resumption
- Implement stateless server design

---

### 3.3 Database Requirements

**New Tables:**

```sql
-- Conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conversation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

### 3.4 Integration Requirements

**Phase 2 Integration:**
- Reuse existing `task_service` methods in MCP tools
- Share authentication system (JWT)
- Use same database connection
- Maintain data consistency
- No changes to existing endpoints

**External Services:**
- OpenAI API for agent execution
- ChatKit domain allowlist configuration
- Neon PostgreSQL for data storage

---

## 4. Agent Behavior Specification

### 4.1 System Prompt

```
You are TaskNest AI, a helpful assistant for managing tasks and todos.

Your capabilities:
- Create tasks with title, description, priority, due date, and recurrence
- List tasks with various filters (status, priority, tags, due date)
- Mark tasks as complete (recurring tasks auto-generate next occurrence)
- Update task details
- Delete tasks

Guidelines:
- Always confirm actions taken
- Be concise and friendly
- Ask for clarification if intent is unclear
- Provide helpful suggestions
- Handle errors gracefully

Available priorities: high, medium, low
Available statuses: all, pending, completed
Recurrence patterns: daily, weekly, monthly, custom
```

### 4.2 Natural Language Understanding

**Task Creation Patterns:**
- "Add/Create/Make a task [to] <action>"
- "Remind me to <action>"
- "I need to <action>"
- "<action> [priority] [due date]"

**Task Listing Patterns:**
- "Show/List/Display [my] tasks"
- "What's due [today/tomorrow/this week]"
- "Show [high/medium/low] priority tasks"
- "List [pending/completed] tasks"

**Task Completion Patterns:**
- "Mark task <id> as complete/done"
- "I finished <task title>"
- "Complete the <task title>"
- "Done with <task title>"

**Task Update Patterns:**
- "Change/Update task <id> [field] to <value>"
- "Move <task title> to <date>"
- "Set <task title> priority to <priority>"

**Task Deletion Patterns:**
- "Delete/Remove task <id>"
- "Cancel <task title>"
- "Get rid of <task title>"

---

## 5. Acceptance Criteria

### 5.1 Functional Criteria

**Chat Interface:**
- [ ] Chat page accessible from navigation
- [ ] ChatKit UI renders correctly
- [ ] Messages send and receive properly
- [ ] Conversation history loads on page load
- [ ] New conversation can be started

**Task Operations:**
- [ ] Create task via natural language
- [ ] List tasks with filters
- [ ] Complete task (with recurring auto-gen)
- [ ] Update task details
- [ ] Delete task
- [ ] All operations reflect in dashboard immediately

**AI Behavior:**
- [ ] Understands natural language commands
- [ ] Calls appropriate MCP tools
- [ ] Provides clear confirmations
- [ ] Handles ambiguity gracefully
- [ ] Recovers from errors

**Data Consistency:**
- [ ] Chat and dashboard show same data
- [ ] Changes in chat update dashboard
- [ ] Changes in dashboard visible in chat
- [ ] No data loss or corruption

---

### 5.2 Non-Functional Criteria

**Performance:**
- [ ] Chat response time < 3 seconds
- [ ] Conversation history loads < 1 second
- [ ] No UI blocking during AI processing
- [ ] Streaming responses for better UX

**Scalability:**
- [ ] Stateless server design
- [ ] Horizontal scaling possible
- [ ] Database queries optimized
- [ ] Connection pooling configured

**Security:**
- [ ] JWT authentication required
- [ ] User data isolation enforced
- [ ] No conversation leakage between users
- [ ] API keys secured in environment variables

**Reliability:**
- [ ] Server restart doesn't lose conversations
- [ ] Failed tool calls handled gracefully
- [ ] Network errors handled with retry
- [ ] Conversation state always consistent

---

## 6. Out of Scope (Future Enhancements)

- Voice input/output
- Multi-language support (Urdu)
- Real-time collaboration
- File attachments
- Task sharing via chat
- Calendar integration
- Email notifications
- Slack integration

---

## 7. Success Metrics

**User Engagement:**
- 30%+ of users try chat interface
- 10%+ of tasks created via chat
- Average 5+ messages per conversation

**Technical Performance:**
- 95%+ uptime
- < 3s average response time
- < 1% error rate
- 100% data consistency

**Feature Adoption:**
- All 5 MCP tools used regularly
- Conversation history accessed
- Users switch between UI and chat

---

## 8. Dependencies

**External:**
- OpenAI API access and credits
- ChatKit domain allowlist approval
- Neon PostgreSQL (already configured)

**Internal:**
- Phase 2 complete (✅)
- Better Auth working (✅)
- Task service layer (✅)
- Database connection (✅)

---

## 9. Risks & Mitigations

**Risk 1: OpenAI API Rate Limits**
- Mitigation: Implement rate limiting, caching, fallback messages

**Risk 2: ChatKit Domain Allowlist Delay**
- Mitigation: Use local development mode, prepare production domain early

**Risk 3: Agent Misunderstanding Commands**
- Mitigation: Comprehensive system prompt, example training, fallback to clarification

**Risk 4: Conversation History Growing Large**
- Mitigation: Limit context window, implement pagination, archive old conversations

**Risk 5: MCP Tool Failures**
- Mitigation: Robust error handling, retry logic, user-friendly error messages

---

## 10. Testing Strategy

**Unit Tests:**
- MCP tool functions
- Conversation service methods
- Message parsing logic
- Agent prompt generation

**Integration Tests:**
- Chat endpoint with mock agent
- MCP tools with real database
- Conversation persistence
- Authentication flow

**E2E Tests:**
- Complete user flows (create, list, complete, update, delete)
- Conversation resumption
- Error scenarios
- Dashboard-chat consistency

**Manual Testing:**
- Natural language variations
- Edge cases and ambiguity
- UI/UX polish
- Mobile responsiveness

---

## 11. Documentation Requirements

- [ ] API documentation for chat endpoint
- [ ] MCP tools documentation
- [ ] Agent behavior guide
- [ ] User guide for chat interface
- [ ] Deployment guide updates
- [ ] README updates

---

## 12. Timeline Estimate

**Week 1: Backend Foundation**
- Database models (Conversation, Message)
- MCP Server with 5 tools
- OpenAI Agents SDK integration
- Chat endpoint (basic)

**Week 2: Frontend & Integration**
- ChatKit setup and configuration
- Chat page and UI components
- API client integration
- Testing and debugging

**Week 3: Polish & Testing**
- Comprehensive testing
- Bug fixes
- Documentation
- Deployment preparation

---

**Specification Version**: 1.0
**Last Updated**: 2026-02-17
**Author**: TaskNest Team
**Status**: Ready for Planning Phase
