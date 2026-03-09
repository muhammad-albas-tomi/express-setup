"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    isOperational;
    status;
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toJSON() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
        };
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api-error.js.map