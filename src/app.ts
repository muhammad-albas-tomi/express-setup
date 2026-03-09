// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { errorConverter, errorHandler } from "@middlewares/error.middleware";

import { environment } from "@config/environment";
import { rateLimiter } from "./middlewares/rate-limiter.middleware";
import { httpStatus } from "./utils/http-status";
import { ApiError } from "./utils/api-error";
import routes from "./routes/v1";

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: environment.corsOrigin,
    credentials: true,
  }),
);

// Rate limiting
app.use(environment.apiPrefix, rateLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
if (environment.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Static files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use(environment.apiPrefix, routes);

// 404 handler
app.use((_req: Request, _res: Response, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Resource not found"));
});

// Convert error to ApiError
app.use(errorConverter);

// Global error handler
app.use(errorHandler);

export default app;
