"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@controllers/auth.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validate_middleware_1 = require("@middlewares/validate.middleware");
const auth_validation_1 = require("@validations/auth.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.authController.register);
router.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
router.post("/refresh-token", (0, validate_middleware_1.validate)(auth_validation_1.refreshTokenSchema), auth_controller_1.authController.refreshToken);
router.post("/logout", auth_middleware_1.authenticate, auth_controller_1.authController.logout);
router.get("/profile", auth_middleware_1.authenticate, auth_controller_1.authController.getProfile);
router.get("/sessions", auth_middleware_1.authenticate, auth_controller_1.authController.getSessions);
router.delete("/sessions/:sessionId", auth_middleware_1.authenticate, auth_controller_1.authController.revokeSession);
router.delete("/sessions", auth_middleware_1.authenticate, auth_controller_1.authController.revokeAllSessions);
exports.default = router;
//# sourceMappingURL=auth.route.js.map