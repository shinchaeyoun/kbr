import express from "express";
import authRoutes from "./authRoutes.js";
import boardRoutes from "./boardRoutes.js";
import userRoutes from "./userRoutes.js";
import projectRoutes from "./projectRoutes.js";
import eventRoutes from "./eventRoutes.js";
import contentRoutes from "./contentRoutes.js";

const router = express.Router();

// router.use("/auth", authRoutes);
router.use("/auth", authRoutes); //  인증 관련 라우트
router.use("/board", boardRoutes); // 게시판 관련 라우트
router.use("/user", userRoutes); // 사용자 관련 라우트
router.use("/project", projectRoutes); // 프로젝트 관련 라우트
router.use("/event", eventRoutes); // 이벤트 관련 라우트
router.use("/content", contentRoutes); // 이벤트 관련 라우트


export default router;