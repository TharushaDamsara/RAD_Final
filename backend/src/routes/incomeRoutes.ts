import express from 'express';
import { incomeController } from '../controllers/incomeController';
import { protect } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation rules
const incomeValidation = validate([
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('source').isIn(['salary', 'freelance', 'investments', 'gift', 'other']).withMessage('Invalid source'),
    body('date').optional().isISO8601().toDate()
]);

// Routes
router.use(protect); // Protect all routes

router.route('/')
    .post(incomeValidation, incomeController.createIncome)
    .get(incomeController.getIncomes);

router.get('/stats', incomeController.getIncomeStats);

router.route('/:id')
    .get(incomeController.getIncomeById)
    .put(incomeValidation, incomeController.updateIncome)
    .delete(incomeController.deleteIncome);

export default router;
