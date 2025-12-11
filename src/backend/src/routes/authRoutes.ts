import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
const router = Router();

// Public routes
router.post('/register', authLimiter, validate([body('name').trim().notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Valid email is required'), body('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters')]), authController.register);
router.post('/login', authLimiter, validate([body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')]), authController.login);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, validate([body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')]), authController.updateProfile);
router.put('/password', authenticate, validate([body('currentPassword').notEmpty().withMessage('Current password is required'), body('newPassword').isLength({
  min: 6
}).withMessage('New password must be at least 6 characters')]), authController.changePassword);
router.post('/logout', authenticate, authController.logout);
export default router;