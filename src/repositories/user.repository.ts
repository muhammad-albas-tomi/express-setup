// src/repositories/user.repository.ts
import { BaseRepository } from "./base.repository";
import {
  IUser,
  ICreateUserInput,
  IUpdateUserInput,
} from "@interfaces/user.interface";
import { prisma } from "@config/database";
import { Prisma, User } from "@/generated/prisma/client";

export class UserRepository extends BaseRepository<
  User,
  ICreateUserInput,
  IUpdateUserInput
> {
  constructor() {
    super("user", "User");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findWithPosts(id: string): Promise<User | null> {
    return this.findById(id, {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    });
  }

  async findActiveUsers(options?: any): Promise<any> {
    return this.findAll({ isActive: true }, options);
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.update(id, { lastLogin: new Date() } as IUpdateUserInput);
  }

  async getUsersWithStats(): Promise<any[]> {
    try {
      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users.map((user) => ({
        ...user,
        password: undefined,
        postsCount: user._count.posts,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchUsers(searchTerm: string, options?: any): Promise<any> {
    return this.findAll(
      {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      options,
    );
  }

  async bulkUpdateStatus(
    userIds: string[],
    isActive: boolean,
  ): Promise<{ count: number }> {
    return this.updateMany({ id: { in: userIds } }, { isActive });
  }
}

export const userRepository = new UserRepository();
