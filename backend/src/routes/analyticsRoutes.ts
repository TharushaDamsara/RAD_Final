import { Router } from 'express';
import { protect } from '../middleware/auth';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

router.use(protect);

router.get('/summary', analyticsController.getSummary);
router.get('/trends', analyticsController.getTrends);
router.get('/categories', analyticsController.getCategories);
router.get('/insights', analyticsController.getAIInsights);

export default router;
