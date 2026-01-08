import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Income } from '../models/Income';
import mongoose from 'mongoose';

export const incomeController = {
    // Create a new income
    async createIncome(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { amount, source, description, date } = req.body;

            const income = await Income.create({
                userId,
                amount,
                source,
                description,
                date: date || new Date()
            });

            res.status(201).json({ success: true, data: income });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to create income' });
        }
    },

    // Get incomes with filters and pagination
    async getIncomes(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { source, startDate, endDate, page = 1, limit = 10 } = req.query;

            const query: any = { userId };

            if (source) {
                query.source = source;
            }

            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = new Date(startDate as string);
                if (endDate) query.date.$lte = new Date(endDate as string);
            }

            const incomes = await Income.find(query)
                .sort({ date: -1 })
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit));

            const total = await Income.countDocuments(query);

            res.status(200).json({
                success: true,
                data: incomes,
                pagination: {
                    current: Number(page),
                    total: Math.ceil(total / Number(limit)),
                    count: total
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to fetch incomes' });
        }
    },

    // Get single income
    async getIncomeById(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const income = await Income.findOne({ _id: req.params.id, userId });

            if (!income) {
                res.status(404).json({ success: false, error: 'Income not found' });
                return;
            }

            res.status(200).json({ success: true, data: income });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Error fetching income' });
        }
    },

    // Update income
    async updateIncome(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const income = await Income.findOneAndUpdate(
                { _id: req.params.id, userId },
                req.body,
                { new: true, runValidators: true }
            );

            if (!income) {
                res.status(404).json({ success: false, error: 'Income not found' });
                return;
            }

            res.status(200).json({ success: true, data: income });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to update income' });
        }
    },

    // Delete income
    async deleteIncome(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const income = await Income.findOneAndDelete({ _id: req.params.id, userId });

            if (!income) {
                res.status(404).json({ success: false, error: 'Income not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Income deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to delete income' });
        }
    },

    // Get income statistics
    async getIncomeStats(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;

            // Basic aggregation: Total by source
            const stats = await Income.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: '$source',
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
