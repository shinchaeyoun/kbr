// 로그인 및 회원가입 관련 라우트

import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("auth");
});

// 로그인 처리
router.post("/login", (req, res) => {
  console.log(`로그인 처리 = = = > req : ${util.inspect(req.body)}`);
  const userId = req.body.id;
  const userPw = req.body.password;
  const userAuth = req.body.level;
  const sql1 = "SELECT COUNT(*) AS result FROM user WHERE id = ?";

  query(sql1, [userId])
    .then((data) => {
      console.log("query sql1 ===!! ");
      // 동일한 id가 없다면
      if (data[0].result < 1) {
        console.log("동일한 id가 없다면", data, req.body);
        res.send({ msg: "입력하신 id 가 일치하지 않습니다." });
      } else {
        const sql2 = `
        SELECT id AS userId, password AS userPw, level AS userAuth
        FROM user
        WHERE id = ? AND password = ?
      `;
        const params = [userId, userPw];

        query(sql2, params)
          .then((data) => {
            console.log("server : 로그인 성공 //////", data[0]);
            res.send(data[0]);
          })
          .catch((err) => {
            console.log("로그인 실패", err);
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.log("error", err);
      res.send(err);
    });
});

// 계정 생성 처리
router.post("/signup", (req, res) => {
  const { id, password } = req.body;
  const sql = `
    INSERT INTO user (id, password, level)
    VALUES (?, ?, 1);
  `;

  query(sql, [id, password])
    .then((data) => {
      res.send(data);
      console.log("계정 생성 성공:", data);
    })
    .catch((err) => {
      res.send(err);
      console.error("계정 생성 실패:", err);
    });
});

// 아이디 중복 확인
router.get("/signup", (req, res) => {
  const sql = `
    SELECT COUNT(*) AS result FROM user WHERE id = ?
  `;
  query(sql, [req.query.id])
    .then((data) => {
      let sendMsg = "";
      data[0].result == 1
        ? (sendMsg = "중복 아이디")
        : (sendMsg = "생성 가능 아이디");
      res.send({ result: data[0].result, msg: sendMsg });
    })
    .catch((err) => {
      console.log("error", err);
      res.send(err);
    });
});

// module.exports = router;
export default router;
