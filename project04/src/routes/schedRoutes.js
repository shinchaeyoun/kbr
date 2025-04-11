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
  const id = req.query.id;
  let sql = "SELECT * FROM events";
  const params = [];

  if (id) {
    sql += " WHERE id = ?";
    params.push(id);
  }

  query(sql, params)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

// 새로운 이벤트 추가
router.post("/events", (req, res) => {
  const { title, start, end, label } = req.body;

  // 날짜 형식 변환
  const formattedStart = moment(start).format("YYYY-MM-DD HH:mm:ss");
  const formattedEnd = moment(end).format("YYYY-MM-DD HH:mm:ss");
  const sql = "INSERT INTO events (title, start, end, label) VALUES (?, ?, ?, ?)";

  query(sql, [title, formattedStart, formattedEnd, label])
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

// 이벤트 수정
router.patch("/update", (req, res) => {
  const id = Number(req.query.id); // req.query.id를 숫자로 변환

  if (!id) {
    return res.status(400).send({ msg: "수정할 이벤트의 id가 필요합니다." });
  }

  const { title, start, end, label, memo } = req.body;
  const formattedStart = moment(start).format("YYYY-MM-DD HH:mm:ss");
  const formattedEnd = moment(end).format("YYYY-MM-DD HH:mm:ss");
  const params = [title, formattedStart, formattedEnd, label, memo, id];


  const sql = `
    UPDATE events SET 
    title = ?,
    start = ?,
    end = ?,
    label = ?,
    memo = ?
    WHERE id = ?
  `;

  // //   const sql = 'DELETE FROM events WHERE id = ?';
  // // console.log('req.query.id', req.query.id);

    query(sql, params)
      .then((data) => {
        res.send(data);
        console.log("수정 완료", data);
        
      })
      .catch((err) => {
        res.send(err)
        console.log("수정 실패", err);
      });
});

// 이벤트 삭제
router.delete("/delete", (req, res) => {
  const id = req.query.id;
  const sql = "DELETE FROM events WHERE id = ?";
  console.log("req.query.id", req.query.id);

  query(sql, [id])
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

export default router;
