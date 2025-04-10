import express from "express";
import authRoutes from "./authRoutes.js";
import boardRoutes from "./boardRoutes.js";
import userRoutes from "./userRoutes.js";
import schedRoutes from "./schedRoutes.js";

const router = express.Router();

// router.use("/auth", authRoutes);
router.use("/auth", authRoutes);
router.use("/board", boardRoutes);
router.use("/user", userRoutes);
router.use("/sched", schedRoutes);

export default router;