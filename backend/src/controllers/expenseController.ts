import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Expense } from '../models/Expense';
import mongoose from 'mongoose';

export const expenseController = {
    // Create a new expense
    async createExpense(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { amount, category, description, date, expenseType } = req.body;

            const expense = await Expense.create({
                userId,
                amount,
                category,
                description,
                date: date || new Date(),
                expenseType: expenseType || 'essential'
            });

            res.status(201).json({ success: true, data: expense });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to create expense' });
        }
    },

    // Get expenses with filters and pagination
    async getExpenses(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

            const query: any = { userId };

            if (category) {
                query.category = category;
            }

            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = new Date(startDate as string);
                if (endDate) query.date.$lte = new Date(endDate as string);
            }

            const expenses = await Expense.find(query)
                .sort({ date: -1 })
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit));

            const total = await Expense.countDocuments(query);

            res.status(200).json({
                success: true,
                data: expenses,
                pagination: {
                    current: Number(page),
                    total: Math.ceil(total / Number(limit)),
                    count: total
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
        }
    },

    // Get single expense
    async getExpenseById(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const expense = await Expense.findOne({ _id: req.params.id, userId });

            if (!expense) {
                res.status(404).json({ success: false, error: 'Expense not found' });
                return;
            }

            res.status(200).json({ success: true, data: expense });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Error fetching expense' });
        }
    },

    // Update expense
    async updateExpense(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const expense = await Expense.findOneAndUpdate(
                { _id: req.params.id, userId },
                req.body,
                { new: true, runValidators: true }
            );

            if (!expense) {
                res.status(404).json({ success: false, error: 'Expense not found' });
                return;
            }

            res.status(200).json({ success: true, data: expense });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to update expense' });
        }
    },

    // Delete expense
    async deleteExpense(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId });

            if (!expense) {
                res.status(404).json({ success: false, error: 'Expense not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Expense deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to delete expense' });
        }
    },

    // Get expense statistics
    async getExpenseStats(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            // const { month, year } = req.query; // Optional filters

            // Basic aggregation: Total by category
            const stats = await Expense.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: '$category',
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.status(200).json({ success: true, data: stats });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to get stats' });
        }
    }
};
