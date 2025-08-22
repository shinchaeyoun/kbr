// 게시판 관련 라우트
import express from "express";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";
import { log } from "console";

const router = express.Router();

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const index = req.query.code;
  const limit = Number(req.query.limit) || 10; // 기본값 10
  const offset = parseInt(req.query.offset) || 0; // 기본값 0
  const sqlDESC = `SELECT * FROM project ORDER BY code DESC LIMIT ?, ?`; // 최신순
  const sqlASC = `SELECT * FROM project ORDER BY code ASC LIMIT ?, ?`; // 오래된순
  const sql = `SELECT * FROM project WHERE code = ?`;

  if (index == undefined) {
    query(sqlDESC, [offset, limit]).then((data) => res.send(data));
  } else {
    query(sql, [index]).then((data) => res.send(data[0]));
  }
});

// 게시판 데이터 총 개수 가져오기
router.get("/count", async (req, res) => {
  const sql1 = `SELECT COUNT(*) AS totalCount FROM project`;
  query(sql1).then((data) => res.send(data[0]));
});

// 게시판 카테고리 정보 가져오기기
router.get("/category", (req, res) => {
  // console.log("카테고리 정보 요청", req.query);

  const code = req.query.code;
  const sql = `
    SELECT category, progress
    FROM project 
    WHERE code = ?;
  `;

  query(sql, [code]).then((data) => {
    // console.log("카테고리 정보:", data);
    res.send(data[0]);
    
  })
  
});

// 게시판 글 추가
router.post("/", (req, res) => {
  const { year, title, customer, innerUrl, outerUrl, thumb } = req.body;
  const params = [year, title, customer, innerUrl, outerUrl, thumb];
  const sql = `
    INSERT INTO project
    VALUES (NULL,?,?,?,?,?,?);
  `;

  query(sql, params)
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "전송 실패" }));
});

// 연도 + 과정명 중복 확인
router.post("/dup", (req, res) => {
  const { year, title } = req.body;

  const sql = `
    SELECT * 
    FROM project
    WHERE year = ? AND title = ?;
  `;

  query(sql, [year, title])
    .then((data) => {
      if (data.length > 0) {
        res.send({ result: true, msg: "중복된 데이터가 있습니다.", code: data[0].code });
      } else {
        res.send({ result: false, msg: "중복된 데이터가 없습니다." });
      }
    })
    .catch((err) => {
      console.log("error", err);
      res.send(err);
    });
});

// 게시판 글 검색
router.post("/search", async (req, res) => {
  const { search, year } = req.body;
  let sql = `SELECT * FROM project WHERE 1=1 `;
  const params = [];

  if (search) {
    sql += ` AND (title LIKE ? OR customer LIKE ?) ORDER BY code DESC`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (year && year !== "all") {
    sql += ` AND year = ? ORDER BY code DESC`;
    params.push(Number(year));
  }

  if (search === "" && year === "all") sql += ` ORDER BY code DESC`;

  try {
    const data = await query(sql, params);
    res.send(data);
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    res.status(500).send({ msg: "검색 중 오류가 발생했습니다.", error });
  }
});

// 이미지 업로드
router.post("/upload", async (req, res) => {
  const { base64Image, originalName, code } = req.body;
  let index = req.body.code;
  if (index === undefined) {
    const sqlDESC = `SELECT * FROM project ORDER BY code DESC LIMIT 0, 1`;

    try {
      const data = await query(sqlDESC);
      if (data.length > 0) {
        index = data[0].code + 1;
      } else {
        index = 1;
      }
    } catch (error) {
      console.error("인덱스 값을 가져오는 중 오류 발생:", error);
      return res.status(500).send({ msg: "인덱스 값을 가져오는 중 오류 발생" });
    }
  }

  if (!base64Image) {
    return res.status(400).send({ msg: "이미지 데이터가 필요합니다." });
  }

  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    return res.status(400).send({ msg: "유효하지 않은 Base64 데이터입니다." });
  }

  const base64Data = matches[2];
  const cleanedOriginalName = originalName.replace(/^\d+_/, "");
  const filePath = `public/images/thumbnail/${index}_${cleanedOriginalName}`;

  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    const sql = "UPDATE project SET thumb = ? WHERE code = ?";
    query(sql, [filePath, index])
      .then((data) => {
        res.send({ msg: "이미지 업로드 성공", thumb: filePath });
      })
      .catch((err) => {
        console.error("데이터베이스 저장 실패:", err);
        res
          .status(500)
          .send({ msg: "데이터베이스 저장 중 오류가 발생했습니다." });
      });
  });
});

// 게시판 글 삭제
router.delete("/delete", (req, res) => {
  const code = req.body.code;
  const sql = `
    DELETE FROM project WHERE code = ?  
  `;
  query(sql, [code])
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ msg: "삭제 중 오류가 발생했습니다.", error: err })
    );
});

// 게시판 글 수정
router.patch("/update", (req, res) => {
  const index = req.query.code;
  if (!index) {
    return res.status(400).send({ msg: "수정할 게시글의 code가 필요합니다." });
  }

  const { year, title, customer, innerUrl, outerUrl } = req.body;
  const thumb = req.file ? req.file.path : req.body.thumb || null;
  const params = [year, title, customer, innerUrl, outerUrl, thumb, index];

  const sql = `
    UPDATE project SET 
    year = ?,
    title = ?,
    customer = ?,
    innerUrl = ?,
    outerUrl = ?,
    thumb = ?
    WHERE code = ?
  `;

  query(sql, params)
    .then((data) => {
      if (data.affectedRows > 0) {
        res.send({ msg: "게시글 수정 성공", data });
      } else {
        res.status(404).send({ msg: "수정할 게시글을 찾을 수 없습니다." });
      }
    })
    .catch((err) => {
      console.error("게시글 수정 실패:", err);
      res
        .status(500)
        .send({ msg: "게시글 수정 중 오류가 발생했습니다.", error: err });
    });
});



export default router;
