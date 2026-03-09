"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = require("@config/database");
const api_error_1 = require("@/utils/api-error");
const client_1 = require("@/generated/prisma/client");
const http_status_1 = require("@/utils/http-status");
class BaseRepository {
    model;
    modelName;
    constructor(model, modelName) {
        this.model = model;
        this.modelName = modelName;
    }
    get prismaModel() {
        return database_1.prisma[this.model];
    }
    async create(data) {
        try {
            return await this.prismaModel.create({
                data,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async createMany(data) {
        try {
            return await this.prismaModel.createMany({
                data,
                skipDuplicates: true,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async findById(id, include, select) {
        try {
            return await this.prismaModel.findUnique({
                where: { id },
                include,
                select,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async findOne(where, include, select) {
        try {
            return await this.prismaModel.findFirst({
                where,
                include,
                select,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async findAll(filter = {}, options = {}) {
        try {
            const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", include, select, } = options;
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.prismaModel.findMany({
                    where: filter,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include,
                    select,
                }),
                this.prismaModel.count({ where: filter }),
            ]);
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1,
                },
            };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async update(id, data) {
        try {
            return await this.prismaModel.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async updateMany(where, data) {
        try {
            const result = await this.prismaModel.updateMany({
                where,
                data,
            });
            return { count: result.count };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async delete(id) {
        try {
            return await this.prismaModel.delete({
                where: { id },
            });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async deleteMany(where) {
        try {
            const result = await this.prismaModel.deleteMany({
                where,
            });
            return { count: result.count };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async count(where = {}) {
        try {
            return await this.prismaModel.count({ where });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async exists(where) {
        try {
            const count = await this.prismaModel.count({ where });
            return count > 0;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (error instanceof api_error_1.ApiError) {
            throw error;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    throw new api_error_1.ApiError(http_status_1.httpStatus.CONFLICT, `Duplicate field value: ${error.meta?.target?.join(", ")}`);
                case "P2014":
                    throw new api_error_1.ApiError(http_status_1.httpStatus.BAD_REQUEST, `Invalid ID: ${error.meta?.target}`);
                case "P2003":
                    throw new api_error_1.ApiError(http_status_1.httpStatus.BAD_REQUEST, "Foreign key constraint failed");
                case "P2025":
                    throw new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, "Record not found");
                default:
                    throw new api_error_1.ApiError(http_status_1.httpStatus.INTERNAL_SERVER_ERROR, `Database error: ${error.message}`);
            }
        }
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.BAD_REQUEST, "Invalid data provided to database");
        }
        throw new api_error_1.ApiError(http_status_1.httpStatus.INTERNAL_SERVER_ERROR, error.message || "An unexpected error occurred");
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map