import { AsyncRequestHandler } from "@/controllers/controller.interface";
import { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
