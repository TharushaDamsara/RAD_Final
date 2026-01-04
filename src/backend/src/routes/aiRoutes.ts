import express from 'express';
import { aiController } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/budget-tips', aiController.getBudgetTips);

export default router;
