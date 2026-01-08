import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import dotenv from "dotenv";
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import incomeRoutes from './routes/incomeRoutes';
import aiRoutes from './routes/aiRoutes';

// Isolate app creation and middleware
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(helmet());
const allowedOrigins = [config.frontendUrl, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

// Rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

import analyticsRoutes from './routes/analyticsRoutes';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`📊 Frontend URL: ${config.frontendUrl}`);
});
export default app;