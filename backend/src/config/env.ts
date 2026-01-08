import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager',
  // JWT
  jwtSecret: process.env.JWT_SECRET || '24f16d7e0c87af5bae6200b218f2bc53',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '49fe2b91d13878144a2f784218947b7c2286a9bc33bd0f741cf79ac3f26f967460f81239fc1b0c0305f2bdba883622cdbf557b7bb3b0dac5df3a15cdedb5495b',
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  // AI
  geminiApiKey: process.env.GEMINI_API_KEY?.trim(),
  geminiModel: process.env.GEMINI_MODEL || 'gemini-pro',
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: ${envVar} is not set in environment variables`);
  }
}