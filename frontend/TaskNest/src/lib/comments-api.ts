/**
 * Comments API Client
 *
 * Handles all comment-related API requests
 */

import { api } from './api';
import { Comment, CommentCreateRequest } from './types';

/**
 * Create a new comment on a task
 */
export async function createComment(
  taskId: number,
  data: CommentCreateRequest
): Promise<Comment> {
  return api.post<Comment>(`/comments/tasks/${taskId}/comments`, data);
}

/**
 * Get all comments for a task
 */
export async function getTaskComments(taskId: number): Promise<Comment[]> {
  return api.get<Comment[]>(`/comments/tasks/${taskId}/comments`);
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: number,
  content: string
): Promise<Comment> {
  return api.put<Comment>(`/comments/${commentId}`, { content });
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number): Promise<void> {
  return api.delete<void>(`/comments/${commentId}`);
}
