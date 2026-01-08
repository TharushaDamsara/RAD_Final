import { User } from '../models/User';
import { IUser, IAuthResponse, IUserResponse } from '../types';
import { generateAccessToken, generateRefreshToken } from '../config/jwt';
import { AppError } from '../middleware/errorHandler';
export class AuthService {
  static async register(name: string, email: string, password: string): Promise<IAuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate tokens
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    return {
      user: this.formatUserResponse(user),
      accessToken,
      refreshToken
    };
  }
  static async login(email: string, password: string): Promise<IAuthResponse> {
    // Find user with password field
    const user = await User.findOne({
      email
    }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    return {
      user: this.formatUserResponse(user),
      accessToken,
      refreshToken
    };
  }
  static async getCurrentUser(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }
  static async updateProfile(userId: string, updates: Partial<Pick<IUser, 'name' | 'avatar'>>): Promise<IUserResponse> {
    const user = await User.findByIdAndUpdate(userId, {
      $set: updates
    }, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }
    user.password = newPassword;
    await user.save();
  }
  private static formatUserResponse(user: IUser): IUserResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    };
  }
}