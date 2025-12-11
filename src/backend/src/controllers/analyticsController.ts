import { Response } from 'express';
import { IAuthRequest } from '../types';
import { AnalyticsService } from '../services/analyticsService';

export const analyticsController = {
  async getDashboardStats(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const stats = await AnalyticsService.getOverview(req.user!.id);
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getProjectAnalytics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const analytics = await AnalyticsService.getProjectAnalytics(req.user!.id);
      res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getTaskAnalytics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await AnalyticsService.getTaskAnalytics(
          req.user!.id,
          startDate as string,
          endDate as string
      );
      res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getUserProductivity(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { period } = req.query;
      const productivity = await AnalyticsService.getUserProductivity(req.user!.id, period as string);
      res.status(200).json({ success: true, data: productivity });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }
};
