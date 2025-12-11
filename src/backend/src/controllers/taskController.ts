import { Response } from 'express';
import { IAuthRequest } from '../types';
import { TaskService } from '../services/taskService';

export const taskController = {
  // Create a new task
  async createTask(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskData = req.body;
      const task = await TaskService.createTask(userId, taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Get tasks with filters and pagination
  async getTasks(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { project, status, priority, assignedTo, page, limit } = req.query;

      const filters: any = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };
      if (project) filters.project = project;
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (assignedTo) filters.assignedTo = assignedTo;

      const tasks = await TaskService.getTasks(userId, filters);
      res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Get a single task by ID
  async getTaskById(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await TaskService.getTaskById(id, userId);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Update a task
  async updateTask(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updates = req.body;
      const task = await TaskService.updateTask(id, userId, updates);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Delete a task
  async deleteTask(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await TaskService.deleteTask(id, userId);
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Update task status only
  async updateTaskStatus(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;
      const task = await TaskService.updateTask(id, userId, { status });
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  // Assign a task to a user
  async assignTask(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { assignedTo } = req.body;
      const task = await TaskService.assignTask(id, userId, assignedTo);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
