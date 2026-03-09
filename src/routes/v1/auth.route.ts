// src/routes/v1/auth.route.ts
import { Router } from "express";
import { authController } from "@controllers/auth.controller";
import { authenticate } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "@validations/auth.validation";

const router: Router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.get("/sessions", authenticate, authController.getSessions);
router.delete(
  "/sessions/:sessionId",
  authenticate,
  authController.revokeSession,
);
router.delete("/sessions", authenticate, authController.revokeAllSessions);

export default router;
