import { Request, Response } from "express";

import { RegisterInput, LoginInput } from "@validations/auth.validation";
import { catchAsync } from "@/utils/catch-async";
import { httpStatus } from "@/utils/http-status";
import { ApiResponse } from "@/utils/api-response";
import { authService } from "@/services/auth.service";

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const userData: RegisterInput = req.body;
    const result = await authService.register(userData);

    res
      .status(httpStatus.CREATED)
      .json(ApiResponse.success("Registration successful", result));
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password }: LoginInput = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get("user-agent");

    const result = await authService.login(
      email,
      password,
      ipAddress,
      userAgent,
    );

    res.json(ApiResponse.success("Login successful", result));
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await authService.logout(token);
    }

    res.json(ApiResponse.success("Logout successful"));
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAuth(refreshToken);

    res.json(ApiResponse.success("Token refreshed successfully", tokens));
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    res.json(ApiResponse.success("Profile retrieved successfully", req.user));
  });

  getSessions = catchAsync(async (req: Request, res: Response) => {
    const sessions = await authService.getActiveSessions(req.user!.id);

    res.json(ApiResponse.success("Sessions retrieved successfully", sessions));
  });

  revokeSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params as { sessionId: string };
    await authService.revokeSession(sessionId);

    res.json(ApiResponse.success("Session revoked successfully"));
  });

  revokeAllSessions = catchAsync(async (req: Request, res: Response) => {
    await authService.revokeAllUserSessions(req.user!.id);

    res.json(ApiResponse.success("All sessions revoked successfully"));
  });
}

export const authController = new AuthController();
