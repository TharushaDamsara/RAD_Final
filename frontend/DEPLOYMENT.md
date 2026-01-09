# Deployment Guide - ExpenseAI

## Overview
This guide provides instructions for deploying the **Personal Expense & Income Tracker with AI Analytics (ExpenseAI)** to production environments.

## Frontend Deployment (Vercel)

### Step 1: Configuration
The frontend is built with Vite and React. Ensure the following settings are used:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

### Step 2: Environment Variables
Add the following variable in the Vercel dashboard:
- `VITE_API_URL`: Your backend API URL (e.g., `https://rad-final-backend.onrender.com/api`)

## Backend Deployment (Render)

### Step 1: Configuration
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Step 2: Environment Variables
Add these in the Render dashboard:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://rad-final.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_32_char_secret
JWT_REFRESH_SECRET=your_other_32_char_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## Database Setup (MongoDB Atlas)

1. **Create Cluster**: Use the M0 (Free) tier on MongoDB Atlas.
2. **Access Control**: Add a database user with read/write permissions.
3. **Network Access**: Add `0.0.0.0/0` (standard for Render/Vercel) or specific IP ranges.
4. **Connection**: Use the "Connect your application" driver string.

## AI Configuration (Google Gemini)

1. **API Key**: Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. **Model**: The application is optimized for `gemini-1.5-flash` for speed and low latency.
3. **Quota**: Be aware of the free tier limits (RPM/RPD) to avoid errors.

## Post-Deployment Checklist

- [ ] Frontend accessible at HTTPS URL.
- [ ] Backend health check responding.
- [ ] Test user registration and login.
- [ ] Add a sample income and expense transaction.
- [ ] Verify charts load on the Analytics page.
- [ ] Test "Get AI Insights" to ensure API connectivity.
- [ ] Check console for CORS or Environment variable errors.

## Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` in backend exactly matches your Vercel URL (no trailing slash).
- **AI 404/403**: Verify `GEMINI_API_KEY` is valid and the model name is correct.
- **Database Connection**: Ensure the MongoDB cluster is not paused and IP is whitelisted.
