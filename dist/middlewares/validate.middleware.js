"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const api_error_1 = require("@/utils/api-error");
const http_status_1 = require("@/utils/http-status");
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));
                next(new api_error_1.ApiError(http_status_1.httpStatus.BAD_REQUEST, "Validation failed", true, JSON.stringify(errors)));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map