# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variables:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-api.render.com/api`)
6. Click "Deploy"

### Step 3: Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records as instructed

## Backend Deployment (Render)

### Step 1: Prepare Backend
Ensure your `backend/package.json` has:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: task-management-api
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Sign in
3. Create a new project
4. Build a cluster (choose Free tier)
5. Select cloud provider and region

### Step 2: Configure Security
1. **Database Access**:
   - Click "Database Access" in sidebar
   - Add new database user
   - Choose password authentication
   - Set username and strong password
   - Grant "Read and write to any database" role

2. **Network Access**:
   - Click "Network Access" in sidebar
   - Add IP Address
   - For development: Add `0.0.0.0/0` (allow from anywhere)
   - For production: Add your server's IP

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `taskmanager`
6. Add to your backend environment variables

## Post-Deployment Checklist

### Frontend
- [ ] Deployed successfully to Vercel
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Can access landing page

### Backend
- [ ] Deployed successfully to Render
- [ ] All environment variables set
- [ ] Health check endpoint responding (`/health`)
- [ ] Can make API requests
- [ ] CORS configured for frontend URL

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string working
- [ ] Backend can connect to database

### Testing
- [ ] Register new user works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Analytics page works
- [ ] Profile page works

## Troubleshooting

### Frontend Issues
- **Build fails**: Check package.json dependencies
- **API calls fail**: Verify REACT_APP_API_URL is correct
- **CORS errors**: Check backend CORS configuration

### Backend Issues
- **Build fails**: Check TypeScript compilation errors
- **Server won't start**: Check environment variables
- **Database connection fails**: Verify MongoDB URI and network access
- **401 errors**: Check JWT_SECRET is set

### Database Issues
- **Connection timeout**: Check network access whitelist
- **Authentication failed**: Verify database user credentials
- **Database not found**: Check database name in connection string

## Monitoring

### Vercel
- View deployment logs in Vercel dashboard
- Monitor analytics and performance
- Set up custom alerts

### Render
- View logs in Render dashboard
- Monitor resource usage
- Set up health checks

### MongoDB Atlas
- Monitor database metrics
- Set up alerts for high usage
- Review slow queries

## Scaling

### Frontend
- Vercel automatically scales
- Consider upgrading plan for more bandwidth

### Backend
- Upgrade Render instance type
- Add more instances for load balancing
- Implement caching (Redis)

### Database
- Upgrade MongoDB Atlas tier
- Add read replicas
- Implement database indexing

## Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **API Security**
   - Keep rate limiting enabled
   - Monitor for suspicious activity
   - Use HTTPS only

3. **Database Security**
   - Use strong passwords
   - Restrict network access
   - Enable encryption at rest

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Track user authentication attempts
