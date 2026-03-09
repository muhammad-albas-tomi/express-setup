"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("@config/database");
const logger_1 = require("@utils/logger");
const environment_1 = require("@config/environment");
const server = app_1.default.listen(environment_1.environment.port, () => {
    logger_1.logger.info(`🚀 Server running on port ${environment_1.environment.port}`);
    logger_1.logger.info(`📝 Environment: ${environment_1.environment.nodeEnv}`);
    logger_1.logger.info(`🔗 API: http://localhost:${environment_1.environment.port}${environment_1.environment.apiPrefix}`);
});
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        logger_1.logger.info("HTTP server closed");
        try {
            await database_1.prisma.$disconnect();
            logger_1.logger.info("Database disconnected");
            process.exit(0);
        }
        catch (error) {
            logger_1.logger.error("Error during shutdown:", error);
            process.exit(1);
        }
    });
    setTimeout(() => {
        logger_1.logger.error("Force shutdown due to timeout");
        process.exit(1);
    }, 10000);
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("uncaughtException", (error) => {
    logger_1.logger.error("Uncaught Exception:", error);
    gracefulShutdown("Uncaught Exception");
});
process.on("unhandledRejection", (reason) => {
    logger_1.logger.error("Unhandled Rejection:", reason);
    gracefulShutdown("Unhandled Rejection");
});
//# sourceMappingURL=index.js.map