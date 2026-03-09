import { Request, Response, NextFunction } from "express";
import { Role } from "@/generated/prisma/client";
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map