import { api } from './api';
import { Task } from '../types';
interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}
export const taskService = {
  async getTasks(params?: any): Promise<TasksResponse> {
    const response = await api.get('/tasks', {
      params
    });
    return response.data;
  },
  async getTaskById(id: string): Promise<{
    success: boolean;
    data: Task;
  }> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  async createTask(data: Partial<Task>): Promise<{
    success: boolean;
    data: Task;
  }> {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  async updateTask(id: string, data: Partial<Task>): Promise<{
    success: boolean;
    data: Task;
  }> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
  async assignTask(id: string, userId: string): Promise<{
    success: boolean;
    data: Task;
  }> {
    const response = await api.patch(`/tasks/${id}/assign`, {
      userId
    });
    return response.data;
  }
};