/**
 * TypeScript Type Definitions
 *
 * Defines all TypeScript interfaces and types used throughout the application.
 * These types should match the backend Pydantic schemas.
 */

/**
 * User Interface
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Task Priority Enum
 */
export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Task Interface
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  due_date?: string; // ISO date string
  due_time?: string; // ISO time string
  recurrence_pattern?: RecurrencePattern;
  project_id?: number; // Project this task belongs to
  assigned_to?: string; // User ID this task is assigned to
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

/**
 * Recurrence Pattern Interface
 */
export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // e.g., every 2 days, every 3 weeks
  days_of_week?: number[]; // 0-6 (Sunday-Saturday) for weekly
  day_of_month?: number; // 1-31 for monthly
  end_date?: string; // ISO date string
}

/**
 * Tag Interface
 */
export interface Tag {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

/**
 * Tag Create Request
 */
export interface TagCreateRequest {
  name: string;
}

/**
 * Tag Update Request
 */
export interface TagUpdateRequest {
  name?: string;
}

/**
 * Task Create Request
 */
export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  due_time?: string;
  recurrence_pattern?: RecurrencePattern;
  tag_ids?: number[];
}

/**
 * Task Update Request
 */
export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  due_time?: string;
  recurrence_pattern?: RecurrencePattern;
  tag_ids?: number[];
}

/**
 * Task Filter Options
 */
export interface TaskFilterOptions {
  status?: 'all' | 'pending' | 'completed';
  priority?: TaskPriority;
  tag_ids?: number[];
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

/**
 * Task Sort Options
 */
export type TaskSortBy = 'created_at' | 'due_date' | 'priority' | 'title';
export type TaskSortOrder = 'asc' | 'desc';

export interface TaskSortOptions {
  sort_by: TaskSortBy;
  sort_order: TaskSortOrder;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

/**
 * Authentication Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

/**
 * API Error Response
 */
export interface APIErrorResponse {
  success: false;
  error: string;
  error_type: string;
  details?: unknown;
}

/**
 * API Success Response
 */
export interface APISuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

/**
 * Form Field Error
 */
export interface FormFieldError {
  field: string;
  message: string;
}

/**
 * Loading State
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Toast Notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Task Template
 */
export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  icon?: string;

  // Template configuration
  template_title?: string;
  template_description?: string;
  priority: TaskPriority;
  tag_ids?: number[];
  recurrence_pattern?: RecurrencePattern;

  // Metadata
  created_at: string;
  updated_at: string;
  use_count: number;
}

/**
 * Template Create Request
 */
export interface TemplateCreateRequest {
  name: string;
  description?: string;
  icon?: string;
  template_title?: string;
  template_description?: string;
  priority: TaskPriority;
  tag_ids?: number[];
  recurrence_pattern?: RecurrencePattern;
}

/**
 * Template Update Request
 */
export interface TemplateUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
  template_title?: string;
  template_description?: string;
  priority?: TaskPriority;
  tag_ids?: number[];
  recurrence_pattern?: RecurrencePattern;
}

// ============================================================================
// Dashboard Enhancement Types
// ============================================================================

/**
 * Team Interface
 */
export interface Team {
  id: number;
  name: string;
  description?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Team Member Interface
 */
export interface TeamMember {
  id: number;
  team_id: number;
  user_id: string;
  role: 'admin' | 'member' | 'viewer';
  joined_at: string;
}

/**
 * Team Invitation Interface
 */
export interface TeamInvitation {
  id: number;
  team_id: number;
  email: string;
  inviter_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expires_at: string;
  created_at: string;
}

/**
 * Project Interface
 */
export interface Project {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

/**
 * Milestone Interface
 */
export interface Milestone {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  date: string;
  completed: boolean;
  created_at: string;
}

/**
 * Task Dependency Interface
 */
export interface TaskDependency {
  id: number;
  predecessor_task_id: number;
  successor_task_id: number;
  dependency_type: 'finish-to-start';
  created_at: string;
}

/**
 * Comment Interface
 */
export interface Comment {
  id: number;
  task_id: number;
  author_id: string;
  content: string;
  mentions?: string[]; // Array of user IDs
  created_at: string;
  updated_at: string;
}

/**
 * Task Assignment Interface
 */
export interface TaskAssignment {
  id: number;
  task_id: number;
  assignee_id: string;
  assigner_id: string;
  assigned_at: string;
}

/**
 * Notification Interface
 */
export interface Notification {
  id: number;
  user_id: string;
  type: 'task_update' | 'mention' | 'assignment' | 'reminder' | 'team_invite';
  content: string;
  related_item_type?: 'task' | 'comment' | 'project' | 'team';
  related_item_id?: number;
  read: boolean;
  created_at: string;
}

/**
 * Notification Preference Interface
 */
export interface NotificationPreference {
  id: number;
  user_id: string;
  enabled_types: string[]; // Array of notification types
  enabled_channels: ('in-app' | 'browser' | 'email')[];
  dnd_start_hour?: number; // 0-23
  dnd_end_hour?: number; // 0-23
  created_at: string;
  updated_at: string;
}

/**
 * Analytics Snapshot Interface
 */
export interface AnalyticsSnapshot {
  id: number;
  user_id: string;
  date: string;
  tasks_created: number;
  tasks_completed: number;
  average_completion_time_hours?: number;
  priority_distribution: Record<string, number>;
  tag_distribution: Record<string, number>;
  created_at: string;
}

/**
 * Custom Report Interface
 */
export interface CustomReport {
  id: number;
  user_id: string;
  name: string;
  metrics: string[]; // Array of metric names
  date_range_start: string;
  date_range_end: string;
  shareable_token?: string;
  created_at: string;
}

/**
 * Dashboard Statistics Interface
 */
export interface DashboardStatistics {
  total_tasks: number;
  in_progress: number;
  completed: number;
  pending: number;
  total_percentage: number;
  in_progress_percentage: number;
  completed_percentage: number;
  pending_percentage: number;
  trend_total: number;
  trend_in_progress: number;
  trend_completed: number;
  trend_pending: number;
}

// ============================================================================
// Request/Response Types for New Entities
// ============================================================================

/**
 * Team Create Request
 */
export interface TeamCreateRequest {
  name: string;
  description?: string;
}

/**
 * Team Update Request
 */
export interface TeamUpdateRequest {
  name?: string;
  description?: string;
}

/**
 * Team Invite Request
 */
export interface TeamInviteRequest {
  email: string;
}

/**
 * Project Create Request
 */
export interface ProjectCreateRequest {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Project Update Request
 */
export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'active' | 'completed' | 'archived';
}

/**
 * Comment Create Request
 */
export interface CommentCreateRequest {
  content: string;
  mentions?: string[];
}

/**
 * Notification Preference Update Request
 */
export interface NotificationPreferenceUpdateRequest {
  enabled_types?: string[];
  enabled_channels?: ('in-app' | 'browser' | 'email')[];
  dnd_start_hour?: number;
  dnd_end_hour?: number;
}
