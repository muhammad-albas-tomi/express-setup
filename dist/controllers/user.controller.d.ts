import { Request, Response } from "express";
export declare class UserController {
    createUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserWithPosts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    bulkUpdateStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map