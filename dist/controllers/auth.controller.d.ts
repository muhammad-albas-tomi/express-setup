import { Request, Response } from "express";
export declare class AuthController {
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSessions: (req: Request, res: Response, next: import("express").NextFunction) => void;
    revokeSession: (req: Request, res: Response, next: import("express").NextFunction) => void;
    revokeAllSessions: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map