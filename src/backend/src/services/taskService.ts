import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { ITask, IPaginationQuery, IPaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class TaskService {
  // Get paginated tasks
  static async getTasks(
      userId: string,
      query: IPaginationQuery & { status?: string; priority?: string; project?: string; assignedTo?: string }
  ): Promise<IPaginatedResponse<ITask>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.project) filter.project = query.project;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;

    // Get user's projects
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('_id');

    const projectIds = userProjects.map(p => p._id);
    filter.project = { $in: projectIds };

    // Fetch tasks
    const [tasksRaw, total] = await Promise.all([
      Task.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('project', 'name')
          .populate('assignedTo', 'name email avatar')
          .populate('createdBy', 'name email avatar')
          .lean(),
      Task.countDocuments(filter)
    ]);

    // Cast tasks to ITask[] safely
    const tasks = tasksRaw as unknown as ITask[];

    return {
      data: tasks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    };
  }

  // Get single task
  static async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await Task.findById(taskId)
        .populate('project', 'name')
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar');

    if (!task) throw new AppError('Task not found', 404);

    const project = await Project.findById(task.project);
    if (!project) throw new AppError('Project not found', 404);

    const hasAccess = project.owner.toString() === userId || project.members.some(m => m.toString() === userId);
    if (!hasAccess) throw new AppError('Not authorized to access this task', 403);

    return task;
  }

  // Create a new task
  static async createTask(
      userId: string,
      data: Pick<ITask, 'title' | 'description' | 'project' | 'status' | 'priority' | 'dueDate' | 'tags'> & { assignedTo?: string }
  ): Promise<ITask> {
    const project = await Project.findById(data.project);
    if (!project) throw new AppError('Project not found', 404);

    const hasAccess = project.owner.toString() === userId || project.members.some(m => m.toString() === userId);
    if (!hasAccess) throw new AppError('Not authorized to create tasks in this project', 403);

    const task = await Task.create({ ...data, createdBy: userId });

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    return task;
  }

  // Update task
  static async updateTask(
      taskId: string,
      userId: string,
      updates: Partial<Pick<ITask, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'tags'>>
  ): Promise<ITask> {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    const project = await Project.findById(task.project);
    if (!project) throw new AppError('Project not found', 404);

    const hasAccess = project.owner.toString() === userId || project.members.some(m => m.toString() === userId);
    if (!hasAccess) throw new AppError('Not authorized to update this task', 403);

    Object.assign(task, updates);
    await task.save();

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    return task;
  }

  // Delete task
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    const project = await Project.findById(task.project);
    if (!project) throw new AppError('Project not found', 404);

    const isOwner = project.owner.toString() === userId;
    const isCreator = task.createdBy.toString() === userId;
    if (!isOwner && !isCreator) throw new AppError('Not authorized to delete this task', 403);

    await task.deleteOne();
  }

  // Assign task to a member
  static async assignTask(taskId: string, userId: string, assigneeId: string): Promise<ITask> {
    const task = await Task.findById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    const project = await Project.findById(task.project);
    if (!project) throw new AppError('Project not found', 404);

    const hasAccess = project.owner.toString() === userId || project.members.some(m => m.toString() === userId);
    if (!hasAccess) throw new AppError('Not authorized to assign this task', 403);

    const isProjectMember = project.members.some(m => m.toString() === assigneeId);
    if (!isProjectMember) throw new AppError('Assignee must be a project member', 400);

    task.assignedTo = assigneeId as any;
    await task.save();

    await task.populate('project', 'name');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    return task;
  }
}
