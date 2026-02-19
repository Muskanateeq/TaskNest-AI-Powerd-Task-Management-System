/**
 * Analytics API Service
 * Handles all analytics-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CompletionRateData {
  date: string;
  created: number;
  completed: number;
  completion_rate: number;
}

export interface PriorityDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface TagDistribution {
  tag: string;
  count: number;
}

export interface HeatmapData {
  day: string;
  hour: number;
  count: number;
}

export interface AnalyticsSummary {
  start_date: string;
  end_date: string;
  completion_rate: CompletionRateData[];
  tasks_by_priority: PriorityDistribution;
  tasks_by_tag: TagDistribution[];
  productivity_heatmap: HeatmapData[];
  insights: string[];
}

/**
 * Get completion rate over time
 */
export async function getCompletionRate(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<{ start_date: string; end_date: string; data: CompletionRateData[] }> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analytics/completion-rate?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch completion rate');
  }

  return response.json();
}

/**
 * Get tasks by priority distribution
 */
export async function getTasksByPriority(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<{ start_date: string | null; end_date: string | null; data: PriorityDistribution }> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analytics/tasks-by-priority?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch priority distribution');
  }

  return response.json();
}

/**
 * Get tasks by tag distribution
 */
export async function getTasksByTag(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<{ start_date: string | null; end_date: string | null; data: TagDistribution[] }> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analytics/tasks-by-tag?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tag distribution');
  }

  return response.json();
}

/**
 * Get productivity heatmap
 */
export async function getProductivityHeatmap(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<{ start_date: string; end_date: string; data: HeatmapData[] }> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analytics/productivity-heatmap?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch productivity heatmap');
  }

  return response.json();
}

/**
 * Get AI-generated insights
 */
export async function getInsights(
  token: string
): Promise<{ insights: string[]; generated_at: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/insights`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }

  return response.json();
}

/**
 * Get comprehensive analytics summary
 */
export async function getAnalyticsSummary(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<AnalyticsSummary> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analytics/summary?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary');
  }

  return response.json();
}
