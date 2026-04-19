/**
 * Notifications API Client
 *
 * Handles all notification-related API requests
 */

import { api } from './api';
import { Notification } from './types';

export type { Notification };

/**
 * Get user notifications
 */
export async function getNotifications(
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<Notification[]> {
  return api.get<Notification[]>(`/notifications?unread_only=${unreadOnly}&limit=${limit}`);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  return api.get<{ count: number }>('/notifications/unread-count');
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: number): Promise<Notification> {
  return api.put<Notification>(`/notifications/${notificationId}/read`);
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ marked_read: number }> {
  return api.put<{ marked_read: number }>('/notifications/read-all');
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: number): Promise<void> {
  return api.delete<void>(`/notifications/${notificationId}`);
}
