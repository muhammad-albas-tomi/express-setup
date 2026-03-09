// src/routes/v1/index.ts
import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
// Import other routes here

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// Add other routes here

export default router;
