"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("@controllers/user.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validate_middleware_1 = require("@middlewares/validate.middleware");
const user_validation_1 = require("@validations/user.validation");
const client_1 = require("@/generated/prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router
    .route("/")
    .get((0, auth_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MODERATOR), (0, validate_middleware_1.validate)(user_validation_1.getUsersSchema), user_controller_1.userController.getUsers)
    .post((0, auth_middleware_1.authorize)(client_1.Role.ADMIN), (0, validate_middleware_1.validate)(user_validation_1.createUserSchema), user_controller_1.userController.createUser);
router
    .route("/search")
    .get((0, auth_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MODERATOR), user_controller_1.userController.searchUsers);
router
    .route("/bulk/status")
    .patch((0, auth_middleware_1.authorize)(client_1.Role.ADMIN), user_controller_1.userController.bulkUpdateStatus);
router
    .route("/change-password")
    .post((0, validate_middleware_1.validate)(user_validation_1.changePasswordSchema), user_controller_1.userController.changePassword);
router
    .route("/:id")
    .get((0, validate_middleware_1.validate)(user_validation_1.getUserSchema), user_controller_1.userController.getUser)
    .patch((0, validate_middleware_1.validate)(user_validation_1.updateUserSchema), user_controller_1.userController.updateUser)
    .delete((0, auth_middleware_1.authorize)(client_1.Role.ADMIN), (0, validate_middleware_1.validate)(user_validation_1.getUserSchema), user_controller_1.userController.deleteUser);
router
    .route("/:id/posts")
    .get((0, validate_middleware_1.validate)(user_validation_1.getUserSchema), user_controller_1.userController.getUserWithPosts);
exports.default = router;
//# sourceMappingURL=user.route.js.map