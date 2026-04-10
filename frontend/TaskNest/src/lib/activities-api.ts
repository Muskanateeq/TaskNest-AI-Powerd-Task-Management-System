/**
 * Activities API Functions
 *
 * API functions for activity tracking operations.
 */

import { api } from './api';

/**
 * Activity Type
 */
export type ActivityType = 'created' | 'updated' | 'deleted' | 'completed' | 'uncompleted' | 'restored';

/**
 * Activity Interface
 */
export interface Activity {
  id: number;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string;
  meta?: {
    task_id?: number;
    task_name?: string;
    changes?: string[];
  };
  created_at: string;
}

/**
 * Get Activities Query Parameters
 */
interface GetActivitiesParams {
  limit?: number;
  offset?: number;
  type?: ActivityType;
}

/**
 * Get all activities with optional filters
 */
export async function getActivities(params?: GetActivitiesParams): Promise<Activity[]> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.type) queryParams.append('type', params.type);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/activities?${queryString}` : '/activities';

  return api.get<Activity[]>(endpoint);
}

/**
 * Delete a specific activity
 */
export async function deleteActivity(id: number): Promise<void> {
  return api.delete<void>(`/activities/${id}`);
}

/**
 * Clear all activities for the current user
 */
export async function clearAllActivities(): Promise<void> {
  return api.delete<void>('/activities');
}
