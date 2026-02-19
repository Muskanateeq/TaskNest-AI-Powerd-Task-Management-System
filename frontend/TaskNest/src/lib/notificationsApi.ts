/**
 * Notifications API Service
 * Handles all notification-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  token: string,
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unread_only', 'true');
  params.append('limit', limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(token: string): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications/unread-count`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch unread count');
  }

  const data = await response.json();
  return data.count;
}

/**
 * Mark notification as read
 */
export async function markAsRead(
  token: string,
  notificationId: number
): Promise<Notification> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }

  return response.json();
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(
  token: string
): Promise<{ marked_read: number }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications/read-all`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to mark all as read');
  }

  return response.json();
}

/**
 * Delete notification
 */
export async function deleteNotification(
  token: string,
  notificationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notifications/${notificationId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
}
