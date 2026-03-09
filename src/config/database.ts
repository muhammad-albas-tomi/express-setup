import { PrismaClient } from "../generated/prisma/client";
import { logger } from "@utils/logger";
import { environment } from "./environment";

class PrismaManager {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaClient({
        log: [
          { level: "query", emit: "event" },
          { level: "info", emit: "event" },
          { level: "warn", emit: "event" },
          { level: "error", emit: "event" },
        ],
      });

      PrismaManager.setupLogging();
    }

    return PrismaManager.instance;
  }

  private static setupLogging(): void {
    if (process.env.NODE_ENV === "development") {
      PrismaManager.instance.$on("query" as never, (e: any) => {
        logger.debug(
          `Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`,
        );
      });
    }

    PrismaManager.instance.$on("info" as never, (e: any) => {
      logger.info(`Prisma Info: ${e.message}`);
    });

    PrismaManager.instance.$on("warn" as never, (e: any) => {
      logger.warn(`Prisma Warning: ${e.message}`);
    });

    PrismaManager.instance.$on("error" as never, (e: any) => {
      logger.error(`Prisma Error: ${e.message}`);
    });
  }

  public static async disconnect(): Promise<void> {
    if (PrismaManager.instance) {
      await PrismaManager.instance.$disconnect();
      logger.info("Database disconnected");
    }
  }
}

export const prisma = PrismaManager.getInstance();
