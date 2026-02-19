# Phase 3: Multi-LLM Tech Stack Summary

**Feature ID**: 003-ai-chatbot
**Version**: 2.0 (Multi-LLM Support)
**Last Updated**: 2026-02-17

---

## 🎯 Final Tech Stack

### **Backend**
```python
Framework: FastAPI (Python 3.11+)
├── LLM Providers (Flexible)
│   ├── Google Gemini 1.5 Flash (DEFAULT, FREE) ✅
│   └── OpenAI GPT-4o (OPTIONAL, Paid) ⚠️
├── MCP Server (5 tools)
├── SQLModel (ORM)
├── Alembic (Migrations)
└── Neon PostgreSQL (Database)
```

### **Frontend**
```typescript
Framework: Next.js 15 (App Router)
├── OpenAI ChatKit (Chat UI) ✅
├── Better Auth (JWT)
├── Tailwind CSS (Styling)
└── TypeScript (Type Safety)
```

---

## 🔑 Environment Variables

### **Backend (.env)**

```bash
# ============================================
# LLM Provider Configuration
# ============================================
# Options: "gemini" (default, FREE) or "openai" (paid)
LLM_PROVIDER=gemini

# --------------------------------------------
# Google Gemini (DEFAULT - FREE)
# --------------------------------------------
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-1.5-flash
# Options: gemini-1.5-flash (fast, free) or gemini-1.5-pro (powerful, free)

# --------------------------------------------
# OpenAI (OPTIONAL - only if using OpenAI)
# --------------------------------------------
# Uncomment these lines if you want to use OpenAI
# OPENAI_API_KEY=sk-proj-...
# OPENAI_MODEL=gpt-4o

# ============================================
# Existing Phase 2 Variables
# ============================================
DATABASE_URL=postgresql://user:pass@host/db
BETTER_AUTH_SECRET=your_32_char_secret
CORS_ORIGINS=http://localhost:3000
API_V1_PREFIX=/api/v1
```

### **Frontend (.env.local)**

```bash
# ============================================
# ChatKit Configuration
# ============================================
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk_...
# Get from: https://platform.openai.com/chatkit

# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:8000

# ============================================
# Existing Phase 2 Variables
# ============================================
BETTER_AUTH_SECRET=your_32_char_secret
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 📦 Dependencies

### **Backend (pyproject.toml)**

```toml
[project]
name = "tasknest-backend"
version = "3.0.0"
requires-python = ">=3.11"

dependencies = [
    # Core Framework
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",

    # Database
    "sqlmodel>=0.0.22",
    "alembic>=1.13.0",
    "psycopg2-binary>=2.9.9",

    # Authentication
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",

    # LLM Providers
    "google-generativeai>=0.3.0",  # Gemini (DEFAULT)
    "openai>=1.54.0",               # OpenAI (OPTIONAL)

    # MCP & Tools
    "mcp>=1.0.0",
    "python-dateutil>=2.8.2",

    # Utilities
    "pydantic>=2.9.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "pytest-cov>=4.1.0",
    "httpx>=0.27.0",
]
```

### **Frontend (package.json)**

```json
{
  "name": "tasknest-frontend",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "test": "jest"
  },
  "dependencies": {
    "next": "15.5.11",
    "react": "19.1.0",
    "react-dom": "19.1.0",

    "@openai/chatkit-react": "^1.0.0",
    "@openai/chatkit": "^1.0.0",

    "better-auth": "^1.4.18",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0"
  }
}
```

---

## 🚀 Quick Start

### **1. Get API Keys**

#### **Google Gemini (FREE - Recommended)**
```bash
# 1. Go to: https://aistudio.google.com/app/apikey
# 2. Click "Create API Key"
# 3. Copy the key
# 4. Add to backend/.env:
GOOGLE_API_KEY=your_key_here
```

#### **OpenAI (Optional)**
```bash
# 1. Go to: https://platform.openai.com/api-keys
# 2. Create new secret key
# 3. Copy the key
# 4. Add to backend/.env:
OPENAI_API_KEY=sk-proj-...
```

#### **ChatKit Domain Key**
```bash
# 1. Go to: https://platform.openai.com/chatkit
# 2. Add your domain (localhost:3000 for dev)
# 3. Copy domain key
# 4. Add to frontend/.env.local:
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk_...
```

---

### **2. Install Dependencies**

```bash
# Backend
cd backend
uv add google-generativeai openai mcp python-dateutil

# Frontend
cd frontend/TaskNest
npm install @openai/chatkit-react @openai/chatkit
```

---

### **3. Run Application**

```bash
# Terminal 1: Backend
cd backend
export LLM_PROVIDER=gemini  # or openai
export GOOGLE_API_KEY=your_key
uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend/TaskNest
npm run dev
```

---

### **4. Test Chat**

```bash
# Navigate to: http://localhost:3000/chat
# Send message: "Add a task to buy milk"
# Verify: Task created and appears in dashboard
```

---

## 🔄 Switching LLM Providers

### **Use Gemini (Default, FREE)**
```bash
# backend/.env
LLM_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### **Use OpenAI (Optional, Paid)**
```bash
# backend/.env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
```

### **No Code Changes Needed!**
- Just change environment variable
- Restart backend
- Same ChatKit UI works with both

---

## 💰 Cost Comparison

| Provider | Model | Cost | Free Tier | Requests/Day |
|----------|-------|------|-----------|--------------|
| **Gemini** | 1.5 Flash | FREE | Yes | 1,500 |
| **Gemini** | 1.5 Pro | FREE | Yes | 50 |
| **OpenAI** | GPT-4o | $2.50/1M | $5 credit | ~2,000 |

**Recommendation**: Start with Gemini (FREE), switch to OpenAI if needed.

---

## 📊 Feature Comparison

| Feature | Gemini | OpenAI |
|---------|--------|--------|
| Function Calling | ✅ Yes | ✅ Yes |
| Streaming | ✅ Yes | ✅ Yes |
| Context Window | 1M tokens | 128K tokens |
| Speed | Very Fast | Fast |
| Quality | Excellent | Excellent |
| Cost | FREE | Paid |
| Rate Limits | Generous | Moderate |

---

## 🏗️ Architecture Benefits

### **1. Flexibility**
- ✅ Switch providers without code changes
- ✅ Easy to add new providers (Claude, Groq, etc.)
- ✅ Test with different models

### **2. Cost Optimization**
- ✅ Start FREE with Gemini
- ✅ Upgrade to OpenAI if needed
- ✅ Mix providers for different use cases

### **3. Risk Mitigation**
- ✅ Not locked into one provider
- ✅ Fallback options available
- ✅ Provider outages don't block development

### **4. ChatKit Compatibility**
- ✅ Same UI for all providers
- ✅ OpenAI-compatible format
- ✅ No frontend changes needed

---

## 🧪 Testing

### **Test with Gemini**
```bash
# Set environment
export LLM_PROVIDER=gemini
export GOOGLE_API_KEY=your_key

# Test
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a high priority task to finish report"}'
```

### **Test with OpenAI**
```bash
# Set environment
export LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-proj-...

# Test (same request!)
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a high priority task to finish report"}'
```

---

## 📚 Documentation

- **Architecture**: `MULTI_LLM_ARCHITECTURE.md`
- **Specification**: `spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **API Contracts**: `contracts/api-contracts.md`
- **Requirements**: `checklists/requirements.md`

---

## ✅ Implementation Checklist

### **Backend**
- [ ] Install dependencies (google-generativeai, openai, mcp)
- [ ] Create LLM provider interface
- [ ] Implement Gemini provider
- [ ] Implement OpenAI provider
- [ ] Create provider manager
- [ ] Update chat service
- [ ] Test with both providers

### **Frontend**
- [ ] Install ChatKit dependencies
- [ ] Configure ChatKit
- [ ] Create chat page
- [ ] Add navigation
- [ ] Test with both providers

### **Integration**
- [ ] Test task creation via chat
- [ ] Test task listing via chat
- [ ] Test task completion via chat
- [ ] Verify dashboard sync
- [ ] Test provider switching

---

## 🎯 Hackathon Readiness

### **Requirements Met**
- ✅ AI-powered chatbot interface
- ✅ Natural language processing
- ✅ MCP server with 5 tools
- ✅ Stateless architecture
- ✅ Conversation history
- ✅ ChatKit UI integration
- ✅ Multi-LLM support (bonus!)

### **Demo Points**
- ✅ Show both Dashboard and Chat interfaces
- ✅ Demonstrate natural language commands
- ✅ Show task creation via chat
- ✅ Show recurring task auto-generation
- ✅ Highlight FREE tier (Gemini)
- ✅ Mention flexibility (can use OpenAI too)

---

**Tech Stack Version**: 2.0 (Multi-LLM)
**Status**: ✅ Ready for Implementation
**Default Provider**: Google Gemini (FREE)
**Recommended for Hackathon**: Yes!
