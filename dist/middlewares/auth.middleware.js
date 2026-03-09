"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
const auth_service_1 = require("@/services/auth.service");
const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Authentication required");
        }
        const user = await auth_service_1.authService.verifyToken(token);
        const { password: _, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new api_error_1.ApiError(http_status_1.httpStatus.UNAUTHORIZED, "Authentication required"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new api_error_1.ApiError(http_status_1.httpStatus.FORBIDDEN, "Insufficient permissions"));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map