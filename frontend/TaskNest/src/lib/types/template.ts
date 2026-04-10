/**
 * Task Template Types
 *
 * Templates allow users to save and reuse common task configurations
 */

import { TaskPriority, RecurrencePattern } from '../types';

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
