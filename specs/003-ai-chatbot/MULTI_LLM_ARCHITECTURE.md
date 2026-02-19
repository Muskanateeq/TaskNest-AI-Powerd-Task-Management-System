# Phase 3: Multi-LLM Architecture Design

**Feature ID**: 003-ai-chatbot
**Version**: 2.0 (Updated for Multi-LLM Support)
**Last Updated**: 2026-02-17

---

## Overview

This architecture supports multiple LLM providers with a unified interface. Users can choose between:
- **Google Gemini** (default, FREE)
- **OpenAI GPT-4o** (optional, paid)
- Easy to add more providers (Claude, Groq, etc.)

**ChatKit UI works with all providers** through OpenAI-compatible format.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ChatKit UI (OpenAI Compatible)                      │  │
│  │  - Works with any OpenAI-format API                  │  │
│  │  - Same UI for all LLM providers                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ HTTP Request
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chat Endpoint (/api/v1/chat)                        │  │
│  │  - Receives user message                             │  │
│  │  - Routes to appropriate LLM provider                │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LLM Provider Manager                                │  │
│  │  - Reads LLM_PROVIDER env variable                   │  │
│  │  - Routes to correct provider                        │  │
│  │  - Default: "gemini"                                 │  │
│  └────────┬─────────────────────────┬───────────────────┘  │
│           │                         │                        │
│           ▼                         ▼                        │
│  ┌─────────────────┐      ┌─────────────────┐              │
│  │ Gemini Provider │      │ OpenAI Provider │              │
│  │ (DEFAULT, FREE) │      │ (OPTIONAL)      │              │
│  └────────┬────────┘      └────────┬────────┘              │
│           │                         │                        │
│           │    Both implement       │                        │
│           │    same interface       │                        │
│           │                         │                        │
│           └────────┬────────────────┘                        │
│                    │                                         │
│                    ▼                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MCP Server (5 Tools)                                │  │
│  │  - add_task                                          │  │
│  │  - list_tasks                                        │  │
│  │  - complete_task                                     │  │
│  │  - update_task                                       │  │
│  │  - delete_task                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Backend Implementation

### 1. LLM Provider Interface (Abstract Base Class)

```python
# backend/src/llm/base_provider.py
from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncIterator

class LLMProvider(ABC):
    """
    Abstract base class for LLM providers.
    All providers must implement this interface.
    """

    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        stream: bool = False
    ) -> Dict[str, Any] | AsyncIterator[Dict[str, Any]]:
        """
        Generate chat completion with tool calling support.

        Args:
            messages: Conversation history
            tools: Available tools (MCP format)
            stream: Whether to stream response

        Returns:
            Response in OpenAI-compatible format
        """
        pass

    @abstractmethod
    def format_tools(self, mcp_tools: List[Dict]) -> List[Dict]:
        """
        Convert MCP tools to provider-specific format.
        """
        pass

    @abstractmethod
    def parse_tool_calls(self, response: Dict) -> List[Dict]:
        """
        Extract tool calls from provider response.
        """
        pass
```

---

### 2. Gemini Provider (Default, FREE)

```python
# backend/src/llm/gemini_provider.py
import os
import google.generativeai as genai
from typing import List, Dict, Any
from .base_provider import LLMProvider

class GeminiProvider(LLMProvider):
    """
    Google Gemini provider (FREE tier available).
    Default provider for the application.
    """

    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")

        genai.configure(api_key=api_key)
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.model = None  # Initialized per chat session

    def format_tools(self, mcp_tools: List[Dict]) -> List[Dict]:
        """
        Convert MCP tools to Gemini function calling format.
        """
        gemini_tools = []
        for tool in mcp_tools:
            gemini_tools.append({
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["parameters"]
            })
        return gemini_tools

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Generate chat completion using Gemini.
        Returns OpenAI-compatible format.
        """
        # Convert messages to Gemini format
        gemini_messages = self._convert_messages(messages)

        # Format tools
        gemini_tools = self.format_tools(tools)

        # Create model with tools
        model = genai.GenerativeModel(
            model_name=self.model_name,
            tools=gemini_tools,
            system_instruction=self._get_system_prompt(messages)
        )

        # Start chat
        chat = model.start_chat(history=gemini_messages[:-1])

        # Send message
        response = chat.send_message(gemini_messages[-1]["parts"][0]["text"])

        # Convert to OpenAI format
        return self._to_openai_format(response)

    def _convert_messages(self, messages: List[Dict]) -> List[Dict]:
        """Convert OpenAI format to Gemini format."""
        gemini_messages = []
        for msg in messages:
            if msg["role"] == "system":
                continue  # System prompt handled separately

            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        return gemini_messages

    def _get_system_prompt(self, messages: List[Dict]) -> str:
        """Extract system prompt from messages."""
        for msg in messages:
            if msg["role"] == "system":
                return msg["content"]
        return ""

    def _to_openai_format(self, gemini_response) -> Dict[str, Any]:
        """
        Convert Gemini response to OpenAI-compatible format.
        This allows ChatKit to work seamlessly.
        """
        # Check for function calls
        tool_calls = []
        content = ""

        for part in gemini_response.candidates[0].content.parts:
            if hasattr(part, 'function_call'):
                tool_calls.append({
                    "id": f"call_{hash(part.function_call.name)}",
                    "type": "function",
                    "function": {
                        "name": part.function_call.name,
                        "arguments": dict(part.function_call.args)
                    }
                })
            elif hasattr(part, 'text'):
                content += part.text

        # Return OpenAI-compatible format
        return {
            "id": f"gemini-{gemini_response.candidates[0].token_count}",
            "object": "chat.completion",
            "model": self.model_name,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": content,
                    "tool_calls": tool_calls if tool_calls else None
                },
                "finish_reason": "stop" if not tool_calls else "tool_calls"
            }]
        }

    def parse_tool_calls(self, response: Dict) -> List[Dict]:
        """Extract tool calls from response."""
        if response["choices"][0]["message"].get("tool_calls"):
            return response["choices"][0]["message"]["tool_calls"]
        return []
```

---

### 3. OpenAI Provider (Optional)

```python
# backend/src/llm/openai_provider.py
import os
from openai import AsyncOpenAI
from typing import List, Dict, Any
from .base_provider import LLMProvider

class OpenAIProvider(LLMProvider):
    """
    OpenAI GPT provider (paid, optional).
    Used when user wants to use OpenAI instead of Gemini.
    """

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment")

        self.client = AsyncOpenAI(api_key=api_key)
        self.model_name = os.getenv("OPENAI_MODEL", "gpt-4o")

    def format_tools(self, mcp_tools: List[Dict]) -> List[Dict]:
        """
        MCP tools are already in OpenAI format.
        Just return as-is.
        """
        return [{
            "type": "function",
            "function": tool
        } for tool in mcp_tools]

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        tools: List[Dict[str, Any]],
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Generate chat completion using OpenAI.
        Already in OpenAI format, so no conversion needed.
        """
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            tools=self.format_tools(tools),
            stream=stream
        )

        # Convert to dict
        return response.model_dump()

    def parse_tool_calls(self, response: Dict) -> List[Dict]:
        """Extract tool calls from response."""
        if response["choices"][0]["message"].get("tool_calls"):
            return response["choices"][0]["message"]["tool_calls"]
        return []
```

---

### 4. Provider Manager (Factory Pattern)

```python
# backend/src/llm/provider_manager.py
import os
from typing import Dict, Type
from .base_provider import LLMProvider
from .gemini_provider import GeminiProvider
from .openai_provider import OpenAIProvider

class ProviderManager:
    """
    Manages LLM providers and routes requests to the correct one.
    """

    # Registry of available providers
    PROVIDERS: Dict[str, Type[LLMProvider]] = {
        "gemini": GeminiProvider,
        "openai": OpenAIProvider,
    }

    @classmethod
    def get_provider(cls) -> LLMProvider:
        """
        Get the configured LLM provider.
        Reads from LLM_PROVIDER environment variable.
        Defaults to "gemini" (FREE).
        """
        provider_name = os.getenv("LLM_PROVIDER", "gemini").lower()

        if provider_name not in cls.PROVIDERS:
            raise ValueError(
                f"Unknown LLM provider: {provider_name}. "
                f"Available: {list(cls.PROVIDERS.keys())}"
            )

        provider_class = cls.PROVIDERS[provider_name]
        return provider_class()

    @classmethod
    def register_provider(cls, name: str, provider_class: Type[LLMProvider]):
        """
        Register a new LLM provider.
        Allows easy extension with new providers.
        """
        cls.PROVIDERS[name] = provider_class
```

---

### 5. Updated Chat Service

```python
# backend/src/services/chat_service.py
from typing import Dict, Any
from .conversation_service import ConversationService
from ..llm.provider_manager import ProviderManager
from ..mcp.server import TaskMCPServer

class ChatService:
    """
    Chat service that works with any LLM provider.
    """

    def __init__(self):
        self.conversation_service = ConversationService()
        self.mcp_server = TaskMCPServer()
        # Get configured provider (Gemini by default)
        self.llm_provider = ProviderManager.get_provider()

    async def process_message(
        self,
        user_id: str,
        conversation_id: int | None,
        message: str
    ) -> Dict[str, Any]:
        """
        Process user message using configured LLM provider.
        """
        # 1. Get or create conversation
        if conversation_id:
            conversation = await self.conversation_service.get_conversation(
                conversation_id, user_id
            )
        else:
            conversation = await self.conversation_service.create_conversation(user_id)

        # 2. Store user message
        await self.conversation_service.add_message(
            conversation.id, user_id, "user", message
        )

        # 3. Load conversation history
        messages = await self._build_messages(conversation.id)

        # 4. Get MCP tools
        tools = self.mcp_server.get_tools()

        # 5. Call LLM provider (works with Gemini or OpenAI)
        response = await self.llm_provider.chat_completion(
            messages=messages,
            tools=tools
        )

        # 6. Handle tool calls
        tool_calls = self.llm_provider.parse_tool_calls(response)
        tool_results = []

        for tool_call in tool_calls:
            result = await self.mcp_server.execute_tool(
                tool_call["function"]["name"],
                tool_call["function"]["arguments"],
                user_id
            )
            tool_results.append({
                "tool": tool_call["function"]["name"],
                "arguments": tool_call["function"]["arguments"],
                "result": result
            })

        # 7. Get final response
        assistant_message = response["choices"][0]["message"]["content"]

        # 8. Store assistant response
        await self.conversation_service.add_message(
            conversation.id, user_id, "assistant", assistant_message
        )

        # 9. Return response
        return {
            "conversation_id": conversation.id,
            "response": assistant_message,
            "tool_calls": tool_results
        }

    async def _build_messages(self, conversation_id: int) -> List[Dict]:
        """Build message history for LLM."""
        messages = [
            {
                "role": "system",
                "content": self._get_system_prompt()
            }
        ]

        # Load last 20 messages
        history = await self.conversation_service.get_messages(
            conversation_id, limit=20
        )

        for msg in history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        return messages

    def _get_system_prompt(self) -> str:
        """System prompt for task management."""
        return """
        You are TaskNest AI, a helpful assistant for managing tasks.

        Your capabilities:
        - Create tasks with title, description, priority, due date, and recurrence
        - List tasks with various filters
        - Mark tasks as complete (recurring tasks auto-generate)
        - Update task details
        - Delete tasks

        Guidelines:
        - Always confirm actions taken
        - Be concise and friendly
        - Ask for clarification if intent is unclear
        """
```

---

## Environment Configuration

### Backend `.env`

```bash
# LLM Provider Configuration
# Options: "gemini" (default, FREE) or "openai" (paid)
LLM_PROVIDER=gemini

# Google Gemini (DEFAULT - FREE)
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro

# OpenAI (OPTIONAL - only if using OpenAI)
# OPENAI_API_KEY=sk-proj-...
# OPENAI_MODEL=gpt-4o

# Existing Phase 2 variables
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
```

### Frontend `.env.local`

```bash
# ChatKit Configuration (works with both providers)
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk_...
NEXT_PUBLIC_API_URL=http://localhost:8000

# Existing Phase 2 variables
BETTER_AUTH_SECRET=...
```

---

## Frontend Implementation (ChatKit)

ChatKit works with both providers because backend returns OpenAI-compatible format!

```typescript
// frontend/TaskNest/src/app/(app)/chat/page.tsx
'use client';

import { useChatKit } from '@openai/chatkit-react';
import { ChatKit } from '@openai/chatkit-react';

export default function ChatPage() {
  const { control } = useChatKit({
    api: {
      // ChatKit calls our backend, which handles LLM routing
      async getClientSecret() {
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
    theme: 'dark',
    locale: 'en',
  });

  return (
    <div className="chat-page">
      <h1>AI Chat Assistant</h1>
      <ChatKit control={control} className="h-[600px] w-full" />
    </div>
  );
}
```

**ChatKit doesn't know or care which LLM is being used!** It just sends messages to our backend, which routes to the configured provider.

---

## Switching Between Providers

### Use Gemini (Default, FREE)
```bash
# backend/.env
LLM_PROVIDER=gemini
GOOGLE_API_KEY=your_google_api_key
```

### Use OpenAI (Optional, Paid)
```bash
# backend/.env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
```

### Add More Providers (Future)
```python
# backend/src/llm/claude_provider.py
class ClaudeProvider(LLMProvider):
    # Implement interface
    pass

# Register in provider_manager.py
ProviderManager.register_provider("claude", ClaudeProvider)

# Use it
# backend/.env
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Benefits of This Architecture

### 1. **Flexibility**
- ✅ Easy to switch providers
- ✅ Easy to add new providers
- ✅ No code changes needed (just env variable)

### 2. **Cost Optimization**
- ✅ Default to FREE (Gemini)
- ✅ Upgrade to paid if needed (OpenAI)
- ✅ Mix and match based on use case

### 3. **ChatKit Compatibility**
- ✅ ChatKit works with all providers
- ✅ Same UI for all LLMs
- ✅ No frontend changes needed

### 4. **Maintainability**
- ✅ Clean abstraction
- ✅ Single interface for all providers
- ✅ Easy to test
- ✅ Easy to extend

---

## Updated Dependencies

### Backend
```toml
# pyproject.toml
[project.dependencies]
fastapi = "^0.115.0"
sqlmodel = "^0.0.22"
google-generativeai = "^0.3.0"  # For Gemini (default)
openai = "^1.54.0"               # For OpenAI (optional)
mcp = "^1.0.0"
```

### Frontend
```json
{
  "dependencies": {
    "next": "15.5.11",
    "@openai/chatkit-react": "^1.0.0",
    "@openai/chatkit": "^1.0.0",
    "better-auth": "^1.4.18"
  }
}
```

---

## Testing

### Test with Gemini
```bash
# Set environment
export LLM_PROVIDER=gemini
export GOOGLE_API_KEY=your_key

# Start backend
uvicorn src.main:app --reload

# Test
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message": "Add a task to buy milk"}'
```

### Test with OpenAI
```bash
# Set environment
export LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-proj-...

# Start backend (same code!)
uvicorn src.main:app --reload

# Test (same request!)
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message": "Add a task to buy milk"}'
```

---

**Architecture Version**: 2.0 (Multi-LLM Support)
**Status**: Ready for Implementation
**Default Provider**: Google Gemini (FREE)
**Optional Providers**: OpenAI, Claude, Groq, etc.
