import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { IAnalyticsOverview } from '../types';

export class AnalyticsService {
  // Dashboard overview
  static async getOverview(userId: string): Promise<IAnalyticsOverview> {
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('_id status');

    const projectIds = userProjects.map(p => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds }
    }).select('status priority');

    const totalProjects = userProjects.length;
    const activeProjects = userProjects.filter(p => p.status === 'active').length;
    const completedProjects = userProjects.filter(p => p.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;

    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectsByStatus = userProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = await Task.find({
      project: { $in: projectIds }
    })
        .populate('project', 'name')
        .populate('assignedTo', 'name')
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean();

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      tasksByStatus: tasksByStatus as any,
      tasksByPriority: tasksByPriority as any,
      projectsByStatus: projectsByStatus as any,
      recentActivity
    };
  }

  // Analytics for all projects of user
  static async getProjectAnalytics(userId: string) {
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('name status createdAt');

    const projectsWithTasks = await Promise.all(
        projects.map(async project => {
          const tasks = await Task.find({ project: project._id });
          const completedTasks = tasks.filter(t => t.status === 'done').length;

          return {
            _id: project._id,
            name: project.name,
            status: project.status,
            totalTasks: tasks.length,
            completedTasks,
            completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
            createdAt: project.createdAt
          };
        })
    );

    return projectsWithTasks;
  }

  // Task analytics (optionally by date range)
  static async getTaskAnalytics(userId: string, startDate?: string, endDate?: string) {
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('_id');

    const projectIds = userProjects.map(p => p._id);

    const query: any = { project: { $in: projectIds } };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const tasks = await Task.find(query)
        .populate('project', 'name')
        .select('title status priority dueDate createdAt');

    const tasksByMonth = tasks.reduce((acc, task) => {
      const month = task.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { tasks, tasksByMonth };
  }

  // User productivity metrics
  static async getUserProductivity(userId: string, period: string) {
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('_id');

    const projectIds = userProjects.map(p => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
      status: 'done'
    });

    // For demo: filter by period if needed
    // e.g., "week", "month", "year"
    let filteredTasks = tasks;
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filteredTasks = tasks.filter(t => t.createdAt >= weekAgo);
    }

    return {
      totalCompletedTasks: filteredTasks.length
    };
  }
}
