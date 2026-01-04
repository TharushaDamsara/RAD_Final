import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Expense } from '../models/Expense';

// Placeholder for AI Integration
// You would typically use OpenAI SDK or Gemini API here
const generateBudgetTips = async (expenses: any[]) => {
    // Mock AI response for now
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const tips = [
        `You have spent $${totalSpent} this month. Consider setting a daily limit.`,
        "Your highest spending category is 'Food'. Try cooking at home more often.",
        "Great job keeping 'Transportation' costs low!",
        "Consider allocating 20% of your income to savings."
    ];

    return tips;
};

export const aiController = {
    // Generate budget tips based on recent expenses
    async getBudgetTips(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;

            // Get last 30 days of expenses
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const expenses = await Expense.find({
                userId,
                date: { $gte: thirtyDaysAgo }
            });

            const tips = await generateBudgetTips(expenses);

            res.status(200).json({ success: true, data: { tips, analyzedExpenses: expenses.length } });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to generate AI tips' });
        }
    }
};
