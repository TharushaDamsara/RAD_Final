import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { projectController } from '../controllers/projectController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all projects (paginated + filters)
router.get(
  '/',
  projectController.getProjects
);

// Get project by ID
router.get(
  '/:id',
  validate([param('id').isMongoId()]),
  projectController.getProjectById
);

// Create new project
router.post(
  '/',
  validate([
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status').optional().isString(),
    body('priority').optional().isString()
  ]),
  projectController.createProject
);

// Update project
router.put(
  '/:id',
  validate([param('id').isMongoId()]),
  projectController.updateProject
);

// Delete project
router.delete(
  '/:id',
  validate([param('id').isMongoId()]),
  projectController.deleteProject
);

// Add member to project
router.post(
  '/:id/members',
  validate([param('id').isMongoId()]),
  projectController.addMember
);

// Remove member from project
router.delete(
  '/:id/members/:userId',
  validate([
    param('id').isMongoId(),
    param('userId').isMongoId()
  ]),
  projectController.removeMember
);

export default router;
