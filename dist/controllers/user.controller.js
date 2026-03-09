"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("@services/user.service");
const catch_async_1 = require("@/utils/catch-async");
const http_status_1 = require("@/utils/http-status");
const api_response_1 = require("@/utils/api-response");
class UserController {
    createUser = (0, catch_async_1.catchAsync)(async (req, res) => {
        const userData = req.body;
        const user = await user_service_1.userService.createUser(userData);
        res
            .status(http_status_1.httpStatus.CREATED)
            .json(api_response_1.ApiResponse.success("User created successfully", user));
    });
    getUsers = (0, catch_async_1.catchAsync)(async (req, res) => {
        const result = await user_service_1.userService.getAllUsers(req.query);
        res.json(api_response_1.ApiResponse.paginate(result.data, result.pagination));
    });
    getUser = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const user = await user_service_1.userService.getUserById(id);
        res.json(api_response_1.ApiResponse.success("User retrieved successfully", user));
    });
    updateUser = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        const user = await user_service_1.userService.updateUser(id, updateData);
        res.json(api_response_1.ApiResponse.success("User updated successfully", user));
    });
    deleteUser = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        await user_service_1.userService.deleteUser(id);
        res.status(http_status_1.httpStatus.NO_CONTENT).send();
    });
    getUserWithPosts = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const user = await user_service_1.userService.getUserWithPosts(id);
        res.json(api_response_1.ApiResponse.success("User with posts retrieved successfully", user));
    });
    changePassword = (0, catch_async_1.catchAsync)(async (req, res) => {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        await user_service_1.userService.changePassword(userId, oldPassword, newPassword);
        res.json(api_response_1.ApiResponse.success("Password changed successfully"));
    });
    searchUsers = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { q } = req.query;
        const result = await user_service_1.userService.searchUsers(q, req.query);
        res.json(api_response_1.ApiResponse.paginate(result.data, result.pagination));
    });
    bulkUpdateStatus = (0, catch_async_1.catchAsync)(async (req, res) => {
        const { userIds, isActive } = req.body;
        const result = await user_service_1.userService.bulkUpdateStatus(userIds, isActive);
        res.json(api_response_1.ApiResponse.success("Users status updated successfully", result));
    });
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map