import { Project } from '../models/Project';
import { IProject, IPaginationQuery, IPaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class ProjectService {
  // Get paginated projects for a user
  static async getProjects(
      userId: string,
      query: IPaginationQuery & { status?: string; priority?: string }
  ): Promise<IPaginatedResponse<IProject>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [{ owner: userId }, { members: userId }],
    };

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;

    const [projects, total] = await Promise.all([
      Project.find(filter)
          .populate('owner', 'name email avatar')
          .populate('members', 'name email avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean<IProject[]>(), // ✅ Returns array
      Project.countDocuments(filter),
    ]);

    return {
      data: projects, // ✅ array of IProject
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get a single project by ID
  static async getProjectById(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId)
        .populate('owner', 'name email avatar')
        .populate('members', 'name email avatar')
        .lean<IProject>();

    if (!project) throw new AppError('Project not found', 404);

    const hasAccess =
        project.owner._id.toString() === userId ||
        project.members.some(member => member._id.toString() === userId);

    if (!hasAccess) throw new AppError('Not authorized to access this project', 403);

    return project;
  }

  // Create a new project
  static async createProject(
      userId: string,
      data: Pick<IProject, 'name' | 'description' | 'status' | 'priority'>
  ): Promise<IProject> {
    const projectDoc = await Project.create({
      ...data,
      owner: userId,
      members: [userId],
    });

    return projectDoc.populate('owner', 'name email avatar');
  }

  // Update an existing project
  static async updateProject(
      projectId: string,
      userId: string,
      updates: Partial<Pick<IProject, 'name' | 'description' | 'status' | 'priority'>>
  ): Promise<IProject> {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403);

    Object.assign(project, updates);
    await project.save();

    return project.populate('owner', 'name email avatar');
  }

  // Delete a project
  static async deleteProject(projectId: string, userId: string): Promise<void> {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403);

    await project.deleteOne();
  }

  // Add a member to a project
  static async addMember(
      projectId: string,
      userId: string,
      memberId: string
  ): Promise<IProject> {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403);

    if (project.members.includes(memberId as any)) throw new AppError('User is already a member', 400);

    project.members.push(memberId as any);
    await project.save();

    return project.populate('members', 'name email avatar');
  }

  // Remove a member from a project
  static async removeMember(
      projectId: string,
      userId: string,
      memberId: string
  ): Promise<IProject> {
    const project = await Project.findById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    if (project.owner.toString() !== userId) throw new AppError('Not authorized', 403);

    if (project.owner.toString() === memberId) throw new AppError('Cannot remove project owner', 400);

    project.members = project.members.filter(member => member.toString() !== memberId);
    await project.save();

    return project.populate('members', 'name email avatar');
  }
}
