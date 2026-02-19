/**
 * History Page - TaskNest
 * Track all user activities and changes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './history.css';

/**
 * Activity Type
 */
type ActivityType = 'created' | 'updated' | 'deleted' | 'completed' | 'uncompleted' | 'tag_added' | 'tag_removed';

/**
 * Activity Interface
 */
interface Activity {
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
 * Date Filter Type
 */
type DateFilter = 'today' | 'week' | 'month' | 'all';

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Redirect if not authenticated
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  /**
   * Load activities from localStorage
   */
  useEffect(() => {
    const loadActivities = () => {
      try {
        const stored = localStorage.getItem('taskNestActivities');
        if (stored) {
          const parsed = JSON.parse(stored);
          const activitiesWithDates = parsed.map((a: Activity) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          }));
          setActivities(activitiesWithDates);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    loadActivities();
  }, []);

  /**
   * Apply filters
   */
  useEffect(() => {
    let filtered = [...activities];

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(a => a.timestamp >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => a.timestamp >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => a.timestamp >= monthAgo);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.metadata?.taskName?.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setFilteredActivities(filtered);
  }, [activities, dateFilter, typeFilter, searchQuery]);

  /**
   * Get activity icon
   */
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'created':
        return '✅';
      case 'updated':
        return '✏️';
      case 'deleted':
        return '❌';
      case 'completed':
        return '✔️';
      case 'uncompleted':
        return '🔄';
      case 'tag_added':
        return '🏷️';
      case 'tag_removed':
        return '🗑️';
      default:
        return '📝';
    }
  };

  /**
   * Get activity color
   */
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'created':
        return 'green';
      case 'updated':
        return 'blue';
      case 'deleted':
        return 'red';
      case 'completed':
        return 'green';
      case 'uncompleted':
        return 'yellow';
      case 'tag_added':
        return 'purple';
      case 'tag_removed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  /**
   * Format timestamp
   */
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  /**
   * Group activities by date
   */
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1 className="history-title">Activity History</h1>
          <p className="history-subtitle">Track all your task activities and changes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        {/* Search */}
        <div className="history-search">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-input"
          />
        </div>

        {/* Date Filter */}
        <div className="history-filter-group">
          <label>Time Period</label>
          <div className="history-filter-buttons">
            {(['today', 'week', 'month', 'all'] as DateFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`filter-btn ${dateFilter === filter ? 'active' : ''}`}
              >
                {filter === 'today' && 'Today'}
                {filter === 'week' && 'This Week'}
                {filter === 'month' && 'This Month'}
                {filter === 'all' && 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="history-filter-group">
          <label>Activity Type</label>
          <div className="history-filter-buttons">
            <button
              onClick={() => setTypeFilter('all')}
              className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            {(['created', 'updated', 'deleted', 'completed'] as ActivityType[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="history-timeline">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="history-empty">
            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No activities found</h3>
            <p>Start creating and managing tasks to see your activity history</p>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="history-date-group">
              <div className="history-date-header">{date}</div>
              <div className="history-activities">
                {dateActivities.map((activity) => (
                  <div key={activity.id} className={`history-activity ${getActivityColor(activity.type)}`}>
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h4 className="activity-title">{activity.title}</h4>
                        <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      <p className="activity-description">{activity.description}</p>
                      {activity.metadata?.changes && activity.metadata.changes.length > 0 && (
                        <ul className="activity-changes">
                          {activity.metadata.changes.map((change, idx) => (
                            <li key={idx}>{change}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
