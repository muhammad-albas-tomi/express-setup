"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const logger_1 = require("@utils/logger");
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
const errorConverter = (err, _req, _res, next) => {
    let error = err;
    if (!(error instanceof api_error_1.ApiError)) {
        const statusCode = error.statusCode || http_status_1.httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "Internal server error";
        error = new api_error_1.ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, _req, res, _next) => {
    const { statusCode, message } = err;
    if (process.env.NODE_ENV === "development") {
        logger_1.logger.error(err);
    }
    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map