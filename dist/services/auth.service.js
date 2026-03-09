"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_service_1 = require("./user.service");
const user_repository_1 = require("@/repositories/user.repository");
const database_1 = require("@config/database");
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
const environment_1 = require("@config/environment");
const logger_1 = require("@/utils/logger");
class AuthService {
    static ACCESS_TOKEN_EXPIRY = "30m";
    static REFRESH_TOKEN_EXPIRY = "7d";
    static REFRESH_TOKEN_SIZE = 32;
    async generateToken(userId, expires) {
        const payload = { sub: userId, type: "access" };
        return jsonwebtoken_1.default.sign(payload, environment_1.environment.jwtSecret, {
            expiresIn: expires,
        });
    }
    async generateRefreshToken() {
        const token = crypto_1.default.randomBytes(AuthService.REFRESH_TOKEN_SIZE).toString("hex");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        return { token, expires };
    }
    async generateAuthTokens(user) {
        const accessToken = await this.generateToken(user.id, AuthService.ACCESS_TOKEN_EXPIRY);
        const { token: refreshToken, expires } = await this.generateRefreshToken();
        await database_1.prisma.session.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expires,
            },
        });
        const accessExpires = new Date();
        accessExpires.setMinutes(accessExpires.getMinutes() + 30);
        return {
            access: {
                token: accessToken,
                expiresAt: accessExpires,
            },
            refresh: {
                token: refreshToken,
                expiresAt: expires,
            },
        };
    }
    async register(userData) {
        try {
            const user = await user_service_1.userService.createUser(userData);
            const fullUser = await user_repository_1.userRepository.findByEmail(user.email);
            if (!fullUser) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.INTERNAL_SERVER_ERROR, "User creation failed");
            }
            const tokens = await this.generateAuthTokens(fullUser);
            return {
                user,
                tokens,
            };
        }
        catch (error) {
            logger_1.logger.error("Registration error:", error);
            throw error;
        }
    }
    async login(email, password, ipAddress, userAgent) {
        try {
            const user = await user_service_1.userService.validatePassword(email, password);
            if (!user) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Incorrect email or password");
            }
            await user_repository_1.userRepository.updateLastLogin(user.id);
            const tokens = await this.generateAuthTokens(user);
            const refreshToken = tokens.refresh.token;
            await database_1.prisma.session.update({
                where: { token: refreshToken },
                data: {
                    ipAddress: ipAddress || null,
                    userAgent: userAgent || null,
                },
            });
            logger_1.logger.info(`User logged in: ${user.email}`);
            const { password: _, ...userResponse } = user;
            return {
                user: userResponse,
                tokens,
            };
        }
        catch (error) {
            logger_1.logger.error("Login error:", error);
            throw error;
        }
    }
    async logout(token) {
        try {
            await database_1.prisma.session.deleteMany({
                where: {
                    OR: [{ token }, { refreshTokens: { some: { token } } }],
                },
            });
            logger_1.logger.info("User logged out");
        }
        catch (error) {
            logger_1.logger.error("Logout error:", error);
            throw error;
        }
    }
    async refreshAuth(refreshToken) {
        try {
            const session = await database_1.prisma.session.findUnique({
                where: { token: refreshToken },
                include: { user: true },
            });
            if (!session || session.expiresAt < new Date()) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Invalid refresh token");
            }
            await database_1.prisma.session.delete({
                where: { token: refreshToken },
            });
            const tokens = await this.generateAuthTokens(session.user);
            logger_1.logger.info(`Token refreshed for user: ${session.user.email}`);
            return tokens;
        }
        catch (error) {
            logger_1.logger.error("Refresh token error:", error);
            throw error;
        }
    }
    async verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, environment_1.environment.jwtSecret);
            const user = await user_repository_1.userRepository.findById(payload.sub);
            if (!user) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "User not found");
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error("Token verification error:", error);
            throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
    async getActiveSessions(userId) {
        const sessions = await database_1.prisma.session.findMany({
            where: {
                userId,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });
        return sessions;
    }
    async revokeSession(sessionId) {
        await database_1.prisma.session.delete({
            where: { id: sessionId },
        });
        logger_1.logger.info(`Session revoked: ${sessionId}`);
    }
    async revokeAllUserSessions(userId) {
        await database_1.prisma.session.deleteMany({
            where: { userId },
        });
        logger_1.logger.info(`All sessions revoked for user: ${userId}`);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map