import { Task, CreateTaskData, UpdateTaskData } from '../types';
import { offlineQueue } from './offlineQueue';

const API_BASE = '/api';

// Simulate 10% failure rate for testing rollback functionality
const shouldFail = (method: string): boolean => {
  if ((method === 'PATCH' || method === 'POST') && Math.random() < 0.1) {
    console.log(`💥 Simulating failure for ${method}`);
    return true;
  }
  return false;
};

// Check if we're online
const isOnline = (): boolean => {
  return navigator.onLine && offlineQueue.isOnlineStatus();
};

export const api = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    if (!isOnline()) {
      // Queue the action for later
      const actionId = offlineQueue.addToQueue({
        type: 'CREATE',
        data: taskData
      });
      
      // Return a temporary task with the action ID
      const tempTask: Task = {
        id: `temp-${actionId}`,
        ...taskData,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return tempTask;
    }

    if (shouldFail('POST')) {
      throw new Error('Simulated failure for testing');
    }

    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...taskData,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    
    return response.json();
  },

  async updateTask(id: string, updates: UpdateTaskData): Promise<Task> {
    if (!isOnline()) {
      // Queue the action for later
      const actionId = offlineQueue.addToQueue({
        type: 'UPDATE',
        data: { id, updates }
      });
      
      // Return a temporary task with the action ID
      const tempTask: Task = {
        id: `temp-${actionId}`,
        title: 'Queued Update',
        description: 'This task will be updated when online',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return tempTask;
    }

    if (shouldFail('PATCH')) {
      throw new Error('Simulated failure for testing');
    }

    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    if (!isOnline()) {
      // Queue the action for later
      offlineQueue.addToQueue({
        type: 'DELETE',
        data: { id }
      });
      return;
    }

    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },
};
