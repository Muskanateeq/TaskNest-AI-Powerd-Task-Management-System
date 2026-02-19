/**
 * FilterPanel Component
 * Dark Golden Theme - Modern SaaS Design
 */

'use client';

import React, { useState } from 'react';
import { TaskPriority, TaskFilterOptions } from '@/lib/types';
import { useTags } from '@/hooks/useTags';
import './FilterPanel.css';

export interface FilterPanelProps {
  filters: TaskFilterOptions;
  onFilterChange: (filters: TaskFilterOptions) => void;
  taskCount: number;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  taskCount,
}: FilterPanelProps) {
  const { tags } = useTags();
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Toggle tag filter
   */
  const toggleTagFilter = (tagId: number) => {
    const currentTagIds = filters.tag_ids || [];
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter((id) => id !== tagId)
      : [...currentTagIds, tagId];

    onFilterChange({
      ...filters,
      tag_ids: newTagIds.length > 0 ? newTagIds : undefined,
    });
  };

  /**
   * Set priority filter
   */
  const setPriorityFilter = (priority?: TaskPriority) => {
    onFilterChange({
      ...filters,
      priority,
    });
  };

  /**
   * Set status filter
   */
  const setStatusFilter = (status: 'all' | 'pending' | 'completed') => {
    onFilterChange({
      ...filters,
      status,
    });
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
    });
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters =
    filters.priority ||
    (filters.tag_ids && filters.tag_ids.length > 0) ||
    (filters.status && filters.status !== 'all');

  return (
    <div className="filter-panel">
      {/* Header */}
      <div className="filter-panel-header">
        <div className="filter-panel-header-content">
          <div className="filter-panel-header-left">
            <div className="filter-panel-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div className="filter-panel-title-wrapper">
              <h3 className="filter-panel-title">Filters</h3>
              <p className="filter-panel-count">{taskCount} tasks</p>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`filter-panel-toggle ${isExpanded ? 'expanded' : ''}`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="filter-panel-clear"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className={`filter-panel-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-panel-body">
          {/* Status Filter */}
          <div className="filter-section">
            <label className="filter-section-label">Status</label>
            <div className="filter-status-grid">
              {(['all', 'pending', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`filter-status-btn ${
                    (filters.status || 'all') === status ? 'active' : ''
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority and Tags in Same Row */}
          <div className="filter-section-row">
            {/* Priority Filter */}
            <div className="filter-section filter-section-half">
              <label className="filter-section-label">Priority</label>
              <div className="filter-priority-list">
                <button
                  onClick={() => setPriorityFilter(undefined)}
                  className={`filter-priority-btn ${!filters.priority ? 'all' : ''}`}
                >
                  All priorities
                </button>
                {Object.values(TaskPriority).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={`filter-priority-btn ${
                      filters.priority === priority ? 'active' : ''
                    }`}
                  >
                    <span className="filter-priority-icon">
                      {priority === TaskPriority.HIGH && '🔥'}
                      {priority === TaskPriority.MEDIUM && '⚡'}
                      {priority === TaskPriority.LOW && '📌'}
                    </span>
                    <span className="filter-priority-text">{priority}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="filter-section filter-section-half">
                <label className="filter-section-label">Tags</label>
                <div className="filter-tags-list">
                  {tags.map((tag) => {
                    const isSelected = filters.tag_ids?.includes(tag.id) || false;
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTagFilter(tag.id)}
                        className={`filter-tag-btn ${isSelected ? 'active' : ''}`}
                      >
                        <div className={`filter-tag-checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span>{tag.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Clear filters button (mobile) */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="filter-panel-clear-mobile"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
