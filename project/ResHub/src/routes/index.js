import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import infoRoutes from "./infoRoutes.js";
import itemRoutes from "./itemRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/info", infoRoutes);
router.use("/item", itemRoutes);


export default router;