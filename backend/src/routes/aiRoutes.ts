import express from 'express';
import { aiController } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Generate budget tips
router.post('/budget-tips', protect, aiController.getBudgetTips);

// Chat with AI
router.post('/chat', protect, aiController.chat);

export default router;
