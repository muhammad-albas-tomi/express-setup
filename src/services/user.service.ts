// src/services/user.service.ts
import bcrypt from "bcryptjs";
import { User, Role } from "@/generated/prisma/client";
import { userRepository } from "@repositories/user.repository";
import { BaseService } from "./base.service";

import { logger } from "@utils/logger";
import {
  ICreateUserInput,
  IUpdateUserInput,
  IUserResponse,
} from "@interfaces/user.interface";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import { IFindAllOptions } from "@/repositories/repository.inteface";

export class UserService extends BaseService<
  User,
  ICreateUserInput,
  IUpdateUserInput
> {
  constructor() {
    super(userRepository, "User");
  }

  private sanitizeUser(user: User): IUserResponse {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser as IUserResponse;
  }

  async createUser(userData: ICreateUserInput): Promise<IUserResponse> {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, "Email already registered");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      logger.info(`User created: ${user.email}`);
      return this.sanitizeUser(user);
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUserResponse> {
    this.validateId(id);
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return this.sanitizeUser(user);
  }

  async getUserByEmail(email: string): Promise<IUserResponse | null> {
    const user = await userRepository.findByEmail(email);
    return user ? this.sanitizeUser(user) : null;
  }

  async getAllUsers(query: any): Promise<any> {
    const filter: any = {};

    // Build filter
    if (query.role && Object.values(Role).includes(query.role as Role)) {
      filter.role = query.role;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true";
    }

    if (query.search) {
      filter.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Build options
    const options: IFindAllOptions = {
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
      sortBy: query.sortBy || "createdAt",
      sortOrder: query.sortOrder || "desc",
    };

    const result = await userRepository.findAll(filter, options);

    // Sanitize users and create a new result object
    const sanitizedResult = {
      ...result,
      data: result.data.map((user) => this.sanitizeUser(user as User)),
    };

    return sanitizedResult;
  }

  async updateUser(
    id: string,
    updateData: IUpdateUserInput,
  ): Promise<IUserResponse> {
    this.validateId(id);
    const user = await this.getUserById(id);

    // If updating email, check if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, "Email already taken");
      }
    }

    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userRepository.update(id, updateData);

    logger.info(`User updated: ${updatedUser.email}`);
    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(id: string): Promise<IUserResponse> {
    this.validateId(id);
    const user = await this.getUserById(id);
    await userRepository.delete(id);
    logger.info(`User deleted: ${user.email}`);
    return user;
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<User | false> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return false;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    this.validateId(userId);
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Current password is incorrect",
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await userRepository.update(userId, {
      password: hashedPassword,
    } as IUpdateUserInput);

    logger.info(`Password changed for user: ${user.email}`);
    return true;
  }

  async getUsersWithStats(): Promise<any[]> {
    const users = await userRepository.getUsersWithStats();
    return users;
  }

  async searchUsers(searchTerm: string, options: any): Promise<any> {
    const result = await userRepository.searchUsers(searchTerm, options);

    // Sanitize users
    result.data = result.data.map((user: User) => this.sanitizeUser(user));

    return result;
  }

  async bulkUpdateStatus(
    userIds: string[],
    isActive: boolean,
  ): Promise<{ count: number }> {
    // Validate all IDs
    userIds.forEach((id) => this.validateId(id));

    const result = await userRepository.bulkUpdateStatus(userIds, isActive);
    logger.info(`Bulk status update: ${result.count} users affected`);
    return result;
  }

  async getUserWithPosts(id: string): Promise<any> {
    this.validateId(id);
    const userWithPosts = await userRepository.findWithPosts(id);
    if (!userWithPosts) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    // Type assertion for user with posts
    const userWithPostsData = userWithPosts as any;
    return {
      ...this.sanitizeUser(userWithPosts),
      posts: userWithPostsData.posts || [],
    };
  }
}

export const userService = new UserService();
