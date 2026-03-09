"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@/generated/prisma/client");
const user_repository_1 = require("@repositories/user.repository");
const base_service_1 = require("./base.service");
const logger_1 = require("@utils/logger");
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
class UserService extends base_service_1.BaseService {
    constructor() {
        super(user_repository_1.userRepository, "User");
    }
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
    async createUser(userData) {
        try {
            const existingUser = await user_repository_1.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.CONFLICT, "Email already registered");
            }
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const user = await user_repository_1.userRepository.create({
                ...userData,
                password: hashedPassword,
            });
            logger_1.logger.info(`User created: ${user.email}`);
            return this.sanitizeUser(user);
        }
        catch (error) {
            logger_1.logger.error("Error creating user:", error);
            throw error;
        }
    }
    async getUserById(id) {
        this.validateId(id);
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, "User not found");
        }
        return this.sanitizeUser(user);
    }
    async getUserByEmail(email) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        return user ? this.sanitizeUser(user) : null;
    }
    async getAllUsers(query) {
        const filter = {};
        if (query.role && Object.values(client_1.Role).includes(query.role)) {
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
        const options = {
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 10,
            sortBy: query.sortBy || "createdAt",
            sortOrder: query.sortOrder || "desc",
        };
        const result = await user_repository_1.userRepository.findAll(filter, options);
        const sanitizedResult = {
            ...result,
            data: result.data.map((user) => this.sanitizeUser(user)),
        };
        return sanitizedResult;
    }
    async updateUser(id, updateData) {
        this.validateId(id);
        const user = await this.getUserById(id);
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await user_repository_1.userRepository.findByEmail(updateData.email);
            if (existingUser) {
                throw new api_error_1.ApiError(http_status_1.httpStatus.CONFLICT, "Email already taken");
            }
        }
        if (updateData.password) {
            updateData.password = await bcryptjs_1.default.hash(updateData.password, 10);
        }
        const updatedUser = await user_repository_1.userRepository.update(id, updateData);
        logger_1.logger.info(`User updated: ${updatedUser.email}`);
        return this.sanitizeUser(updatedUser);
    }
    async deleteUser(id) {
        this.validateId(id);
        const user = await this.getUserById(id);
        await user_repository_1.userRepository.delete(id);
        logger_1.logger.info(`User deleted: ${user.email}`);
        return user;
    }
    async validatePassword(email, password) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            return false;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        return isValid ? user : false;
    }
    async changePassword(userId, oldPassword, newPassword) {
        this.validateId(userId);
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, "User not found");
        }
        const isValid = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Current password is incorrect");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await user_repository_1.userRepository.update(userId, {
            password: hashedPassword,
        });
        logger_1.logger.info(`Password changed for user: ${user.email}`);
        return true;
    }
    async getUsersWithStats() {
        const users = await user_repository_1.userRepository.getUsersWithStats();
        return users;
    }
    async searchUsers(searchTerm, options) {
        const result = await user_repository_1.userRepository.searchUsers(searchTerm, options);
        result.data = result.data.map((user) => this.sanitizeUser(user));
        return result;
    }
    async bulkUpdateStatus(userIds, isActive) {
        userIds.forEach((id) => this.validateId(id));
        const result = await user_repository_1.userRepository.bulkUpdateStatus(userIds, isActive);
        logger_1.logger.info(`Bulk status update: ${result.count} users affected`);
        return result;
    }
    async getUserWithPosts(id) {
        this.validateId(id);
        const userWithPosts = await user_repository_1.userRepository.findWithPosts(id);
        if (!userWithPosts) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, "User not found");
        }
        const userWithPostsData = userWithPosts;
        return {
            ...this.sanitizeUser(userWithPosts),
            posts: userWithPostsData.posts || [],
        };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map