// 정보 관련 라우트
import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

router.get("/cate", (req, res) => {
  const sql = `SELECT * FROM info WHERE option = ?`;
  query(sql, ['category'])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error("Error fetching categories:", err);
      res.status(500).send("Error fetching categories");
    });
});

export default router;
