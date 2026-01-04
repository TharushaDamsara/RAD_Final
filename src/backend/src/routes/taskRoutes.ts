import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { taskController } from '../controllers/taskController';

const router = Router();

// Require authentication for all routes
router.use(authenticate);

// Get all tasks (with optional pagination/filtering)
router.get('/', taskController.getTasks);

// Get single task by ID
router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid Task ID')]),
  taskController.getTaskById
);

// Create new task
router.post(
  '/',
  validate([
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').optional().isString(),
    body('status').optional().isString(),
    body('priority').optional().isString(),
    body('projectId').isMongoId().withMessage('Project ID is required')
  ]),
  taskController.createTask
);

// Update existing task
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid Task ID'),
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('status').optional().isString(),
    body('priority').optional().isString()
  ]),
  taskController.updateTask
);

// Delete a task
router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid Task ID')]),
  taskController.deleteTask
);

export default router;
