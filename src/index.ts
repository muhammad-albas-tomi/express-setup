// src/index.ts
/// <reference path="./types/global.d.ts" />
import app from "./app";
import { prisma } from "@config/database";
import { logger } from "@utils/logger";
import { environment } from "@config/environment";

const server = app.listen(environment.port, () => {
  logger.info(`🚀 Server running on port ${environment.port}`);
  logger.info(`📝 Environment: ${environment.nodeEnv}`);
  logger.info(
    `🔗 API: http://localhost:${environment.port}${environment.apiPrefix}`,
  );
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info("HTTP server closed ");

    try {
      await prisma.$disconnect();
      logger.info("Database disconnected");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error("Force shutdown due to timeout");
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  gracefulShutdown("Uncaught Exception");
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason);
  gracefulShutdown("Unhandled Rejection");
});
