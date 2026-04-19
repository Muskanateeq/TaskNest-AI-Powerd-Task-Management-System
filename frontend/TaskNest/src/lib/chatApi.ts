/**
 * Chat API Service
 * Handles all chat-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface ChatResponse {
  conversation_id: number;
  message: string;
  tool_calls?: Array<{
    tool: string;
    arguments: Record<string, unknown>;
    result: unknown;
  }>;
  created_at: string;
}

/**
 * Send a message to the AI assistant (non-streaming)
 */
export async function sendMessage(
  token: string,
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

/**
 * Send a message with streaming response
 * Returns an async iterator for SSE events
 */
export async function* sendMessageStream(
  token: string,
  message: string,
  conversationId?: number
): AsyncGenerator<Record<string, unknown>, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/stream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const event = JSON.parse(data);
          yield event;
        } catch (e) {
          console.error('Failed to parse SSE event:', e);
        }
      }
    }
  }
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(
  token: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ conversations: Conversation[]; total: number }> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat/conversations?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return response.json();
}

/**
 * Get conversation history with messages
 */
export async function getConversationHistory(
  token: string,
  conversationId: number,
  limit: number = 50,
  offset: number = 0
): Promise<{
  conversation: Conversation;
  messages: Message[];
  total: number;
  has_more: boolean;
}> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversation history');
  }

  return response.json();
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  token: string,
  conversationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete conversation');
  }
}
