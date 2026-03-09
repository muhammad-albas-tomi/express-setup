// src/middlewares/rateLimiter.middleware.ts
import rateLimit from "express-rate-limit";
import { httpStatus } from "@/utils/http-status";

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  skipSuccessfulRequests: true,
  message: {
    status: httpStatus.TOO_MANY_REQUESTS,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
