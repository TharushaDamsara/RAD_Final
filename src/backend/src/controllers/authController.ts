import { Response } from 'express';
import { IAuthRequest } from '../types';
import { AuthService } from '../services/authService';
export const authController = {
  async register(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password
      } = req.body;
      const result = await AuthService.register(name, email, password);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  },
  async login(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const {
        email,
        password
      } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  },
  async getCurrentUser(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getCurrentUser(userId);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  },
  async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const updates = req.body;
      const user = await AuthService.updateProfile(userId, updates);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  },
  async changePassword(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        currentPassword,
        newPassword
      } = req.body;
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
      });
    }
  },
  async logout(_req: IAuthRequest, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
};