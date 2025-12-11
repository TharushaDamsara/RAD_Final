# System Design Documentation
# Task Management System - RAD Coursework

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     USER        │
├─────────────────┤
│ _id: ObjectId   │
│ name: String    │
│ email: String   │
│ password: String│
│ role: Enum      │
│ avatar: String  │
│ createdAt: Date │
└────────┬────────┘
         │
         │ 1:N (creates)
         │
         ▼
┌─────────────────┐
│    PROJECT      │
├─────────────────┤
│ _id: ObjectId   │
│ name: String    │
│ description: Str│
│ owner: ObjectId │◄─── FK to User
│ members: [ObjId]│
│ status: Enum    │
│ priority: Enum  │
│ createdAt: Date │
└────────┬────────┘
         │
         │ 1:N (contains)
         │
         ▼
┌─────────────────┐
│      TASK       │
├─────────────────┤
│ _id: ObjectId   │
│ title: String   │
│ description: Str│
│ project: ObjId  │◄─── FK to Project
│ assignedTo: ObjId│◄─── FK to User
│ status: Enum    │
│ priority: Enum  │
│ dueDate: Date   │
│ tags: [String]  │
│ createdAt: Date │
└─────────────────┘

Relationships:
- User → Projects (1:N) - One user creates many projects
- User → Tasks (1:N) - One user is assigned many tasks
- Project → Tasks (1:N) - One project contains many tasks
- Project → Users (N:M) - Projects have multiple members
```

## 2. Use Case Diagram

```
                    ┌──────────────────┐
                    │   Guest User     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Register        │
                    │  Login           │
                    │  View Landing    │
                    └──────────────────┘

    ┌──────────────────┐
    │ Authenticated    │
    │     User         │
    └────────┬─────────┘
             │
    ┌────────▼──────────────────────────┐
    │                                    │
    │  • View Dashboard                 │
    │  • Create Project                 │
    │  • View Projects                  │
    │  • Update Project                 │
    │  • Delete Project                 │
    │  • Create Task                    │
    │  • View Tasks                     │
    │  • Update Task                    │
    │  • Delete Task                    │
    │  • Assign Task                    │
    │  • Filter/Search Tasks            │
    │  • View Analytics                 │
    │  • Update Profile                 │
    │  • Logout                         │
    │                                    │
    └───────────────────────────────────┘

    ┌──────────────────┐
    │   Admin User     │
    └────────┬─────────┘
             │
    ┌────────▼──────────────────────────┐
    │  All User Actions +               │
    │  • Manage All Projects            │
    │  • Manage All Users               │
    │  • View System Analytics          │
    │  • Delete Any Resource            │
    └───────────────────────────────────┘
```

## 3. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          React + TypeScript Frontend                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │   Pages    │  │ Components │  │   Redux    │     │   │
│  │  │            │  │            │  │   Store    │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  │                                                        │   │
│  │  TailwindCSS • React Router • Axios • Recharts       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS/REST API
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js + TypeScript Backend              │   │
│  │                                                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Routes  │→ │Controllers│→ │ Services │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────┐            │   │
│  │  │         Middleware Layer             │            │   │
│  │  │  • JWT Auth                          │            │   │
│  │  │  • Validation                        │            │   │
│  │  │  • Error Handling                    │            │   │
│  │  │  • Rate Limiting                     │            │   │
│  │  └──────────────────────────────────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Mongoose ODM
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     DATABASE LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Users   │  │ Projects │  │  Tasks   │           │   │
│  │  │Collection│  │Collection│  │Collection│           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT LAYER                          │
│                                                               │
│  Frontend: Vercel (CDN + Edge Network)                       │
│  Backend: Render/Railway (Container-based)                   │
│  Database: MongoDB Atlas (Cloud Cluster)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 4. Folder Structure

### Frontend Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Loader.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── ProjectList.tsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskBoard.tsx
│   │   └── charts/
│   │       ├── BarChart.tsx
│   │       ├── LineChart.tsx
│   │       └── PieChart.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Tasks.tsx
│   │   ├── Analytics.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── projectSlice.ts
│   │   │   ├── taskSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── types.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   └── taskService.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── .env.example
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

### Backend Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   └── Task.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── projectController.ts
│   │   ├── taskController.ts
│   │   └── analyticsController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── taskRoutes.ts
│   │   └── analyticsRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   ├── taskService.ts
│   │   └── analyticsService.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── env.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## 5. API Endpoints Documentation

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile           - Update profile
PUT    /api/auth/password          - Change password
```

### Project Endpoints
```
GET    /api/projects               - Get all projects (paginated)
GET    /api/projects/:id           - Get project by ID
POST   /api/projects               - Create new project
PUT    /api/projects/:id           - Update project
DELETE /api/projects/:id           - Delete project
GET    /api/projects/:id/tasks     - Get project tasks
POST   /api/projects/:id/members   - Add project member
DELETE /api/projects/:id/members/:userId - Remove member
```

### Task Endpoints
```
GET    /api/tasks                  - Get all tasks (paginated, filtered)
GET    /api/tasks/:id              - Get task by ID
POST   /api/tasks                  - Create new task
PUT    /api/tasks/:id              - Update task
DELETE /api/tasks/:id              - Delete task
PATCH  /api/tasks/:id/status       - Update task status
PATCH  /api/tasks/:id/assign       - Assign task to user
```

### Analytics Endpoints
```
GET    /api/analytics/overview     - Get dashboard overview stats
GET    /api/analytics/projects     - Get project analytics
GET    /api/analytics/tasks        - Get task analytics
GET    /api/analytics/users        - Get user performance
```

### Request/Response Examples

#### POST /api/auth/register
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /api/projects?page=1&limit=10&status=active
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Website Redesign",
        "description": "Redesign company website",
        "owner": "507f1f77bcf86cd799439011",
        "status": "active",
        "priority": "high",
        "members": ["507f1f77bcf86cd799439011"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3,
      "limit": 10
    }
  }
}
```

## 6. Sequence Diagrams

### Login Sequence
```
User          Frontend        Backend         Database
 │               │               │               │
 │──Login Form──>│               │               │
 │               │──POST /login─>│               │
 │               │               │──Query User──>│
 │               │               │<──User Data───│
 │               │               │               │
 │               │               │──Verify Pass──│
 │               │               │──Generate JWT─│
 │               │<──Tokens──────│               │
 │               │──Store Token──│               │
 │<──Redirect────│               │               │
 │   Dashboard   │               │               │
```

### Create Task Sequence
```
User          Frontend        Backend         Database
 │               │               │               │
 │──Fill Form───>│               │               │
 │──Submit──────>│               │               │
 │               │──POST /tasks─>│               │
 │               │  (+ JWT)      │               │
 │               │               │──Verify JWT───│
 │               │               │──Validate─────│
 │               │               │──Create Task─>│
 │               │               │<──Task Doc────│
 │               │<──Task Data───│               │
 │               │──Update Redux─│               │
 │<──Show Toast──│               │               │
 │   Success     │               │               │
```

### Dashboard Load Sequence
```
User          Frontend        Backend         Database
 │               │               │               │
 │──Navigate────>│               │               │
 │   /dashboard  │               │               │
 │               │──GET /analytics/overview──>│  │
 │               │  (+ JWT)      │               │
 │               │               │──Aggregate───>│
 │               │               │<──Stats───────│
 │               │<──Analytics───│               │
 │               │               │               │
 │               │──GET /projects?limit=5────>│  │
 │               │               │──Query───────>│
 │               │               │<──Projects────│
 │               │<──Projects────│               │
 │               │               │               │
 │               │──GET /tasks?limit=10──────>│  │
 │               │               │──Query───────>│
 │               │               │<──Tasks───────│
 │               │<──Tasks───────│               │
 │               │               │               │
 │<──Render──────│               │               │
 │   Dashboard   │               │               │
```

## 7. Redux State Management Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Redux Store                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  authSlice                                      │    │
│  │  ─────────                                      │    │
│  │  state: {                                       │    │
│  │    user: User | null                           │    │
│  │    accessToken: string | null                  │    │
│  │    isAuthenticated: boolean                    │    │
│  │    loading: boolean                            │    │
│  │  }                                              │    │
│  │  actions: login, logout, updateProfile         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  projectSlice                                   │    │
│  │  ────────────                                   │    │
│  │  state: {                                       │    │
│  │    projects: Project[]                         │    │
│  │    currentProject: Project | null              │    │
│  │    loading: boolean                            │    │
│  │    error: string | null                        │    │
│  │    pagination: { page, total, pages }          │    │
│  │  }                                              │    │
│  │  actions: fetchProjects, createProject,        │    │
│  │           updateProject, deleteProject         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  taskSlice                                      │    │
│  │  ─────────                                      │    │
│  │  state: {                                       │    │
│  │    tasks: Task[]                               │    │
│  │    currentTask: Task | null                    │    │
│  │    filters: { status, priority, assignee }     │    │
│  │    loading: boolean                            │    │
│  │    error: string | null                        │    │
│  │  }                                              │    │
│  │  actions: fetchTasks, createTask,              │    │
│  │           updateTask, deleteTask, filterTasks  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  uiSlice                                        │    │
│  │  ───────                                        │    │
│  │  state: {                                       │    │
│  │    sidebarOpen: boolean                        │    │
│  │    theme: 'light' | 'dark'                     │    │
│  │    toasts: Toast[]                             │    │
│  │    modal: { open: boolean, content: any }      │    │
│  │  }                                              │    │
│  │  actions: toggleSidebar, setTheme,             │    │
│  │           showToast, openModal, closeModal     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘

Component Tree:
App
├── Navbar (reads: auth, ui)
├── Sidebar (reads: auth, ui)
└── Routes
    ├── Dashboard (reads: auth, projects, tasks)
    ├── Projects (reads: projects, dispatches: project actions)
    ├── Tasks (reads: tasks, dispatches: task actions)
    └── Profile (reads: auth, dispatches: auth actions)
```

## 8. Security Considerations

### Authentication & Authorization
- JWT tokens with expiration (access: 15min, refresh: 7days)
- Passwords hashed with bcryptjs (10 rounds)
- Role-based access control (RBAC)
- Protected routes on frontend and backend

### Data Validation
- Input validation on both client and server
- Mongoose schema validation
- XSS protection
- SQL injection prevention (NoSQL)

### API Security
- Rate limiting (100 requests/15min per IP)
- CORS configuration
- Helmet.js for security headers
- Environment variables for secrets

## 9. Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists
- Image optimization
- Bundle size optimization

### Backend
- Database indexing (email, project owner, task status)
- Query optimization with select() and populate()
- Response caching for analytics
- Pagination for large datasets
- Connection pooling

## 10. Testing Strategy

### Frontend Testing
- Unit tests: Components (Jest + React Testing Library)
- Integration tests: Redux slices
- E2E tests: Critical user flows (Cypress)

### Backend Testing
- Unit tests: Services and utilities (Jest)
- Integration tests: API endpoints (Supertest)
- Database tests: Model validation

## 11. Deployment Strategy

### CI/CD Pipeline
```
Code Push → GitHub
    ↓
Run Tests (GitHub Actions)
    ↓
Build Frontend → Deploy to Vercel
    ↓
Build Backend → Deploy to Render
    ↓
Update Environment Variables
    ↓
Health Check
    ↓
Production Live
```

### Environment Configuration
- Development: Local MongoDB, local servers
- Staging: MongoDB Atlas (staging), test deployments
- Production: MongoDB Atlas (prod), Vercel + Render

## 12. Monitoring & Maintenance

### Logging
- Winston for backend logging
- Error tracking with console groups
- Request/response logging

### Monitoring
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Vercel Analytics)
- Database monitoring (MongoDB Atlas)

### Backup Strategy
- Daily automated MongoDB backups
- Point-in-time recovery enabled
- Backup retention: 7 days
