import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();

router.use(authenticate);

const analyticsController = {
  getOverview: (_req: any, res: any) => res.json({
    success: true,
    data: {}
  }),
  getProjectAnalytics: (_req: any, res: any) => res.json({
    success: true,
    data: []
  }),
  getTaskAnalytics: (_req: any, res: any) => res.json({
    success: true,
    data: {}
  })
};

router.get('/overview', analyticsController.getOverview);
router.get('/projects', analyticsController.getProjectAnalytics);
router.get('/tasks', analyticsController.getTaskAnalytics);

export default router;
