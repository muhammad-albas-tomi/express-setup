import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/api-error";
export declare const errorConverter: (err: any, _req: Request, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: ApiError, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map