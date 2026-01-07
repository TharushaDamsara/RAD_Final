import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Expense } from '../models/Expense';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';

import { AICache } from '../models/AICache';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(config.geminiApiKey || '');

const generateBudgetTips = async (expenses: any[]) => {
    if (!config.geminiApiKey) {
        console.warn('Gemini API Key missing, using mock data');
        return {
            tips: [
                `You have spent $${expenses.reduce((sum, exp) => sum + exp.amount, 0)} this month. Add a Gemini API Key for real insights!`,
                "Your spending is being tracked, but AI features are in offline mode.",
                "Review your transaction history to spot trends manually.",
                "Consider setting a fixed budget for next month."
            ],
            forecast: { amount: 0, trend: 'stable', reason: 'Mock Mode' },
            anomalies: []
        };
    }

    try {
        // Using gemini-1.5-flash for higher free-tier quota limits
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare data for AI
        const expenseSummary = expenses.map(e =>
            `- $${e.amount} on ${e.category} (${e.description || 'no description'})`
        ).join('\n');

        const prompt = `
            Act as a helpful financial advisor. Analyze the following recent expenses:
            ${expenseSummary}

            Based on this, provided a detailed analysis in strictly valid JSON format with the following structure:
            {
                "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
                "forecast": {
                    "amount": 1234,
                    "trend": "increasing" | "decreasing" | "stable",
                    "reason": "Brief explanation of forecast"
                },
                "anomalies": [
                    { "description": "Unusual spend on X", "amount": 100, "date": "2023-01-01" }
                ]
            }

            - "tips": Provide 4 specific, actionable tips based on ${expenses.length} recent transactions.
            - "forecast": Estimate the total spending for the current month based on daily average so far.
            - "anomalies": Identify any outliers or unusually high expenses.

            Return ONLY the valid JSON string. Do not include markdown formatting or 'json' tags.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up text if it contains markdown code blocks
        const cleanerText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanerText);
    } catch (error) {
        // Silent fallback for production stability
        console.warn('AI Usage Note: Quota limit reached or API error, returning cached/mock insights.');
        return {
            tips: [
                "AI is taking a quick nap (Quota Limit). Here are some evergreen tips:",
                "1. Frequent small purchases add up – track them daily.",
                "2. The 50/30/20 rule is a great baseline for budgeting.",
                "3. Review your subscriptions – cancel what you don't use."
            ],
            forecast: {
                amount: Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) * 1.1),
                trend: 'stable',
                reason: 'Forecast based on current total (AI unavailable).'
            },
            anomalies: [],
            isFallback: true
        };
    }
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
            }).limit(50); // Limit to 50 for token efficiency

            // Check Persistent Cache (MongoDB)
            const cachedData = await AICache.findOne({ userId, type: 'budget_tips' });
            if (cachedData) {
                console.log('AI result returned from persistent cache for user:', userId);
                res.status(200).json({
                    success: true,
                    data: {
                        ...cachedData.data,
                        analyzedExpenses: expenses.length,
                        isCached: true
                    }
                });
                return;
            }

            const result = await generateBudgetTips(expenses);

            // ONLY update cache if it's NOT a fallback result
            if (!result.isFallback) {
                await AICache.findOneAndUpdate(
                    { userId, type: 'budget_tips' },
                    { data: result, createdAt: new Date() },
                    { upsert: true, new: true }
                );
            }

            res.status(200).json({
                success: true,
                data: {
                    tips: result.tips,
                    forecast: result.forecast,
                    anomalies: result.anomalies,
                    analyzedExpenses: expenses.length
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, error: 'Failed to generate AI tips' });
        }
    },

    // Chat with AI about finances
    async chat(req: IAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { message } = req.body;

            if (!message) {
                res.status(400).json({ success: false, error: 'Message is required' });
                return;
            }

            // Get last 30 days of expenses for context
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const expenses = await Expense.find({
                userId,
                date: { $gte: thirtyDaysAgo }
            }).limit(50); // Limit context size

            const expenseSummary = expenses.map(e =>
                `- $${e.amount} on ${e.category} (${e.description || 'no description'}) - ${new Date(e.date).toLocaleDateString()}`
            ).join('\n');

            const systemPrompt = `
                You are a friendly and helpful AI Financial Advisor. User's recent expenses (last 30 days):
                ${expenseSummary}

                User Question: "${message}"

                Answer the user's question based on their expense history. 
                Be concise, encouraging, and specific. 
                If the user asks about something not in the data, explain that you only see the last 30 days of expenses.
                Do not support markdown formatting in your response excessively, keep it simple text or bullet points.
            `;

            if (!config.geminiApiKey) {
                setTimeout(() => {
                    res.status(200).json({
                        success: true,
                        data: {
                            response: "I'm currently in demo mode (no API key). If I were real, I'd analyze your specific question about: " + message
                        }
                    });
                }, 1000);
                return;
            }

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(systemPrompt);
                const response = await result.response;
                const text = response.text();
                res.status(200).json({ success: true, data: { response: text } });
            } catch (err) {
                console.warn('AI Chat Usage Note: Quota limit reached.');
                res.status(200).json({
                    success: true,
                    data: {
                        response: "I'm sorry, I'm currently overwhelmed with requests (Quota Exceeded). I can't analyze your data right now, but please try again in a few minutes! 🤖💤"
                    }
                });
            }

        } catch (error: any) {
            console.error('AI Chat Error:', error);
            res.status(500).json({ success: false, error: 'Failed to process chat message' });
        }
    }
};
