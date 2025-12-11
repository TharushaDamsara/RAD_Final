import { api } from './api';
import { AnalyticsOverview } from '../types';
export const analyticsService = {
  async getOverview(): Promise<{
    success: boolean;
    data: AnalyticsOverview;
  }> {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
  async getProjectAnalytics(): Promise<any> {
    const response = await api.get('/analytics/projects');
    return response.data;
  },
  async getTaskAnalytics(): Promise<any> {
    const response = await api.get('/analytics/tasks');
    return response.data;
  }
};