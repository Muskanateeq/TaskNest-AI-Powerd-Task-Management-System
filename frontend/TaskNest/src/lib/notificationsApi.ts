/**
 * Notifications API Service
 * Handles all notification-related API calls using centralized API client
 */

import { api } from './api';

export interface Notification {
  id: number;
  user_id: string;
  type: string;
  content: string;
  related_item_type: string | null;
  related_item_id: number | null;
  read: boolean;
  created_at: string;
}

/**
 * Get user notifications
 */
export async function getNotifications(
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unread_only', 'true');
  params.append('limit', limit.toString());

  return api.get<Notification[]>(`/notifications?${params}`);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const data = await api.get<{ count: number }>('/notifications/unread-count');
  return data.count;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: number): Promise<Notification> {
  return api.patch<Notification>(`/notifications/${notificationId}/read`, {});
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ marked_read: number }> {
  return api.patch<{ marked_read: number }>('/notifications/read-all', {});
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: number): Promise<void> {
  return api.delete<void>(`/notifications/${notificationId}`);
}

