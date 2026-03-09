// src/routes/v1/user.route.ts
import { Router } from "express";
import { userController } from "@controllers/user.controller";
import { authenticate, authorize } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  getUsersSchema,
  changePasswordSchema,
} from "@validations/user.validation";
import { Role } from "@/generated/prisma/client";

const router: Router = Router();

router.use(authenticate); // All user routes require authentication

router
  .route("/")
  .get(
    authorize(Role.ADMIN, Role.MODERATOR),
    validate(getUsersSchema),
    userController.getUsers,
  )
  .post(
    authorize(Role.ADMIN),
    validate(createUserSchema),
    userController.createUser,
  );

router
  .route("/search")
  .get(authorize(Role.ADMIN, Role.MODERATOR), userController.searchUsers);

router
  .route("/bulk/status")
  .patch(authorize(Role.ADMIN), userController.bulkUpdateStatus);

router
  .route("/change-password")
  .post(validate(changePasswordSchema), userController.changePassword);

router
  .route("/:id")
  .get(validate(getUserSchema), userController.getUser)
  .patch(validate(updateUserSchema), userController.updateUser)
  .delete(
    authorize(Role.ADMIN),
    validate(getUserSchema),
    userController.deleteUser,
  );

router
  .route("/:id/posts")
  .get(validate(getUserSchema), userController.getUserWithPosts);

export default router;
