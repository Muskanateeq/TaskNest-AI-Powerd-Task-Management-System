/**
 * Task Grouping Utilities
 * Functions to group tasks by different criteria
 */

import { Task } from '@/lib/types';

export type GroupByOption = 'none' | 'date' | 'priority' | 'status';

export interface TaskGroup {
  key: string;
  label: string;
  tasks: Task[];
  count: number;
}

/**
 * Group tasks by date (Overdue, Today, This Week, Later, No Due Date)
 */
export function groupTasksByDate(tasks: Task[]): TaskGroup[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const groups: Record<string, Task[]> = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
    noDueDate: [],
  };

  tasks.forEach((task) => {
    if (!task.due_date) {
      groups.noDueDate.push(task);
      return;
    }

    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      groups.overdue.push(task);
    } else if (dueDate.getTime() === today.getTime()) {
      groups.today.push(task);
    } else if (dueDate <= weekFromNow) {
      groups.thisWeek.push(task);
    } else {
      groups.later.push(task);
    }
  });

  return [
    { key: 'overdue', label: 'Overdue', tasks: groups.overdue, count: groups.overdue.length },
    { key: 'today', label: 'Today', tasks: groups.today, count: groups.today.length },
    { key: 'thisWeek', label: 'This Week', tasks: groups.thisWeek, count: groups.thisWeek.length },
    { key: 'later', label: 'Later', tasks: groups.later, count: groups.later.length },
    { key: 'noDueDate', label: 'No Due Date', tasks: groups.noDueDate, count: groups.noDueDate.length },
  ].filter(group => group.count > 0);
}

/**
 * Group tasks by priority (High, Medium, Low)
 */
export function groupTasksByPriority(tasks: Task[]): TaskGroup[] {
  const groups: Record<string, Task[]> = {
    high: [],
    medium: [],
    low: [],
  };

  tasks.forEach((task) => {
    const priority = task.priority || 'medium';
    groups[priority].push(task);
  });

  return [
    { key: 'high', label: 'High Priority', tasks: groups.high, count: groups.high.length },
    { key: 'medium', label: 'Medium Priority', tasks: groups.medium, count: groups.medium.length },
    { key: 'low', label: 'Low Priority', tasks: groups.low, count: groups.low.length },
  ].filter(group => group.count > 0);
}

/**
 * Group tasks by status (Active, Completed)
 */
export function groupTasksByStatus(tasks: Task[]): TaskGroup[] {
  const groups: Record<string, Task[]> = {
    active: [],
    completed: [],
  };

  tasks.forEach((task) => {
    if (task.completed) {
      groups.completed.push(task);
    } else {
      groups.active.push(task);
    }
  });

  return [
    { key: 'active', label: 'Active', tasks: groups.active, count: groups.active.length },
    { key: 'completed', label: 'Completed', tasks: groups.completed, count: groups.completed.length },
  ].filter(group => group.count > 0);
}

/**
 * Group tasks based on the selected grouping option
 */
export function groupTasks(tasks: Task[], groupBy: GroupByOption): TaskGroup[] {
  switch (groupBy) {
    case 'date':
      return groupTasksByDate(tasks);
    case 'priority':
      return groupTasksByPriority(tasks);
    case 'status':
      return groupTasksByStatus(tasks);
    case 'none':
    default:
      return [{ key: 'all', label: 'All Tasks', tasks, count: tasks.length }];
  }
}
