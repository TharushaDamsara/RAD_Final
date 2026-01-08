import express from 'express';
import { expenseController } from '../controllers/expenseController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .post(expenseController.createExpense)
    .get(expenseController.getExpenses);

router.get('/stats', expenseController.getExpenseStats);

router.route('/:id')
    .get(expenseController.getExpenseById)
    .put(expenseController.updateExpense)
    .delete(expenseController.deleteExpense);

export default router;
