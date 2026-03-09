"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../generated/prisma/client");
const logger_1 = require("@utils/logger");
const environment_1 = require("./environment");
class PrismaManager {
    static instance;
    constructor() { }
    static getInstance() {
        if (!PrismaManager.instance) {
            PrismaManager.instance = new client_1.PrismaClient({
                accelerateUrl: environment_1.environment.databaseUrl,
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
    static setupLogging() {
        if (process.env.NODE_ENV === "development") {
            PrismaManager.instance.$on("query", (e) => {
                logger_1.logger.debug(`Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`);
            });
        }
        PrismaManager.instance.$on("info", (e) => {
            logger_1.logger.info(`Prisma Info: ${e.message}`);
        });
        PrismaManager.instance.$on("warn", (e) => {
            logger_1.logger.warn(`Prisma Warning: ${e.message}`);
        });
        PrismaManager.instance.$on("error", (e) => {
            logger_1.logger.error(`Prisma Error: ${e.message}`);
        });
    }
    static async disconnect() {
        if (PrismaManager.instance) {
            await PrismaManager.instance.$disconnect();
            logger_1.logger.info("Database disconnected");
        }
    }
}
exports.prisma = PrismaManager.getInstance();
//# sourceMappingURL=database.js.map