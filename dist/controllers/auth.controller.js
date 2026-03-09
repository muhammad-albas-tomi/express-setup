"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const catch_async_1 = require("@/utils/catch-async");
const http_status_1 = require("@/utils/http-status");
const api_response_1 = require("@/utils/api-response");
const auth_service_1 = require("@/services/auth.service");
class AuthController {
    register = (0, catch_async_1.catchAsync)(async (req, res) => {
        const userData = req.body;
        const result = await auth_service_1.authService.register(userData);
        res
            .status(http_status_1.httpStatus.CREATED)
            .json(api_response_1.ApiResponse.success("Registration successful", result));
    });
    login = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { email, password } = req.body;
        const ipAddress = req.ip;
        const userAgent = req.get("user-agent");
        const result = await auth_service_1.authService.login(email, password, ipAddress, userAgent);
        res.json(api_response_1.ApiResponse.success("Login successful", result));
    });
    logout = (0, catch_async_1.catchAsync)(async (req, res) => {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (token) {
            await auth_service_1.authService.logout(token);
        }
        res.json(api_response_1.ApiResponse.success("Logout successful"));
    });
    refreshToken = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await auth_service_1.authService.refreshAuth(refreshToken);
        res.json(api_response_1.ApiResponse.success("Token refreshed successfully", tokens));
    });
    getProfile = (0, catch_async_1.catchAsync)(async (req, res) => {
        res.json(api_response_1.ApiResponse.success("Profile retrieved successfully", req.user));
    });
    getSessions = (0, catch_async_1.catchAsync)(async (req, res) => {
        const sessions = await auth_service_1.authService.getActiveSessions(req.user.id);
        res.json(api_response_1.ApiResponse.success("Sessions retrieved successfully", sessions));
    });
    revokeSession = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { sessionId } = req.params;
        await auth_service_1.authService.revokeSession(sessionId);
        res.json(api_response_1.ApiResponse.success("Session revoked successfully"));
    });
    revokeAllSessions = (0, catch_async_1.catchAsync)(async (req, res) => {
        await auth_service_1.authService.revokeAllUserSessions(req.user.id);
        res.json(api_response_1.ApiResponse.success("All sessions revoked successfully"));
    });
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map