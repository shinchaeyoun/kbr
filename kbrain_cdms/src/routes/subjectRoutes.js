// 게시판 관련 라우트
import express from "express";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";

const router = express.Router();

// 게시판 목록 가져오기
router.get("/setMainList", (req, res) => {
  const projectCode = req.query.code;
  const sql = `SELECT * FROM subject WHERE projectCode = ?`;

  query(sql, [projectCode]).then((data) => res.send(data));
});

// 진행률 정보 가져오기
router.get("/progressList", (req, res) => {
  const progressList = [];
  const progressArr = req.query.progress.split(",");

  for (let i = 0; i < progressArr.length; i++) {
    const trimmed = progressArr[i].trim();
    if (trimmed) progressList.push(trimmed);
  }

  if (progressList.length === 0) return res.send([]);

  // progress 컬럼이 progressList에 포함된 값만 조회
  // const sql = `SELECT * FROM subject WHERE progress IN (${progressList.map(() => '?').join(',')})`;
  const sql = `SELECT * FROM subject`;
  query(sql, progressList).then((data) => res.send(data));
});

// 차시 갯수 가져오기
router.get("/chasiTotal", (req, res) => {
  const { progress, subjectId } = req.query;
  const sql = `SELECT chasiTotal FROM subject WHERE subjectId = ?`;

  query(sql, [subjectId])
    .then((data) => res.send(data[0]))
    .catch((err) => res.send({ msg: "전송 실패", error: err.message }));
});

// 차시 정보 가져오기
router.get("/setData", (req, res) => {
  const { progressItem, subjectId, projectCode } = req.query;
  const columns = progressItem || null;
  const columnStr = progressItem && columns.join(", ") || null;
  // const sql = `SELECT ${columnStr} FROM subject WHERE subjectId = ?`;
  const sql = `SELECT ${columnStr} FROM subject WHERE subjectId = ? AND projectCode = ?`;
// console.log("차시 정보 요청", req.query);

  query(sql, [subjectId, projectCode]).then((data) => {
    // console.log("차시 정보:", data);
    res.send(data[0])
  });
});

router.post("/add", (req, res) => {
  const { code, name, chasiTotal, manager } = req.body;
  const sql = `INSERT INTO subject (projectCode, name, chasiTotal, manager) VALUES (?, ?, ?, ?)`;

  query(sql, [code, name, chasiTotal, manager])
    .then(() => res.send({ msg: "전송 성공" }))
    .catch((err) => res.send({ msg: "전송 실패" }));
});

router.patch("/saveProgress", (req, res) => {
  const { script, sb, voice, animation, video, design, content } = req.body.progressValues;
  const projectCode = req.body.projectCode;
  const subjectId = req.body.subjectId;

  // 각 요소가 배열이면 문자열로 변환
  const scriptStr = Array.isArray(script) ? script.join(",") : script;
  const sbStr = Array.isArray(sb) ? sb.join(",") : sb;
  const voiceStr = Array.isArray(voice) ? voice.join(",") : voice;
  const animationStr = Array.isArray(animation) ? animation.join(",") : animation;
  const videoStr = Array.isArray(video) ? video.join(",") : video;
  const designStr = Array.isArray(design) ? design.join(",") : design;
  const contentStr = Array.isArray(content) ? content.join(",") : content;

  const params = [scriptStr, sbStr, voiceStr, animationStr, videoStr, designStr, contentStr, projectCode, subjectId];
  const sql = `
    UPDATE subject SET 
    script = ?,
    sb = ?,
    voice = ?,
    animation = ?,
    video = ?,
    design = ?,
    content = ?
    WHERE projectCode = ? AND subjectId = ?
  `;

  query(sql, params)
    .then((data) => res.send({ msg: "전송 성공"}))
    .catch((err) => res.send({ msg: "전송 실패", error: err.message }));
});

export default router;
