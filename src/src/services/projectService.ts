import { api } from './api';
import { Project } from '../types';
interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}
export const projectService = {
  async getProjects(params?: any): Promise<ProjectsResponse> {
    const response = await api.get('/projects', {
      params
    });
    return response.data;
  },
  async getProjectById(id: string): Promise<{
    success: boolean;
    data: Project;
  }> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  async createProject(data: Partial<Project>): Promise<{
    success: boolean;
    data: Project;
  }> {
    const response = await api.post('/projects', data);
    return response.data;
  },
  async updateProject(id: string, data: Partial<Project>): Promise<{
    success: boolean;
    data: Project;
  }> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
  async addMember(projectId: string, userId: string): Promise<{
    success: boolean;
    data: Project;
  }> {
    const response = await api.post(`/projects/${projectId}/members`, {
      userId
    });
    return response.data;
  },
  async removeMember(projectId: string, userId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/members/${userId}`);
  }
};