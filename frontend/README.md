# Personal Expense & Income Tracker with AI Analytics (ExpenseAI)

A full-stack financial management application built with MongoDB, Express.js, React, and Node.js (MERN) with TypeScript, designed for the Rapid Application Development (RAD) coursework.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Design](#system-design)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- **User Authentication & Authorization**
  - Secure registration and login with JWT
  - Password hashing with bcryptjs
  - Role-based access control (User/Admin)
  - Access and refresh token management
  - Protected routes and API endpoints

- **Income & Expense Management (CRUD)**
  - Create, read, update, and delete transactions
  - Categorization of income and expenses
  - Transaction date and description tracking
  - Recurring entry support
  - Advanced filtering and search

- **Analytics Dashboard (Advanced Feature)**
  - Real-time statistics and metrics
  - Interactive charts (Bar, Line, Pie) using Recharts
  - Monthly income vs expense comparison
  - Category-based spending distribution
  - Savings calculations and trend analysis

- **AI Budget Assistant**
  - Personalized budget recommendations
  - Savings tips based on spending patterns
  - AI-driven financial insights using Gemini API
  - Cached AI responses for performance

### Additional Features
- Responsive design (mobile, tablet, desktop)
- Modern UI with glassmorphism effects
- Toast notifications for user feedback
- Loading states and error handling
- Profile management and statistics
- Dark mode support

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Google Generative AI** (Gemini) for budget insights
- **Helmet & Morgan** for security and logging

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Version Control**: Git & GitHub

## 📐 System Design

Comprehensive system design documentation is available in [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md), including:

- Entity Relationship Diagram (ERD)
- Use Case Diagram
- System Architecture Diagram
- API Endpoints Documentation
- Sequence Diagrams (Login, CRUD, AI Insights)
- Redux State Management Diagram
- Security and Performance Considerations

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components (Card, Loader, Toast)
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   ├── income/          # Income-specific components
│   │   ├── expenses/        # Expense-specific components
│   │   └── charts/          # Chart components
│   ├── pages/               # Page components (Dashboard, Landing, Analytics)
│   ├── store/               # Redux store and slices (auth, expense, income, ai)
│   ├── services/            # API service functions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
```

### Backend Structure
```
backend/
├── src/
│   ├── models/              # Mongoose models (User, Expense, Income, AICache)
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   ├── services/            # Business logic (AI service)
│   ├── middleware/          # Custom middleware (Auth, Error)
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript types
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API Key (for AI features)
- Git

### Clone the Repository
```bash
git clone https://github.com/TharushaDamsara/RAD_Final.git
cd RAD_Final
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
# Create .env based on environment variables section
npm run dev
```

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
FRONTEND_URL=http://localhost:5173
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://rad-final-backend.onrender.com/api
```

### Deployment URLs
- **Frontend**: [https://rad-final.vercel.app/](https://rad-final.vercel.app/)
- **Backend API**: [https://rad-final-backend.onrender.com/api](https://rad-final-backend.onrender.com/api)

For complete API documentation, see [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md#5-api-endpoints-documentation).

## 🌐 Deployment

### Frontend Deployment (Vercel)
The frontend is automatically deployed to Vercel via GitHub integration.
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Backend Deployment (Render)
The backend is hosted on Render as a Web Service.
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## 📸 Screenshots

### Landing Page
*Modern, professional landing page with AI feature highlights*

### Dashboard
*Analytics dashboard with real-time statistics and spending charts*

### Transaction Management
*Intuitive list and forms for managing income and expenses*

### AI Budget Insights
*Personalized budget recommendations generated by Gemini AI*

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author
**Tharusha Damsara**
- GitHub: [@TharushaDamsara](https://github.com/TharushaDamsara)

---
**Note**: This is a coursework project demonstrating full-stack development skills with modern technologies and industry best practices.
