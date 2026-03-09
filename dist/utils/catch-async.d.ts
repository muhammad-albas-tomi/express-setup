import { AsyncRequestHandler } from "@/controllers/controller.interface";
import { Request, Response, NextFunction } from "express";
export declare const catchAsync: (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=catch-async.d.ts.map