import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: Date;
}

// Project Types
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export interface IProject extends Document {
  name: string;
  description: string;
  owner: IUser['_id'];
  members: IUser['_id'][];
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export interface ITask extends Document {
  title: string;
  description: string;
  project: IProject['_id'];
  assignedTo?: IUser['_id'];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  createdBy: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}
export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Analytics Types
export interface IAnalyticsOverview {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  projectsByStatus: Record<ProjectStatus, number>;
  recentActivity: any[];
}