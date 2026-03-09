"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.environment = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    appName: process.env.APP_NAME || "Express App",
    apiPrefix: process.env.API_PREFIX || "/api/v1",
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || "30", 10),
    jwtRefreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || "7", 10),
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    corsOrigin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : ["http://localhost:3000"],
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES
        ? process.env.ALLOWED_FILE_TYPES.split(",")
        : ["image/jpeg", "image/png"],
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    emailFrom: process.env.EMAIL_FROM || "noreply@yourapp.com",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
};
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}
//# sourceMappingURL=environment.js.map