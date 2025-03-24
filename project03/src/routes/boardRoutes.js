// 게시판 관련 라우트
import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const index = req.query.idx;
  const limit = req.query.limit || 10; // 기본값 10
  const sqlDESC = `SELECT * FROM board ORDER BY idx DESC LIMIT 0, ${limit}`; // 최신순
  const sqlASC = `SELECT * FROM board ORDER BY idx ASC LIMIT 0, ${limit}`; // 오래된순
  const sql = `SELECT * FROM board WHERE idx = ?`;

  if (index == undefined) {
    query(sqlDESC).then((data) => {
      res.send(data);
    });
  } else {
    query(sql, [index]).then((data) => {
      res.send(data[0]);
    });
  }
});

// 게시판 글 추가
router.post("/", (req, res) => {
  console.log("req.body ====== res", req.body);
  const {
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  } = req.body;

  const sql = `
    INSERT INTO board
    VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
  `;

  const params = [
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  ];

  query(sql, params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("전송 실패===catch===", err);
      res.send({ msg: "전송 실패" });
    });
});

// 게시판 글 검색
router.post("/search", (req, res) => {
  const sql1 = `
          SELECT * FROM board 
          WHERE title LIKE ? 
          ORDER BY idx DESC 
          LIMIT 0, 10;
        `;
  const sql2 = "SELECT * FROM board ORDER BY idx DESC LIMIT 0, 10";
  const searchValue = req.body.search;

  if (searchValue !== undefined) {
    query(sql1, [`%${searchValue}%`])
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  } else {
    query(sql2).then((data) => res.send(data));
  }
});

// 게시판 글 삭제
router.delete("/delete", (req, res) => {
  const idx = req.body.idx;

  const sql = `
    DELETE FROM board WHERE idx = ?  
  `;
  query(sql, [idx]).then((data) => {
    res.send(data);
  });
});

// 게시판 글 수정
router.patch("/update", (req, res) => {
  console.log(`= = = > req.query : ${util.inspect(req.query)}`);
  console.log(`= = = > req.body : ${util.inspect(req.body)}`);
  const index = req.query.idx;

  const {
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  } = req.body;

  const sql = `
    UPDATE board SET 
    title = ?,
    subTitle = ?,
    customer = ?,
    pm1 = ?,
    pm2 = ?,
    pm3 = ?,
    startAt = ?,
    scheduledAt = ?,
    completedAt = ?,
    totalCha = ?,
    lmsTime = ?,
    lmsCode = ?,
    innerUrl = ?,
    outerUrl = ?,
    customerName = ?,
    customerTel = ?,
    customerPlan = ?,
    pottingComp = ?,
    etc = ?
    WHERE idx = ?
  `;

  const params = [
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
    index,
  ];

  query(sql, params)
    .then((data) => {
      res.send({ msg: "수정 성공", data });
    })
    .catch((err) => {
      res.send({ msg: "수정 실패", err });
    });
});

// module.exports = router;
export default router;
