/**
 * Activity Tracker Utility
 * Logs user activities to localStorage for history tracking
 */

/**
 * Activity Type
 */
export type ActivityType = 'created' | 'updated' | 'deleted' | 'completed' | 'uncompleted' | 'tag_added' | 'tag_removed';

/**
 * Activity Interface
 */
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    taskName?: string;
    changes?: string[];
    tagName?: string;
  };
}

/**
 * Log an activity
 */
export function logActivity(
  type: ActivityType,
  title: string,
  description: string,
  metadata?: Activity['metadata']
): void {
  try {
    // Get existing activities
    const stored = localStorage.getItem('taskNestActivities');
    const activities: Activity[] = stored ? JSON.parse(stored) : [];

    // Create new activity
    const newActivity: Activity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description,
      timestamp: new Date(),
      metadata,
    };

    // Add to beginning of array (newest first)
    activities.unshift(newActivity);

    // Keep only last 500 activities to prevent localStorage overflow
    const trimmedActivities = activities.slice(0, 500);

    // Save back to localStorage
    localStorage.setItem('taskNestActivities', JSON.stringify(trimmedActivities));
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * Clear all activities
 */
export function clearActivities(): void {
  try {
    localStorage.removeItem('taskNestActivities');
  } catch (error) {
    console.error('Failed to clear activities:', error);
  }
}

/**
 * Get all activities
 */
export function getActivities(): Activity[] {
  try {
    const stored = localStorage.getItem('taskNestActivities');
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((a: Partial<Activity> & { timestamp: string | Date }) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    })) as Activity[];
  } catch (error) {
    console.error('Failed to get activities:', error);
    return [];
  }
}
