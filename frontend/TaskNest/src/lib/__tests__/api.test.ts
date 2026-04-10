/**
 * API Client Tests
 *
 * Tests for API wrapper functions.
 */

import * as tasksApi from '../tasks-api';
import * as tagsApi from '../tags-api';

describe('API Client', () => {
  describe('Tasks API', () => {
    it('exports getTasks function', () => {
      expect(typeof tasksApi.getTasks).toBe('function');
    });

    it('exports getTask function', () => {
      expect(typeof tasksApi.getTask).toBe('function');
    });

    it('exports createTask function', () => {
      expect(typeof tasksApi.createTask).toBe('function');
    });

    it('exports updateTask function', () => {
      expect(typeof tasksApi.updateTask).toBe('function');
    });

    it('exports deleteTask function', () => {
      expect(typeof tasksApi.deleteTask).toBe('function');
    });

    it('exports toggleTaskCompletion function', () => {
      expect(typeof tasksApi.toggleTaskCompletion).toBe('function');
    });
  });

  describe('Tags API', () => {
    it('exports getTags function', () => {
      expect(typeof tagsApi.getTags).toBe('function');
    });

    it('exports getTag function', () => {
      expect(typeof tagsApi.getTag).toBe('function');
    });

    it('exports createTag function', () => {
      expect(typeof tagsApi.createTag).toBe('function');
    });

    it('exports updateTag function', () => {
      expect(typeof tagsApi.updateTag).toBe('function');
    });

    it('exports deleteTag function', () => {
      expect(typeof tagsApi.deleteTag).toBe('function');
    });
  });

  describe('API Structure', () => {
    it('getTasks accepts optional parameters', () => {
      // Verify function signature accepts parameters
      expect(tasksApi.getTasks.length).toBeLessThanOrEqual(1);
    });

    it('createTask accepts data parameter', () => {
      expect(tasksApi.createTask.length).toBe(1);
    });

    it('updateTask accepts id and data parameters', () => {
      expect(tasksApi.updateTask.length).toBe(2);
    });

    it('deleteTask accepts id parameter', () => {
      expect(tasksApi.deleteTask.length).toBe(1);
    });

    it('toggleTaskCompletion accepts id parameter', () => {
      expect(tasksApi.toggleTaskCompletion.length).toBe(1);
    });
  });
});
