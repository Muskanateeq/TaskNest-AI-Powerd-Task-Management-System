/**
 * Settings API Service
 * Handles all settings-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserSettings {
  id: number;
  user_id: string;
  email_notifications: boolean;
  browser_notifications: boolean;
  task_reminders: boolean;
  dnd_enabled: boolean;
  dnd_start: string | null;
  dnd_end: string | null;
  theme: string;
  font_size: string;
  view_mode: string;
  default_priority: string;
  default_sort: string;
  show_completed: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettingsUpdate {
  email_notifications?: boolean;
  browser_notifications?: boolean;
  task_reminders?: boolean;
  dnd_enabled?: boolean;
  dnd_start?: string | null;
  dnd_end?: string | null;
  theme?: string;
  font_size?: string;
  view_mode?: string;
  default_priority?: string;
  default_sort?: string;
  show_completed?: boolean;
  language?: string;
}

export interface ProfileUpdate {
  name?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ExportData {
  user: UserProfile;
  settings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  tasks: any[];
  tags: any[];
  export_date: string;
}

/**
 * Get user settings
 */
export async function getSettings(token: string): Promise<UserSettings> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }

  return response.json();
}

/**
 * Update user settings
 */
export async function updateSettings(
  token: string,
  settings: SettingsUpdate
): Promise<UserSettings> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }

  return response.json();
}

/**
 * Get user profile
 */
export async function getProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

/**
 * Update user profile
 */
export async function updateProfile(
  token: string,
  profile: ProfileUpdate
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
}

/**
 * Change user password
 */
export async function changePassword(
  token: string,
  data: ChangePasswordData
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/change-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to change password');
  }

  return response.json();
}

/**
 * Export all user data
 */
export async function exportUserData(token: string): Promise<ExportData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/export`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  return response.json();
}

/**
 * Delete user account
 */
export async function deleteAccount(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/account`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }

  return response.json();
}
