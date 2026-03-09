"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
class BaseService {
    repository;
    modelName;
    constructor(repository, modelName) {
        this.repository = repository;
        this.modelName = modelName;
    }
    async create(data) {
        try {
            return await this.repository.create(data);
        }
        catch (error) {
            throw error;
        }
    }
    async getById(id, include) {
        const item = await this.repository.findById(id, include);
        if (!item) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, `${this.modelName} not found with id: ${id}`);
        }
        return item;
    }
    async getAll(filter = {}, options = {}) {
        return this.repository.findAll(filter, options);
    }
    async update(id, data) {
        await this.getById(id);
        return this.repository.update(id, data);
    }
    async delete(id) {
        await this.getById(id);
        return this.repository.delete(id);
    }
    async softDelete(id) {
        await this.getById(id);
        return this.repository.update(id, {
            deletedAt: new Date(),
        });
    }
    async exists(where) {
        return this.repository.exists(where);
    }
    validateId(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.BAD_REQUEST, "Invalid ID format");
        }
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map