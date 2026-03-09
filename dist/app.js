"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("@middlewares/error.middleware");
const environment_1 = require("@config/environment");
const rate_limiter_middleware_1 = require("./middlewares/rate-limiter.middleware");
const http_status_1 = require("./utils/http-status");
const api_error_1 = require("./utils/api-error");
const v1_1 = __importDefault(require("./routes/v1"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: environment_1.environment.corsOrigin,
    credentials: true,
}));
app.use(environment_1.environment.apiPrefix, rate_limiter_middleware_1.rateLimiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, compression_1.default)());
if (environment_1.environment.isDevelopment) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined"));
}
app.use("/uploads", express_1.default.static("uploads"));
app.get("/health", (_req, res) => {
    res.status(http_status_1.httpStatus.OK).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use(environment_1.environment.apiPrefix, v1_1.default);
app.use((_req, _res, next) => {
    next(new api_error_1.ApiError(http_status_1.httpStatus.NOT_FOUND, "Resource not found"));
});
app.use(error_middleware_1.errorConverter);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map