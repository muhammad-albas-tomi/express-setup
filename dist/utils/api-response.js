"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(message, data, meta) {
        const response = {
            success: true,
            message,
            timestamp: new Date().toISOString(),
        };
        if (data !== undefined)
            response.data = data;
        if (meta !== undefined)
            response.meta = meta;
        return response;
    }
    static error(message, errors, statusCode = 500) {
        return {
            success: false,
            message,
            statusCode,
            errors,
            timestamp: new Date().toISOString(),
        };
    }
    static paginate(data, pagination) {
        return {
            success: true,
            data,
            pagination,
            timestamp: new Date().toISOString(),
        };
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.js.map