// 사용자 정보 관리 관련 라우트

import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

// 사용자 목록 조회
router.get("/list", (req, res) => {
  const sql = "SELECT * FROM user";
  query(sql)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

// 사용자 검색
router.post("/search", (req, res) => {
  const searchVal = req.body.search;
  console.log("사용자 검색", searchVal);
  const sql = `SELECT * FROM user WHERE id = ?`;

  query(sql, [req.body.search])
    .then((data) => {
      if (data.length > 0) {
        console.log("값 있음");
        res.send({result: data}); // 검색 결과를 반환
      } else {
        console.log("값 없음, 전체 사용자 정보 반환");
        const allUsersSql = "SELECT * FROM user"; // 모든 사용자 가져오기 쿼리
        query(allUsersSql)
          .then((allData) => {
            res.send({ msg: "검색하신 내용이 없습니다.", result: allData }); // 전체 데이터를 반환
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
router.patch("/update", (req, res) => {
  console.log("req.query.idx", req.query.idx);
  const index = req.query.idx;

  const { id, level, name, team, tel, email, etc1, etc2, etc3 } = req.body;
  const sql = `
    UPDATE user SET 
    id = ?,
    level = ?,
    name = ?,
    team = ?,
    tel = ?,
    email = ?,
    etc1 = ?,
    etc2 = ?,
    etc3 = ?
    WHERE idx = ?
  `;
  const params = [id, level, name, team, tel, email, etc1, etc2, etc3, index];

  query(sql, params).then(data=>res.send(data)).catch(err=>res.send({ msg: "수정 실패", err }))
});

// 사용자 계정 삭제
router.delete("/delete", (req, res) => {
  console.log("index -------- ", req.query.idx);
  const sql = `DELETE FROM user WHERE idx = ?`;
  query(sql, [req.query.idx]).then((data) => res.send(data));
});

// 사용자 레벨 변경
router.patch("/setlevel", (req, res) => {
  const index = req.query.idx;
  const sql = `UPDATE user SET level = ? WHERE idx = ?`;

  query(sql, [2, index])
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "수정 실패", err }));
});

// module.exports = router;
export default router;
