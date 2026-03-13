import { Request, Response } from "express";

import { RegisterInput, LoginInput } from "@validations/auth.validation";
import { catchAsync } from "@/utils/catch-async";
import { httpStatus } from "@/utils/http-status";
import { ApiResponse } from "@/utils/api-response";
import { ApiError } from "@/utils/api-error";
import { authService } from "@/services/auth.service";
import { getCookieConfig, REFRESH_TOKEN_COOKIE } from "@/utils/cookie-options";

export class AuthController {
  /**
   * Register new user
   *
   * Set refresh token ke httpOnly cookie
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const userData: RegisterInput = req.body;
    const result = await authService.register(userData);

    // Set refresh token ke httpOnly cookie
    if (result.tokens?.refreshToken) {
      res.cookie(
        REFRESH_TOKEN_COOKIE,
        result.tokens.refreshToken,
        getCookieConfig(),
      );
    }

    // Response tanpa refreshToken di body
    res
      .status(httpStatus.CREATED)
      .json(
        ApiResponse.success("Registration successful", {
          user: result.user,
          tokens: {
            accessToken: result.tokens?.accessToken,
          },
        }),
      );
  });

  /**
   * Login user
   *
   * Set refresh token ke httpOnly cookie
   */
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

    // Set refresh token ke httpOnly cookie
    if (result.tokens?.refreshToken) {
      res.cookie(
        REFRESH_TOKEN_COOKIE,
        result.tokens.refreshToken,
        getCookieConfig(),
      );
    }

    // Response tanpa refreshToken di body
    res.json(
      ApiResponse.success("Login successful", {
        user: result.user,
        tokens: {
          accessToken: result.tokens?.accessToken,
        },
      }),
    );
  });

  /**
   * Logout user
   *
   * Hapus session dari DB dan clear httpOnly cookie
   */
  logout = catchAsync(async (req: Request, res: Response) => {
    // Ambil refresh token dari cookie
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear httpOnly cookie
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });

    res.json(ApiResponse.success("Logout successful"));
  });

  /**
   * Refresh access token
   *
   * Baca refresh token dari httpOnly cookie, generate token baru,
   * dan set cookie baru (token rotation)
   */
  refreshToken = catchAsync(async (req: Request, res: Response) => {
    // Ambil refresh token dari cookie (bukan dari body)
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Refresh token not found. Please login again.",
      );
    }

    const tokens = await authService.refreshAuth(refreshToken);

    // Set refresh token BARU ke httpOnly cookie (rotation)
    if (tokens.refreshToken) {
      res.cookie(
        REFRESH_TOKEN_COOKIE,
        tokens.refreshToken,
        getCookieConfig(),
      );
    }

    // Response tanpa refreshToken di body
    res.json(
      ApiResponse.success("Token refreshed successfully", {
        tokens: {
          accessToken: tokens.accessToken,
        },
      }),
    );
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    res.json(ApiResponse.success("Profile retrieved successfully", req.user));
  });

  /**
   * Get active sessions for current user
   */
  getSessions = catchAsync(async (req: Request, res: Response) => {
    const sessions = await authService.getActiveSessions(req.user!.id);

    res.json(ApiResponse.success("Sessions retrieved successfully", sessions));
  });

  /**
   * Revoke specific session
   *
   * Berguna untuk user logout dari device lain
   */
  revokeSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.params as { sessionId: string };
    await authService.revokeSession(sessionId);

    res.json(ApiResponse.success("Session revoked successfully"));
  });

  /**
   * Revoke all sessions for current user
   *
   * Berguna untuk "logout from all devices"
   */
  revokeAllSessions = catchAsync(async (req: Request, res: Response) => {
    await authService.revokeAllUserSessions(req.user!.id);

    // Clear httpOnly cookie
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });

    res.json(ApiResponse.success("All sessions revoked successfully"));
  });
}

export const authController = new AuthController();
