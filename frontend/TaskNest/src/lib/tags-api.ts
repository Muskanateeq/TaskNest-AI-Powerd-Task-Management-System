/**
 * Tags API Functions
 *
 * Specific API functions for tag operations.
 */

import { api } from './api';
import { Tag, TagCreateRequest, TagUpdateRequest } from './types';

/**
 * Get all tags
 */
export async function getTags(): Promise<Tag[]> {
  return api.get<Tag[]>('/tags');
}

/**
 * Get a single tag by ID
 */
export async function getTag(id: number): Promise<Tag> {
  return api.get<Tag>(`/tags/${id}`);
}

/**
 * Create a new tag
 */
export async function createTag(data: TagCreateRequest): Promise<Tag> {
  return api.post<Tag>('/tags', data);
}

/**
 * Update an existing tag
 */
export async function updateTag(id: number, data: TagUpdateRequest): Promise<Tag> {
  return api.patch<Tag>(`/tags/${id}`, data);
}

/**
 * Delete a tag
 */
export async function deleteTag(id: number): Promise<void> {
  return api.delete<void>(`/tags/${id}`);
}
