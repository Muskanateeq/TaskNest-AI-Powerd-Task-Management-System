/**
 * Floating Chat Button Component - TaskNest Theme
 *
 * Dark golden theme matching TaskNest design system
 * Colors: Black (#000000), Gamboge (#E49B0F), White (#FFFFFF)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations, deleteConversation, type Conversation } from '@/lib/chatApi';

/**
 * ChatKit Dynamic Import
 */
const ChatKitModal = React.lazy(() => import('./ChatKitModal'));

/**
 * Floating Chat Button Component
 */
export default function FloatingChatButton() {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  const handleDeleteConversation = async (conversationId: number) => {
    try {
      const token = await getToken();
      if (!token) return;

      await deleteConversation(token, conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  /**
   * Open delete dialog
   */
  const openDeleteDialog = (conversationId: number) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="floating-chat-container">
        {/* History Button */}
        <button
          onClick={toggleHistory}
          className="floating-history-button"
          aria-label="Conversation History"
          title="History"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Main Chat Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="floating-chat-button"
          aria-label="Open AI Assistant"
          title="AI Assistant"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="chat-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="button-pulse"></span>
        </button>
      </div>

      {/* Tooltip */}
      <div className="floating-chat-tooltip">AI Assistant</div>

      {/* History Panel */}
      {isHistoryOpen && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Conversation History</h3>
            <button onClick={() => setIsHistoryOpen(false)} className="btn-close-history">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="history-content">
            {isLoadingHistory ? (
              <div className="history-loading">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="history-empty">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className="history-list">
                {conversations.map(conversation => (
                  <div key={conversation.id} className="history-item">
                    <div className="history-item-icon">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <div className="history-item-info">
                      <div className="history-item-title">Conversation {conversation.id}</div>
                      <div className="history-item-date">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => openDeleteDialog(conversation.id)}
                      className="btn-delete-history"
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

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="delete-dialog-overlay" onClick={() => setDeleteDialogOpen(false)}>
          <div className="delete-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-dialog-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3>Delete Conversation?</h3>
            <p>This action cannot be undone.</p>
            <div className="delete-dialog-actions">
              <button onClick={() => setDeleteDialogOpen(false)} className="btn-cancel">
                Cancel
              </button>
              <button
                onClick={() => conversationToDelete && handleDeleteConversation(conversationToDelete)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ChatKitModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </React.Suspense>
      )}

      <style jsx>{`
        /* Floating Container */
        .floating-chat-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 9998;
        }

        /* History Button */
        .floating-history-button {
          width: 48px;
          height: 48px;
          background: rgba(228, 155, 15, 0.15);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 50%;
          color: #E49B0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(228, 155, 15, 0.2);
        }

        .floating-history-button:hover {
          background: rgba(228, 155, 15, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(228, 155, 15, 0.4);
        }

        /* Floating Button */
        .floating-chat-button {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          color: #000000;
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 14px 0 rgba(228, 155, 15, 0.39);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .floating-chat-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px 0 rgba(228, 155, 15, 0.6);
        }

        .floating-chat-button:active {
          transform: translateY(-2px);
        }

        .chat-icon {
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .floating-chat-button:hover .chat-icon {
          transform: scale(1.1);
        }

        /* Pulse Animation */
        .button-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #E49B0F 0%, #F5B942 100%);
          opacity: 0.6;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        /* Tooltip */
        .floating-chat-tooltip {
          position: fixed;
          bottom: 2.25rem;
          right: 5.5rem;
          background: rgba(10, 10, 10, 0.95);
          color: #E49B0F;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 9997;
          border: 1px solid rgba(228, 155, 15, 0.3);
          box-shadow: 0 4px 14px 0 rgba(228, 155, 15, 0.2);
        }

        .floating-chat-button:hover + .floating-chat-tooltip {
          opacity: 1;
        }

        /* History Panel */
        .history-panel {
          position: fixed;
          bottom: 2rem;
          right: 6rem;
          width: 320px;
          max-height: 500px;
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(228, 155, 15, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(228, 155, 15, 0.2);
          background: rgba(228, 155, 15, 0.05);
        }

        .history-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #E49B0F;
          margin: 0;
        }

        .btn-close-history {
          width: 28px;
          height: 28px;
          background: rgba(228, 155, 15, 0.1);
          border: 1px solid rgba(228, 155, 15, 0.2);
          border-radius: 6px;
          color: #E49B0F;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-close-history:hover {
          background: rgba(228, 155, 15, 0.2);
          transform: rotate(90deg);
        }

        .history-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .history-content::-webkit-scrollbar {
          width: 6px;
        }

        .history-content::-webkit-scrollbar-track {
          background: rgba(228, 155, 15, 0.05);
        }

        .history-content::-webkit-scrollbar-thumb {
          background: rgba(228, 155, 15, 0.3);
          border-radius: 3px;
        }

        .history-loading,
        .history-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
          color: #A0A0A0;
        }

        .history-empty svg {
          color: #E49B0F;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(228, 155, 15, 0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(228, 155, 15, 0.3);
        }

        .history-item-icon {
          width: 32px;
          height: 32px;
          background: rgba(228, 155, 15, 0.15);
          border: 1px solid rgba(228, 155, 15, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E49B0F;
          flex-shrink: 0;
        }

        .history-item-info {
          flex: 1;
          min-width: 0;
        }

        .history-item-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .history-item-date {
          font-size: 0.75rem;
          color: #666666;
        }

        .btn-delete-history {
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

        .history-item:hover .btn-delete-history {
          opacity: 1;
        }

        .btn-delete-history:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }

        /* Delete Dialog */
        .delete-dialog-overlay {
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
          z-index: 10000;
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

        .delete-dialog {
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3);
          padding: 1.5rem;
          max-width: 360px;
          width: 90%;
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

        .delete-dialog-icon {
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

        .delete-dialog h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.5rem;
          text-align: center;
        }

        .delete-dialog p {
          font-size: 0.875rem;
          color: #A0A0A0;
          margin: 0 0 1.5rem;
          text-align: center;
        }

        .delete-dialog-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-cancel,
        .btn-delete {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-delete {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: #FFFFFF;
        }

        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.6);
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .floating-chat-button {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 56px;
            height: 56px;
          }

          .floating-chat-tooltip {
            display: none;
          }
        }

        /* Accessibility */
        .floating-chat-button:focus-visible {
          outline: 2px solid #E49B0F;
          outline-offset: 4px;
        }
      `}</style>
    </>
  );
}
