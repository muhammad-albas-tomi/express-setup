// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, Role } from "@/generated/prisma/client";
import { userService } from "./user.service";
import { userRepository } from "@/repositories/user.repository";
import { prisma } from "@config/database";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import { environment } from "@config/environment";
import { logger } from "@/utils/logger";
import {
  ILoginInput,
  ILoginResponse,
  ITokens,
  ICreateUserInput,
} from "@/interfaces/user.interface";

interface Session {
  id: string;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_EXPIRY = "30m";
  private static readonly REFRESH_TOKEN_EXPIRY = "7d";
  private static readonly REFRESH_TOKEN_SIZE = 32;

  private async generateToken(
    userId: string,
    expires: string,
  ): Promise<string> {
    const payload = { sub: userId, type: "access" };
    return jwt.sign(payload, environment.jwtSecret, {
      expiresIn: expires,
    } as jwt.SignOptions);
  }

  private async generateRefreshToken(): Promise<{
    token: string;
    expires: Date;
  }> {
    const token = crypto
      .randomBytes(AuthService.REFRESH_TOKEN_SIZE)
      .toString("hex");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    return { token, expires };
  }

  /**
   * Generate access token dan refresh token
   *
   * Note: Refresh token disimpan ke database dan di-return untuk
   * keperluan set httpOnly cookie di controller
   */
  private async generateAuthTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateToken(user.id, "30m");
    const { token: refreshToken, expires } = await this.generateRefreshToken();

    await prisma.session.create({
      data: { token: refreshToken, userId: user.id, expiresAt: expires },
    });

    return {
      accessToken,
      refreshToken, // Return untuk set cookie di controller
    };
  }

  async register(userData: ICreateUserInput): Promise<ILoginResponse> {
    try {
      // Create user
      const user = await userService.createUser(userData);

      // Get full user for token generation
      const fullUser = await userRepository.findByEmail(user.email);
      if (!fullUser) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "User creation failed",
        );
      }

      // Generate tokens
      const tokens = await this.generateAuthTokens(fullUser);

      return {
        user,
        tokens,
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ILoginResponse> {
    try {
      // Validate user credentials
      const user = await userService.validatePassword(email, password);

      if (!user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Incorrect email or password",
        );
      }

      // Update last login
      await userRepository.updateLastLogin(user.id);

      // Generate tokens
      const tokens = await this.generateAuthTokens(user);

      // Update session info
      const refreshToken = tokens.refreshToken;
      await prisma.session.update({
        where: { token: refreshToken },
        data: {
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
        },
      });

      logger.info(`User logged in: ${user.email}`);

      // Return user without password
      const { password: _, ...userResponse } = user;

      return {
        user: userResponse as any,
        tokens,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: {
          token,
        },
      });

      logger.info("User logged out");
    } catch (error) {
      logger.error("Logout error:", error);
      throw error;
    }
  }

  async refreshAuth(refreshToken: string): Promise<ITokens> {
    try {
      // Find session
      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
      }

      // Delete old session
      await prisma.session.delete({
        where: { token: refreshToken },
      });

      // Generate new tokens
      const tokens = await this.generateAuthTokens(session.user as User);

      logger.info(`Token refreshed for user: ${session.user.email}`);

      return tokens;
    } catch (error) {
      logger.error("Refresh token error:", error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = jwt.verify(token, environment.jwtSecret) as {
        sub: string;
      };

      const user = await userRepository.findById(payload.sub);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      return user;
    } catch (error) {
      logger.error("Token verification error:", error);
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
    }
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return sessions as Session[];
  }

  async revokeSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId },
    });

    logger.info(`Session revoked: ${sessionId}`);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });

    logger.info(`All sessions revoked for user: ${userId}`);
  }
}

export const authService = new AuthService();
