// 로그인 및 회원가입 관련 라우트
import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("item get ==>", req.query, req.body);

  const sql = `SELECT * FROM item`;

  query(sql).then((data) => res.send(data));
});

export default router;
