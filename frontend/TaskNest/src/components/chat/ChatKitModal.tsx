/**
 * Custom Chat Modal Component - TaskNest Theme
 *
 * Dark golden theme matching TaskNest design system
 * Colors: Black (#000000), Gamboge (#E49B0F), White (#FFFFFF)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations, deleteConversation, type Conversation } from '@/lib/chatApi';

/**
 * Chat Modal Props
 */
interface ChatKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Message Interface
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Custom Chat Modal Component
 */
export default function ChatKitModal({ isOpen, onClose }: ChatKitModalProps) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle escape key
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  /**
   * Send message to backend with streaming
   */
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const event = JSON.parse(data);

              if (event.type === 'conversation_id') {
                setConversationId(event.conversation_id);
              } else if (event.type === 'content') {
                // Append content to assistant message
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + event.content }
                      : msg
                  )
                );
              } else if (event.type === 'tool_call') {
                // Show tool execution status
                if (event.status === 'executing') {
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + `\n\n🔧 Executing ${event.tool}...` }
                        : msg
                    )
                  );
                }
              } else if (event.type === 'done') {
                // Streaming complete
                setIsLoading(false);
              } else if (event.type === 'error') {
                throw new Error(event.error);
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', parseError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');

      // Update assistant message with error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: `Error: ${err instanceof Error ? err.message : 'Failed to send message'}. Please try again.` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Load conversation history
   */
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const token = await getToken();
      if (!token) return;

      const data = await getConversations(token, 50, 0);
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  /**
   * Toggle history panel
   */
  const toggleHistory = () => {
    if (!isHistoryOpen) {
      loadHistory();
    }
    setIsHistoryOpen(!isHistoryOpen);
  };

  /**
   * Delete conversation
   */
  const handleDeleteConversation = async (convId: number) => {
    try {
      const token = await getToken();
      if (!token) return;

      await deleteConversation(token, convId);
      setConversations(prev => prev.filter(c => c.id !== convId));

      // If current conversation is deleted, start new chat
      if (conversationId === convId) {
        setConversationId(null);
        setMessages([]);
      }

      setDeleteDialogOpen(false);
      setConversationToDelete(null);
      setSuccessMessage(`Conversation ${convId} deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  /**
   * Open delete dialog
   */
  const openDeleteDialog = (convId: number) => {
    setConversationToDelete(convId);
    setDeleteDialogOpen(true);
  };

  /**
   * Start new conversation
   */
  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setIsHistoryOpen(false);
  };

  /**
   * Don't render if not open
   */
  if (!isOpen) {
    return null;
  }

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="chat-modal-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="header-text">
              <h2>AI Assistant</h2>
              <p>Manage your tasks with natural language</p>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={toggleHistory} className="history-button" aria-label="Conversation history" title="History">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button onClick={onClose} className="close-button" aria-label="Close chat">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-banner">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* History Panel */}
        {isHistoryOpen && (
          <div className="history-panel-modal">
            <div className="history-panel-header">
              <h3>Conversation History</h3>
              <button onClick={startNewChat} className="btn-new-chat-modal" title="New chat">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="history-panel-content">
              {isLoadingHistory ? (
                <div className="history-loading">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="history-empty">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div className="history-list-modal">
                  {conversations.map(conversation => (
                    <div key={conversation.id} className="history-item-modal">
                      <div className="history-item-icon-modal">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                      </div>
                      <div className="history-item-info-modal">
                        <div className="history-item-title-modal">Conversation {conversation.id}</div>
                        <div className="history-item-date-modal">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => openDeleteDialog(conversation.id)}
                        className="btn-delete-history-modal"
                        title="Delete"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3>Start a conversation</h3>
              <p>Try: &quot;Add a task to buy groceries tomorrow&quot;</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                  <div className="message-avatar">
                    {message.role === 'user' ? (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          {error && (
            <div className="chat-error-banner">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <div className="chat-input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (e.g., 'Add a task to buy groceries tomorrow')"
              className="chat-input"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="chat-send-button"
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="delete-dialog-overlay-modal" onClick={() => setDeleteDialogOpen(false)}>
          <div className="delete-dialog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-dialog-icon-modal">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3>Delete Conversation?</h3>
            <p>This action cannot be undone.</p>
            <div className="delete-dialog-actions-modal">
              <button onClick={() => setDeleteDialogOpen(false)} className="btn-cancel-modal">
                Cancel
              </button>
              <button
                onClick={() => conversationToDelete && handleDeleteConversation(conversationToDelete)}
                className="btn-delete-modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Overlay */
        .chat-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Modal Container */
        .chat-modal-container {
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(228, 155, 15, 0.3);
          width: 100%;
          max-width: 500px;
          height: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Modal Header */
        .chat-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(228, 155, 15, 0.2);
          background: rgba(228, 155, 15, 0.05);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .history-button {
          width: 36px;
          height: 36px;
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.2);
          border-radius: 8px;
          color: #E49B0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .history-button:hover {
          background: rgba(228, 155, 15, 0.2);
          border-color: #E49B0F;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          flex-shrink: 0;
        }

        .header-text h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #E49B0F, #F5B942);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-text p {
          font-size: 0.8rem;
          margin: 0.25rem 0 0;
          color: #A0A0A0;
        }

        .close-button {
          width: 36px;
          height: 36px;
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.2);
          border-radius: 8px;
          color: #E49B0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .close-button:hover {
          background: rgba(228, 155, 15, 0.2);
          border-color: #E49B0F;
          transform: rotate(90deg);
        }

        /* Success Banner */
        .success-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          border-bottom: 1px solid rgba(34, 197, 94, 0.3);
          color: #22C55E;
          font-size: 0.875rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* History Panel in Modal */
        .history-panel-modal {
          border-bottom: 1px solid rgba(228, 155, 15, 0.2);
          background: rgba(0, 0, 0, 0.5);
          max-height: 200px;
          display: flex;
          flex-direction: column;
        }

        .history-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(228, 155, 15, 0.2);
        }

        .history-panel-header h3 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #E49B0F;
          margin: 0;
        }

        .btn-new-chat-modal {
          width: 28px;
          height: 28px;
          background: rgba(228, 155, 15, 0.15);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 6px;
          color: #E49B0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-new-chat-modal:hover {
          background: rgba(228, 155, 15, 0.25);
        }

        .history-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .history-panel-content::-webkit-scrollbar {
          width: 4px;
        }

        .history-panel-content::-webkit-scrollbar-track {
          background: rgba(228, 155, 15, 0.05);
        }

        .history-panel-content::-webkit-scrollbar-thumb {
          background: rgba(228, 155, 15, 0.3);
          border-radius: 2px;
        }

        .history-loading,
        .history-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
          text-align: center;
          color: #A0A0A0;
        }

        .history-empty svg {
          color: #E49B0F;
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .history-empty p {
          font-size: 0.8125rem;
          margin: 0;
        }

        .history-list-modal {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .history-item-modal {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(228, 155, 15, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .history-item-modal:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(228, 155, 15, 0.3);
        }

        .history-item-icon-modal {
          width: 28px;
          height: 28px;
          background: rgba(228, 155, 15, 0.15);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E49B0F;
          flex-shrink: 0;
        }

        .history-item-info-modal {
          flex: 1;
          min-width: 0;
        }

        .history-item-title-modal {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .history-item-date-modal {
          font-size: 0.6875rem;
          color: #666666;
        }

        .btn-delete-history-modal {
          width: 24px;
          height: 24px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          color: #EF4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0;
          flex-shrink: 0;
        }

        .history-item-modal:hover .btn-delete-history-modal {
          opacity: 1;
        }

        .btn-delete-history-modal:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }

        /* Delete Dialog in Modal */
        .delete-dialog-overlay-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          animation: fadeIn 0.2s ease-out;
        }

        .delete-dialog-modal {
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3);
          padding: 1.5rem;
          max-width: 360px;
          width: 90%;
          animation: slideUp 0.3s ease-out;
        }

        .delete-dialog-icon-modal {
          width: 48px;
          height: 48px;
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EF4444;
          margin: 0 auto 1rem;
        }

        .delete-dialog-modal h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.5rem;
          text-align: center;
        }

        .delete-dialog-modal p {
          font-size: 0.875rem;
          color: #A0A0A0;
          margin: 0 0 1.5rem;
          text-align: center;
        }

        .delete-dialog-actions-modal {
          display: flex;
          gap: 0.75rem;
        }

        .btn-cancel-modal,
        .btn-delete-modal {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel-modal {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .btn-cancel-modal:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-delete-modal {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #FFFFFF;
        }

        .btn-delete-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.6);
        }

        /* Messages Area */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #000000;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: rgba(228, 155, 15, 0.05);
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(228, 155, 15, 0.3);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(228, 155, 15, 0.5);
        }

        /* Empty State */
        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #A0A0A0;
        }

        .chat-empty svg {
          color: #E49B0F;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .chat-empty h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0 0 0.5rem;
        }

        .chat-empty p {
          font-size: 0.875rem;
          margin: 0;
        }

        /* Message */
        .message {
          display: flex;
          gap: 0.75rem;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-user .message-avatar {
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          color: #000000;
        }

        .message-assistant .message-avatar {
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.3);
          color: #E49B0F;
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .message-user .message-content {
          align-items: flex-end;
        }

        .message-text {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 85%;
          word-wrap: break-word;
        }

        .message-user .message-text {
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          color: #000000;
          border-bottom-right-radius: 4px;
        }

        .message-assistant .message-text {
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.2);
          color: #FFFFFF;
          border-bottom-left-radius: 4px;
        }

        .message-time {
          font-size: 0.75rem;
          color: #666;
          padding: 0 0.5rem;
        }

        /* Input Area */
        .chat-input-container {
          border-top: 1px solid rgba(228, 155, 15, 0.2);
          background: rgba(228, 155, 15, 0.05);
          padding: 1rem;
        }

        .chat-error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #EF4444;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .chat-input-wrapper {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: #FFFFFF;
          font-size: 0.875rem;
          font-family: inherit;
          resize: none;
          max-height: 120px;
          transition: all 0.2s;
        }

        .chat-input:focus {
          outline: none;
          border-color: #E49B0F;
          background: rgba(228, 155, 15, 0.15);
        }

        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-send-button {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          border: none;
          border-radius: 12px;
          color: #000000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .chat-send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(228, 155, 15, 0.6);
        }

        .chat-send-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .chat-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .chat-modal-container {
            max-width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
            border: none;
          }

          .chat-modal-header {
            padding: 1rem;
          }

          .header-icon {
            width: 40px;
            height: 40px;
          }

          .header-text h2 {
            font-size: 1.125rem;
          }

          .header-text p {
            font-size: 0.75rem;
          }

          .close-button {
            width: 32px;
            height: 32px;
          }

          .chat-messages {
            padding: 1rem;
          }
        }

        /* Accessibility */
        .close-button:focus-visible,
        .chat-send-button:focus-visible {
          outline: 2px solid #E49B0F;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
