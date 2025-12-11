# Task Management System - MERN Stack Application

A full-stack task management application built with MongoDB, Express.js, React, and Node.js (MERN) with TypeScript, designed for the Rapid Application Development (RAD) coursework.

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

- **Project Management (CRUD)**
  - Create, read, update, and delete projects
  - Project ownership and member management
  - Status tracking (Planning, Active, Completed, On Hold)
  - Priority levels (Low, Medium, High, Critical)
  - Pagination and filtering

- **Task Management (CRUD)**
  - Complete task lifecycle management
  - Task assignment to team members
  - Status workflow (Todo, In Progress, Review, Done)
  - Due date tracking
  - Tag-based organization
  - Advanced filtering and search

- **Analytics Dashboard (Advanced Feature)**
  - Real-time statistics and metrics
  - Interactive charts (Bar, Line, Pie)
  - Project completion rates
  - Task distribution analysis
  - User performance metrics
  - Time-based trends

### Additional Features
- Responsive design (mobile, tablet, desktop)
- Modern UI inspired by Linear and Notion
- Toast notifications for user feedback
- Loading states and error handling
- Profile management
- Dark mode support (UI slice ready)

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas
- **Version Control**: Git & GitHub

## 📐 System Design

Comprehensive system design documentation is available in [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md), including:

- Entity Relationship Diagram (ERD)
- Use Case Diagram
- System Architecture Diagram
- API Endpoints Documentation
- Sequence Diagrams (Login, CRUD, Dashboard)
- Redux State Management Diagram
- Security and Performance Considerations

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   ├── projects/        # Project-specific components
│   │   ├── tasks/           # Task-specific components
│   │   └── charts/          # Chart components
│   ├── pages/               # Page components
│   ├── store/               # Redux store and slices
│   ├── services/            # API service functions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
```

### Backend Structure
```
backend/
├── src/
│   ├── models/              # Mongoose models
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript types
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env .env

# Update .env with your configuration
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env .env

# Update .env with your configuration
```

## 🔐 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
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
npm start
# App runs on http://localhost:3000
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized production build in /build
```

**Backend:**
```bash
cd backend
npm run build
npm start
# Runs compiled TypeScript from /dist
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend.render.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { "_id", "name", "email", "role" },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects?page=1&limit=10&status=active
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "projects": [...],
    "pagination": { "total", "page", "pages", "limit" }
  }
}
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "status": "active",
  "priority": "high"
}

Response: 201 Created
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=todo&priority=high
Authorization: Bearer {accessToken}

Response: 200 OK
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockup",
  "project": "projectId",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-02-01",
  "tags": ["design", "ui"]
}

Response: 201 Created
```

### Analytics Endpoints

#### Get Dashboard Overview
```http
GET /api/analytics/overview
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalProjects": 15,
    "activeProjects": 8,
    "totalTasks": 127,
    "completedTasks": 89,
    "tasksByStatus": {...},
    "projectsByStatus": {...}
  }
}
```

For complete API documentation, see [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md#5-api-endpoints-documentation).

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add environment variables:
     - `REACT_APP_API_URL`: Your backend URL
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain

### Backend Deployment (Render)

1. **Prepare for deployment**
   - Ensure `package.json` has build script:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/server.js"
   }
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect your GitHub repository
   - Configure:
     - Name: task-management-api
     - Root Directory: `backend`
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add environment variables (from .env)
   - Click "Create Web Service"

3. **Alternative: Railway**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select repository and backend directory
   - Add environment variables
   - Deploy

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Choose cloud provider and region

2. **Configure Access**
   - Database Access → Add Database User
   - Network Access → Add IP Address (0.0.0.0/0 for development)

3. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Add to backend environment variables

### Post-Deployment Checklist
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database connected successfully
- [ ] Environment variables configured
- [ ] CORS configured for frontend URL
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] Test all CRUD operations
- [ ] Check analytics dashboard

## 📸 Screenshots

### Landing Page
*Modern, professional landing page with clear value proposition*

### Dashboard
*Analytics dashboard with real-time statistics and charts*

### Project Management
*Intuitive project list with filtering and sorting*

### Task Board
*Kanban-style task board with drag-and-drop (future enhancement)*

### Analytics
*Comprehensive analytics with interactive charts*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Design inspiration from [Linear](https://linear.app) and [Notion](https://notion.so)
- Icons from [Lucide](https://lucide.dev)
- Charts powered by [Recharts](https://recharts.org)
- Built for RAD Coursework

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**Note**: This is a coursework project demonstrating full-stack development skills with modern technologies and industry best practices.
