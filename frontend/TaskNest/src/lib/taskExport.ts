/**
 * Task Export Utilities
 * Functions to export tasks to CSV and JSON formats
 */

import { Task } from '@/lib/types';

/**
 * Convert tasks to CSV format
 */
export function exportTasksToCSV(tasks: Task[]): string {
  // CSV headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Priority',
    'Status',
    'Due Date',
    'Due Time',
    'Tags',
    'Recurrence',
    'Created At',
    'Updated At',
  ];

  // Convert tasks to CSV rows
  const rows = tasks.map(task => [
    task.id.toString(),
    `"${task.title.replace(/"/g, '""')}"`, // Escape quotes
    `"${(task.description || '').replace(/"/g, '""')}"`,
    task.priority || 'medium',
    task.completed ? 'Completed' : 'Active',
    task.due_date || '',
    task.due_time || '',
    task.tags?.map(t => t.name).join('; ') || '',
    task.recurrence_pattern || '',
    task.created_at || '',
    task.updated_at || '',
  ]);

  // Combine headers and rows
  const csv = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  return csv;
}

/**
 * Convert tasks to JSON format
 */
export function exportTasksToJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateExportFilename(format: 'csv' | 'json'): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  return `tasks_export_${timestamp}.${format}`;
}

/**
 * Export tasks to CSV file
 */
export function exportToCSV(tasks: Task[]) {
  const csv = exportTasksToCSV(tasks);
  const filename = generateExportFilename('csv');
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export tasks to JSON file
 */
export function exportToJSON(tasks: Task[]) {
  const json = exportTasksToJSON(tasks);
  const filename = generateExportFilename('json');
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}
