// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import { Role } from "@/generated/prisma/client";
import { authService } from "@/services/auth.service";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const user = await authService.verifyToken(token);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user as any;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Authentication required"),
      );
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, "Insufficient permissions"),
      );
    }

    next();
  };
};
