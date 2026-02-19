/**
 * Settings Page - TaskNest
 * Comprehensive user preferences and account settings
 * Dark Golden Theme - Modern SaaS Design
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { clearActivities } from '@/lib/activityTracker';
import ChangePasswordModal from '@/components/settings/ChangePasswordModal';
import './settings.css';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'tasks' | 'data' | 'about';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    browserNotifications: true,
    taskDueReminders: true,
    taskAssignedNotifications: true,
    dndEnabled: false,
    dndStartHour: 22,
    dndEndHour: 8,

    // Appearance Settings
    theme: 'dark',
    fontSize: 'medium',
    viewMode: 'comfortable',

    // Task Preferences
    defaultPriority: 'medium',
    defaultSortBy: 'created_at',
    defaultSortOrder: 'desc',
    autoArchiveDays: 30,
    showCompletedByDefault: true,
  });

  /**
   * Redirect if not authenticated
   */
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  /**
   * Handle setting change
   */
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, this would save to backend
    localStorage.setItem('taskNestSettings', JSON.stringify({ ...settings, [key]: value }));
  };

  /**
   * Handle export data
   */
  const handleExportData = () => {
    // In a real app, this would fetch all user data from backend
    const data = {
      user: user,
      exportDate: new Date().toISOString(),
      tasks: [], // Would fetch from backend
      tags: [],
      activities: [],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasknest-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Handle clear history
   */
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all activity history? This cannot be undone.')) {
      clearActivities();
      alert('Activity history cleared successfully');
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'tasks', label: 'Task Preferences', icon: '✅' },
    { id: 'data', label: 'Data & Privacy', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and application settings</p>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="section-title">Profile Settings</h2>
              <p className="section-description">Manage your personal information</p>

              <div className="settings-group">
                <label className="setting-label">Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="setting-input disabled"
                />
                <p className="setting-hint">Contact support to change your name</p>
              </div>

              <div className="settings-group">
                <label className="setting-label">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="setting-input disabled"
                />
                <p className="setting-hint">Email cannot be changed</p>
              </div>

              <div className="settings-group">
                <label className="setting-label">Password</label>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="btn-secondary"
                >
                  Change Password
                </button>
                <p className="setting-hint">Update your password to keep your account secure</p>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Settings</h2>
              <p className="section-description">Control how you receive notifications</p>

              <div className="settings-group">
                <div className="setting-toggle">
                  <div>
                    <label className="setting-label">Email Notifications</label>
                    <p className="setting-hint">Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <div className="setting-toggle">
                  <div>
                    <label className="setting-label">Browser Notifications</label>
                    <p className="setting-hint">Receive push notifications in your browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.browserNotifications}
                      onChange={(e) => handleSettingChange('browserNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <div className="setting-toggle">
                  <div>
                    <label className="setting-label">Task Due Reminders</label>
                    <p className="setting-hint">Get reminded when tasks are due</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.taskDueReminders}
                      onChange={(e) => handleSettingChange('taskDueReminders', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <label className="setting-label">Do Not Disturb Hours</label>
                <div className="dnd-hours">
                  <div>
                    <label>Start</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={settings.dndStartHour}
                      onChange={(e) => handleSettingChange('dndStartHour', parseInt(e.target.value))}
                      className="setting-input small"
                    />
                  </div>
                  <span>to</span>
                  <div>
                    <label>End</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={settings.dndEndHour}
                      onChange={(e) => handleSettingChange('dndEndHour', parseInt(e.target.value))}
                      className="setting-input small"
                    />
                  </div>
                </div>
                <p className="setting-hint">No notifications during these hours</p>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2 className="section-title">Appearance Settings</h2>
              <p className="section-description">Customize how TaskNest looks</p>

              <div className="settings-group">
                <label className="setting-label">Theme</label>
                <div className="setting-options">
                  <button
                    className={`option-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'dark')}
                  >
                    🌙 Dark
                  </button>
                  <button
                    className="option-btn disabled"
                    disabled
                  >
                    ☀️ Light (Coming Soon)
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <label className="setting-label">Font Size</label>
                <div className="setting-options">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      className={`option-btn ${settings.fontSize === size ? 'active' : ''}`}
                      onClick={() => handleSettingChange('fontSize', size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-group">
                <label className="setting-label">View Mode</label>
                <div className="setting-options">
                  {['compact', 'comfortable'].map((mode) => (
                    <button
                      key={mode}
                      className={`option-btn ${settings.viewMode === mode ? 'active' : ''}`}
                      onClick={() => handleSettingChange('viewMode', mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Task Preferences */}
          {activeTab === 'tasks' && (
            <div className="settings-section">
              <h2 className="section-title">Task Preferences</h2>
              <p className="section-description">Set default options for task management</p>

              <div className="settings-group">
                <label className="setting-label">Default Priority</label>
                <select
                  value={settings.defaultPriority}
                  onChange={(e) => handleSettingChange('defaultPriority', e.target.value)}
                  className="setting-select"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="setting-label">Default Sort By</label>
                <select
                  value={settings.defaultSortBy}
                  onChange={(e) => handleSettingChange('defaultSortBy', e.target.value)}
                  className="setting-select"
                >
                  <option value="created_at">Created Date</option>
                  <option value="due_date">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div className="settings-group">
                <div className="setting-toggle">
                  <div>
                    <label className="setting-label">Show Completed Tasks</label>
                    <p className="setting-hint">Display completed tasks by default</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.showCompletedByDefault}
                      onChange={(e) => handleSettingChange('showCompletedByDefault', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy */}
          {activeTab === 'data' && (
            <div className="settings-section">
              <h2 className="section-title">Data & Privacy</h2>
              <p className="section-description">Manage your data and privacy settings</p>

              <div className="settings-group">
                <label className="setting-label">Export Data</label>
                <button onClick={handleExportData} className="btn-secondary">
                  📥 Export All Data (JSON)
                </button>
                <p className="setting-hint">Download all your tasks, tags, and activity history</p>
              </div>

              <div className="settings-group">
                <label className="setting-label">Clear Activity History</label>
                <button onClick={handleClearHistory} className="btn-danger">
                  🗑️ Clear History
                </button>
                <p className="setting-hint">Permanently delete all activity logs</p>
              </div>

              <div className="settings-group danger-zone">
                <label className="setting-label">Danger Zone</label>
                <button className="btn-danger" disabled>
                  ⚠️ Delete Account (Coming Soon)
                </button>
                <p className="setting-hint">Permanently delete your account and all data</p>
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className="settings-section">
              <h2 className="section-title">About TaskNest</h2>
              <p className="section-description">Application information and resources</p>

              <div className="about-card">
                <div className="about-logo">T</div>
                <h3>TaskNest</h3>
                <p className="about-version">Version 2.0.0</p>
                <p className="about-description">
                  A modern task management application for manage tasks built with Next.js, Python, FastAPI, BetterAuth and PostgreSQL.
                </p>
              </div>

              <div className="about-links">
                <a href="#" className="about-link">📄 Terms of Service</a>
                <a href="#" className="about-link">🔒 Privacy Policy</a>
                <a href="#" className="about-link">📧 Contact Support</a>
                <a href="#" className="about-link">💡 Feature Requests</a>
              </div>

              <div className="about-footer">
                <p>© 2024 TaskNest. All rights reserved.</p>
                <p>Made by ❤️ Muskan Full Stack Agentic AI Expert</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
