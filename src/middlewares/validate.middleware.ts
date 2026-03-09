// src/middlewares/validate.middleware.ts
import { ApiError } from "@/utils/api-error";
import { httpStatus } from "@/utils/http-status";
import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        next(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "Validation failed",
            true,
            JSON.stringify(errors),
          ),
        );
      } else {
        next(error);
      }
    }
  };
};
