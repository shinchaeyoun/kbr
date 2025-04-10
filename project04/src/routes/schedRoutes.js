// 캘린더 관련 라우트
import express from "express";
import moment from "moment";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("auth");
});

// 이벤트 목록 가져오기
router.get("/events", (req, res) => {
  const sql = "SELECT id, title, start, end FROM events";
  query(sql)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// 새로운 이벤트 추가
router.post('/events', (req, res) => {
  const { title, start, end } = req.body;
  
  // 날짜 형식 변환
  const formattedStart = moment(start).format("YYYY-MM-DD HH:mm:ss");
  const formattedEnd = moment(end).format("YYYY-MM-DD HH:mm:ss");

  console.log("Formatted Dates:", formattedStart, formattedEnd);

  const sql = 'INSERT INTO events (title, start, end) VALUES (?, ?, ?)';

  query(sql,[title, formattedStart,formattedEnd])
  .then((data) => res.send(data))
  .catch((err) => res.send(err));
});


export default router;