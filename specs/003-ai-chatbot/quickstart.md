# Phase 3: AI Chatbot - Quick Start Guide

**Feature ID**: 003-ai-chatbot
**Version**: 1.0
**Last Updated**: 2026-02-17

---

## Prerequisites

Before starting Phase 3 implementation, ensure:

- ✅ Phase 2 is 100% complete and tested
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000
- ✅ Database migrations up to date
- ✅ Better Auth working correctly
- ✅ OpenAI API account created
- ✅ OpenAI API key obtained

---

## Setup Steps

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
uv add openai mcp python-dateutil
```

#### Environment Variables
Add to `backend/.env`:
```bash
# Existing variables
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...

# New for Phase 3
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
```

#### Create Database Tables
```bash
# Create migration
alembic revision -m "add_chat_tables"

# Edit migration file (see plan.md for SQL)

# Run migration
alembic upgrade head

# Verify tables created
psql -d tasknest -c "\dt conversations"
psql -d tasknest -c "\dt messages"
```

---

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend/TaskNest
npm install @openai/chatkit-react @openai/chatkit
```

#### ChatKit Configuration

1. **Sign up for OpenAI ChatKit**:
   - Go to https://platform.openai.com/chatkit
   - Create account or sign in
   - Navigate to domain allowlist

2. **Add Domain**:
   - Development: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`
   - Get domain key

3. **Environment Variables**:
Add to `frontend/TaskNest/.env.local`:
```bash
# Existing variables
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=...

# New for Phase 3
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk_...
NEXT_PUBLIC_CHAT_ENABLED=true
```

---

## Implementation Order

Follow this exact order for smooth implementation:

### Week 1: Backend Foundation

**Day 1-2**: Database & Models
```bash
# Task 1.1: Create models
touch backend/src/models/conversation.py
touch backend/src/models/message.py

# Task 1.2: Create migration
alembic revision -m "add_chat_tables"
alembic upgrade head

# Task 1.3: Create conversation service
touch backend/src/services/conversation_service.py
```

**Day 3-4**: MCP Server
```bash
# Task 1.4: Create MCP server
mkdir backend/src/mcp
touch backend/src/mcp/__init__.py
touch backend/src/mcp/server.py

# Implement 5 tools
# Test each tool individually
```

**Day 5-6**: Agent Integration
```bash
# Task 1.5: Create agent
mkdir backend/src/agents
touch backend/src/agents/__init__.py
touch backend/src/agents/task_agent.py

# Task 1.6: Create chat service
touch backend/src/services/chat_service.py
```

**Day 7**: API Endpoint
```bash
# Task 1.7: Create chat endpoint
touch backend/src/api/chat.py

# Register in main.py
# Test with curl or Postman
```

---

### Week 2: Frontend Integration

**Day 1**: ChatKit Setup
```bash
# Task 2.1-2.2: Install and configure
npm install @openai/chatkit-react
touch frontend/TaskNest/src/lib/chatkit-config.ts
```

**Day 2-3**: API Client & Chat Page
```bash
# Task 2.3: Create API client
touch frontend/TaskNest/src/lib/chat-api.ts
touch frontend/TaskNest/src/lib/types/chat.ts

# Task 2.4: Create chat page
mkdir -p frontend/TaskNest/src/app/(app)/chat
touch frontend/TaskNest/src/app/(app)/chat/page.tsx
touch frontend/TaskNest/src/app/chat.css
```

**Day 4**: Navigation & Polish
```bash
# Task 2.5: Add navigation
# Edit sidebar component

# Task 2.6: Polish UI
# Add typing indicators, timestamps, etc.
```

**Day 5**: Testing
```bash
# Task 2.7: Write tests
mkdir -p frontend/TaskNest/src/lib/__tests__
touch frontend/TaskNest/src/lib/__tests__/chat-api.test.ts

mkdir -p frontend/TaskNest/src/app/(app)/chat/__tests__
touch frontend/TaskNest/src/app/(app)/chat/__tests__/page.test.tsx
```

---

### Week 3: Integration & Testing

**Day 1-2**: E2E Testing
```bash
# Task 3.1: Test all flows
# Create task via chat → verify in dashboard
# Complete task via chat → verify in dashboard
# etc.
```

**Day 3**: Performance & Security
```bash
# Task 3.2: Performance testing
# Task 3.3: Security review
```

**Day 4-5**: Documentation & Deployment
```bash
# Task 3.4: Write documentation
# Task 3.5: Prepare deployment
```

---

## Testing Checklist

### Backend Tests
```bash
cd backend

# Test conversation service
uv run pytest tests/test_conversation_service.py -v

# Test MCP tools
uv run pytest tests/test_mcp_tools.py -v

# Test chat service
uv run pytest tests/test_chat_service.py -v

# Test chat API
uv run pytest tests/test_chat_api.py -v

# All tests
uv run pytest -v
```

### Frontend Tests
```bash
cd frontend/TaskNest

# Test API client
npm test -- chat-api.test.ts

# Test chat page
npm test -- page.test.tsx

# All tests
npm test
```

### Manual Testing
```bash
# 1. Start backend
cd backend
uv run uvicorn src.main:app --reload

# 2. Start frontend
cd frontend/TaskNest
npm run dev

# 3. Test flows
# - Navigate to /chat
# - Send: "Add a task to buy milk"
# - Verify task created
# - Check dashboard shows task
# - Send: "Mark task X as complete"
# - Verify completion
# - Check dashboard updated
```

---

## Common Issues & Solutions

### Issue 1: OpenAI API Key Not Working
**Solution**:
```bash
# Verify key is set
echo $OPENAI_API_KEY

# Test key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Issue 2: ChatKit Domain Not Allowlisted
**Solution**:
1. Go to https://platform.openai.com/settings/organization/security/domain-allowlist
2. Add your domain
3. Wait 5-10 minutes for propagation
4. Restart frontend

### Issue 3: Database Migration Fails
**Solution**:
```bash
# Check current version
alembic current

# Rollback
alembic downgrade -1

# Fix migration file
# Re-run
alembic upgrade head
```

### Issue 4: MCP Tools Not Working
**Solution**:
```bash
# Test tool directly
python -c "
from src.mcp.server import mcp_server
result = await mcp_server.add_task(
    user_id='test',
    title='Test'
)
print(result)
"
```

### Issue 5: Chat Endpoint Returns 500
**Solution**:
```bash
# Check logs
tail -f backend/logs/app.log

# Test with curl
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

---

## Verification Steps

After completing implementation, verify:

### ✅ Backend Verification
```bash
# 1. Database tables exist
psql -d tasknest -c "\dt conversations"
psql -d tasknest -c "\dt messages"

# 2. Chat endpoint responds
curl http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message": "test"}'

# 3. All tests pass
cd backend && uv run pytest
```

### ✅ Frontend Verification
```bash
# 1. Chat page loads
# Navigate to http://localhost:3000/chat

# 2. Can send messages
# Type message and press enter

# 3. All tests pass
cd frontend/TaskNest && npm test
```

### ✅ Integration Verification
```bash
# 1. Create task via chat
# Message: "Add a task to buy milk"
# Check: Task appears in dashboard

# 2. Complete task via chat
# Message: "Mark task X as complete"
# Check: Task marked complete in dashboard

# 3. Recurring task auto-generates
# Create recurring task via chat
# Complete it
# Check: Next occurrence created
```

---

## Next Steps After Phase 3

Once Phase 3 is complete:

1. **Deploy to Production**
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Configure production environment variables
   - Test production deployment

2. **Phase 4: Local Kubernetes Deployment**
   - Containerize with Docker
   - Create Helm charts
   - Deploy to Minikube
   - Use kubectl-ai and kagent

3. **Phase 5: Advanced Cloud Deployment**
   - Deploy to DigitalOcean/GCP/Azure
   - Add Kafka for event streaming
   - Implement Dapr
   - Set up CI/CD

---

## Resources

**Documentation**:
- OpenAI Agents SDK: https://platform.openai.com/docs/agents
- OpenAI ChatKit: https://platform.openai.com/docs/chatkit
- MCP SDK: https://github.com/modelcontextprotocol/python-sdk
- FastAPI: https://fastapi.tiangolo.com
- Next.js: https://nextjs.org/docs

**Support**:
- OpenAI Discord: https://discord.gg/openai
- FastAPI Discord: https://discord.gg/fastapi
- GitHub Issues: [Your repo]/issues

---

**Quick Start Version**: 1.0
**Status**: Ready to Use
