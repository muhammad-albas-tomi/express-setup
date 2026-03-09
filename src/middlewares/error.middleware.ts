// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "@utils/logger";
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal server error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const { statusCode, message } = err;

  if (process.env.NODE_ENV === "development") {
    logger.error(err);
  }

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
