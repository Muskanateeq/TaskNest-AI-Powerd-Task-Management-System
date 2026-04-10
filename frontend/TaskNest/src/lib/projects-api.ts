/**
 * Projects API Client
 *
 * Handles all project-related API requests
 */

import { api } from './api';
import { Project, ProjectCreateRequest, ProjectUpdateRequest } from './types';

/**
 * Create a new project
 */
export async function createProject(data: ProjectCreateRequest): Promise<Project> {
  return api.post<Project>('/projects', data);
}

/**
 * Get all projects for current user
 */
export async function getUserProjects(status?: string): Promise<Project[]> {
  const params = status ? `?status=${status}` : '';
  return api.get<Project[]>(`/projects${params}`);
}

/**
 * Get project by ID
 */
export async function getProject(projectId: number): Promise<Project> {
  return api.get<Project>(`/projects/${projectId}`);
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: number,
  data: ProjectUpdateRequest
): Promise<Project> {
  return api.put<Project>(`/projects/${projectId}`, data);
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: number): Promise<void> {
  return api.delete<void>(`/projects/${projectId}`);
}
