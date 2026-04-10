/**
 * Tasks API Functions
 *
 * Specific API functions for task operations.
 */

import { api } from './api';
import { Task, TaskCreateRequest, TaskUpdateRequest } from './types';

/**
 * Get Tasks Query Parameters
 */
interface GetTasksParams {
  search?: string;
  priority?: string;
  status?: string;
  tag?: string;
  sort?: string;
}

/**
 * Get all tasks with optional filters
 */
export async function getTasks(params?: GetTasksParams): Promise<Task[]> {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.append('search', params.search);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.tag) queryParams.append('tag', params.tag);
  if (params?.sort) queryParams.append('sort', params.sort);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

  return api.get<Task[]>(endpoint);
}

/**
 * Get a single task by ID
 */
export async function getTask(id: number): Promise<Task> {
  return api.get<Task>(`/tasks/${id}`);
}

/**
 * Create a new task
 */
export async function createTask(data: TaskCreateRequest): Promise<Task> {
  return api.post<Task>('/tasks', data);
}

/**
 * Update an existing task
 */
export async function updateTask(id: number, data: TaskUpdateRequest): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}`, data);
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<void> {
  return api.delete<void>(`/tasks/${id}`);
}

/**
 * Toggle task completion status
 */
export async function toggleTaskCompletion(id: number): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}/toggle`);
}
