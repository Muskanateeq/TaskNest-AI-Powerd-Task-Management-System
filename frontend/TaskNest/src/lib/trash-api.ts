/**
 * Trash API Functions
 *
 * API functions for trash/recycle bin operations.
 */

import { api } from './api';
import { Task } from './types';

/**
 * Get Trash Query Parameters
 */
interface GetTrashParams {
  limit?: number;
  offset?: number;
}

/**
 * Get all deleted tasks (trash)
 */
export async function getTrash(params?: GetTrashParams): Promise<Task[]> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/trash?${queryString}` : '/trash';

  return api.get<Task[]>(endpoint);
}

/**
 * Restore a deleted task from trash
 */
export async function restoreTask(taskId: number): Promise<Task> {
  return api.post<Task>(`/trash/${taskId}/restore`, {});
}

/**
 * Permanently delete a task from trash
 */
export async function permanentDeleteTask(taskId: number): Promise<void> {
  return api.delete<void>(`/trash/${taskId}`);
}

/**
 * Empty trash (permanently delete all tasks in trash)
 */
export async function emptyTrash(): Promise<{ deleted_count: number; message: string }> {
  return api.delete<{ deleted_count: number; message: string }>('/trash');
}
