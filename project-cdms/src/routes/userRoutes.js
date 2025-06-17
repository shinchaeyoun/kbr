// 사용자 정보 관리 관련 라우트

import express from "express";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

// 사용자 목록 조회
router.get("/list", (req, res) => {
  const limit = req.query.limit;
  const sql = limit
    ? `SELECT * FROM user ORDER BY idx DESC LIMIT 0, ${limit}`
    : "SELECT * FROM user";

  query(sql)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ msg: "목록 조회 실패", error: err }));
});

// 사용자 검색
router.post("/search", (req, res) => {
  const searchVal = req.body.search;
  const sql = `SELECT * FROM user WHERE id LIKE ?`;
  const allUsersSql = "SELECT * FROM user";

  query(sql, [`%${searchVal}%`])
    .then((data) => {
      if (data.length > 0) {
        res.send({ result: data });
      } else {
        query(allUsersSql)
          .then((allData) => {
            res.send({ msg: "검색하신 내용이 없습니다.", result: allData });
          })
          .catch((err) => {
            console.error("전체 사용자 정보 가져오기 실패:", err);
            res.status(500).send({
              msg: "전체 사용자 정보를 가져오는 데 실패했습니다.",
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.error("쿼리 실행 중 오류 발생:", err);
      res.status(500).send({ msg: "쿼리 실행 실패", error: err });
    });
});

// 사용자 정보 수정
// 클라이언트가 보낸 사용자 정보를 기반으로 특정 사용자의 데이터를 수정합니다.
router.patch("/update", (req, res) => {
  const index = req.query.idx;
  const { id, level, name, team, tel, email, etc1, etc2, etc3 } = req.body;

  const sql = `
    UPDATE user SET 
    id = ?, level = ?, name = ?, team = ?, tel = ?, email = ?, 
    etc1 = ?, etc2 = ?, etc3 = ? 
    WHERE idx = ?
  `;
  const params = [id, level, name, team, tel, email, etc1, etc2, etc3, index];

  query(sql, params)
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "수정 실패", err }));
});

// 사용자 레벨 변경
router.patch("/setlevel", (req, res) => {
  const index = req.query.idx;
  const sql = `UPDATE user SET level = ? WHERE idx = ?`;

  query(sql, [2, index])
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "수정 실패", err }));
});

// 사용자 계정 삭제
router.delete("/delete", (req, res) => {
  const index = req.query.idx;
  const sql = `DELETE FROM user WHERE idx = ?`;

  query(sql, [index]).then((data) => res.send(data));
});

export default router;
