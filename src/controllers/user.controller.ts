import { Request, Response } from "express";
import { userService } from "@services/user.service";

import { CreateUserInput, UpdateUserInput } from "@validations/user.validation";
import { catchAsync } from "@/utils/catch-async";
import { httpStatus } from "@/utils/http-status";
import { ApiResponse } from "@/utils/api-response";

export class UserController {
  createUser = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserInput = req.body;
    const user = await userService.createUser(userData as any);

    res
      .status(httpStatus.CREATED)
      .json(ApiResponse.success("User created successfully", user));
  });

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query);

    res.json(ApiResponse.paginate(result.data, result.pagination));
  });

  getUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.getUserById(id);

    res.json(ApiResponse.success("User retrieved successfully", user));
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const updateData: UpdateUserInput = req.body;
    const user = await userService.updateUser(id, updateData as any);

    res.json(ApiResponse.success("User updated successfully", user));
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await userService.deleteUser(id);

    res.status(httpStatus.NO_CONTENT).send();
  });

  getUserWithPosts = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.getUserWithPosts(id);

    res.json(
      ApiResponse.success("User with posts retrieved successfully", user),
    );
  });

  changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;

    await userService.changePassword(userId, oldPassword, newPassword);

    res.json(ApiResponse.success("Password changed successfully"));
  });

  searchUsers = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    const result = await userService.searchUsers(q as string, req.query);

    res.json(ApiResponse.paginate(result.data, result.pagination));
  });

  bulkUpdateStatus = catchAsync(async (req: Request, res: Response) => {
    const { userIds, isActive } = req.body;
    const result = await userService.bulkUpdateStatus(userIds, isActive);

    res.json(ApiResponse.success("Users status updated successfully", result));
  });
}

export const userController = new UserController();
