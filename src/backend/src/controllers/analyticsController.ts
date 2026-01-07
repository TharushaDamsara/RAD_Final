import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Expense } from '../models/Expense';
import { AICache } from '../models/AICache';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import mongoose from 'mongoose';

const genAI = new GoogleGenerativeAI(config.geminiApiKey || '');

export const analyticsController = {
  // GET /api/analytics/summary
  async getSummary(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.id);
      const { startDate, endDate } = req.query;

      const dateFilter: any = { userId };
      if (startDate || endDate) {
        dateFilter.date = {};
        if (startDate) dateFilter.date.$gte = new Date(startDate as string);
        if (endDate) dateFilter.date.$lte = new Date(endDate as string);
      }

      const stats = await Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$amount" },
            count: { $sum: 1 },
            avgSpend: { $avg: "$amount" }
          }
        }
      ]);

      const highestSpendDay = await Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            dailyTotal: { $sum: "$amount" }
          }
        },
        { $sort: { dailyTotal: -1 } },
        { $limit: 1 }
      ]);

      const typeBreakdown = await Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$expenseType",
            total: { $sum: "$amount" }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          total: stats[0]?.totalExpenses || 0,
          count: stats[0]?.count || 0,
          average: stats[0]?.avgSpend || 0,
          highestSpendDay: highestSpendDay[0] || null,
          typeBreakdown: typeBreakdown.reduce((acc: any, curr) => {
            acc[curr._id] = curr.total;
            return acc;
          }, {})
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/analytics/trends
  async getTrends(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.id);
      const { days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));

      const trends = await Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            amount: { $sum: "$amount" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      res.status(200).json({
        success: true,
        data: trends.map(t => ({ date: t._id, amount: t.amount }))
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/analytics/categories
  async getCategories(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.id);
      const categories = await Expense.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$amount" }
          }
        },
        { $sort: { value: -1 } }
      ]);

      res.status(200).json({
        success: true,
        data: categories.map(c => ({ name: c._id, value: c.value }))
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/analytics/insights (AI Powered)
  async getAIInsights(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      // Check cache
      const cached = await AICache.findOne({ userId, type: 'analytics_insight' });
      if (cached) {
        res.status(200).json({ success: true, data: cached.data });
        return;
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const expenses = await Expense.find({
        userId,
        date: { $gte: thirtyDaysAgo }
      }).sort({ date: -1 });

      if (expenses.length === 0) {
        res.status(200).json({ success: true, data: "Add some expenses to get AI insights!" });
        return;
      }

      const summary = expenses.map(e =>
        `- $${e.amount} on ${e.category} (${e.expenseType}) - ${e.date.toLocaleDateString()}`
      ).join('\n');

      const prompt = `
                Analyze these expenses from the last 30 days:
                ${summary}

                Provide exactly 3 bullet points of deep financial insights. 
                Identify spending spikes, unusual patterns, or lifestyle inflation.
                Be specific about amounts and categories.
                Format: Just the bullet points.
            `;

      let result;
      try {
        const model = genAI.getGenerativeModel({ model: config.geminiModel });
        result = await model.generateContent(prompt);
      } catch (err: any) {
        if (err.status === 404 && config.geminiModel !== 'gemini-pro') {
          console.warn(`Fallback: ${config.geminiModel} not found, trying gemini-pro`);
          const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
          result = await fallbackModel.generateContent(prompt);
        } else {
          throw err;
        }
      }

      const insights = result.response.text();

      // ONLY store in cache on success
      await AICache.findOneAndUpdate(
        { userId, type: 'analytics_insight' },
        { data: insights, createdAt: new Date() },
        { upsert: true }
      );

      res.status(200).json({ success: true, data: insights });
    } catch (error: any) {
      console.error('AI Insight Error:', error);
      // Explicitly return a warning but do NOT cache it
      res.status(200).json({
        success: true,
        data: "AI is busy analyzing millions of data points right now! 🤖✨ Your custom insights will be back in a few minutes. In the meantime, check your spending trends above.",
        isFallback: true
      });
    }
  }
};
