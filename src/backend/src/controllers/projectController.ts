import { Response } from 'express';
import { IAuthRequest } from '../types';
import { ProjectService } from '../services/projectService';

export const projectController = {
  
  async getProjects(req: IAuthRequest, res: Response) {
    try {
      const projects = await ProjectService.getProjects(req.user!.id, req.query as any);
      res.status(200).json({ success: true, data: projects });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getProjectById(req: IAuthRequest, res: Response) {
    try {
      const project = await ProjectService.getProjectById(req.params.id, req.user!.id);
      res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async createProject(req: IAuthRequest, res: Response) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async updateProject(req: IAuthRequest, res: Response) {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.user!.id, req.body);
      res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async deleteProject(req: IAuthRequest, res: Response) {
    try {
      await ProjectService.deleteProject(req.params.id, req.user!.id);
      res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async addMember(req: IAuthRequest, res: Response) {
    try {
      const { memberId } = req.body;
      const project = await ProjectService.addMember(req.params.id, req.user!.id, memberId);
      res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async removeMember(req: IAuthRequest, res: Response) {
    try {
      const { memberId } = req.params;
      const project = await ProjectService.removeMember(req.params.id, req.user!.id, memberId);
      res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }
};
