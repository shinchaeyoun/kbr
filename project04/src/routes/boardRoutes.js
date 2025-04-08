// 게시판 관련 라우트
import express from "express";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";

const router = express.Router();

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const index = req.query.idx;
  const limit = Number(req.query.limit) || 10; // 기본값 10
  const offset = parseInt(req.query.offset) || 0; // 기본값 0
  const sqlDESC = `SELECT * FROM board ORDER BY idx DESC LIMIT ?, ?`; // 최신순
  const sqlASC = `SELECT * FROM board ORDER BY idx ASC LIMIT ?, ?`; // 오래된순
  const sql = `SELECT * FROM board WHERE idx = ?`;

  if (index == undefined) {
    query(sqlDESC, [offset, limit]).then((data) => res.send(data));
  } else {
    query(sql, [index]).then((data) => res.send(data[0]));
  }
});

// 게시판 글 추가
router.post("/", (req, res) => {
  const { year, title, customer, innerUrl, outerUrl, thumb } = req.body;
  const params = [year, title, customer, innerUrl, outerUrl, thumb];
  const sql = `
    INSERT INTO board
    VALUES (NULL,?,?,?,?,?,?);
  `;

  query(sql, params)
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "전송 실패" }));
});

// 게시판 데이터 총 개수 가져오기
router.get("/count", async (req, res) => {
  const sql1 = `SELECT COUNT(*) AS totalCount FROM board`;
  query(sql1).then((data) => res.send(data[0]));
});

// 게시판 글 검색
router.post("/search", async (req, res) => {
  const { search, year } = req.body;

  // 기본 SQL 쿼리
  let sql = `SELECT * FROM board WHERE 1=1 ORDER BY idx DESC`; // 기본 조건 (항상 참)

  const params = [];

  // search 값이 있는 경우 조건 추가
  if (search) {
    sql += ` AND (title LIKE ? OR customer LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // year 값이 "all"이 아닌 경우에만 조건 추가
  if (year && year !== "all") {
    sql += ` AND year = ?`;
    params.push(year);
  }

  try {
    const data = await query(sql, params);
    res.send(data);
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    res.status(500).send({ msg: "검색 중 오류가 발생했습니다.", error });
  }
});

// 게시판 글 삭제
router.delete("/delete", (req, res) => {
  console.log("삭제 요청", req.body.idx);
  
  const idx = req.body.idx;
  const sql = `
    DELETE FROM board WHERE idx = ?  
  `;
  query(sql, [idx])
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ msg: "삭제 중 오류가 발생했습니다.", error: err })
    );
});

// 이미지 업로드 엔드포인트
router.post("/upload", async (req, res) => {
  const { base64Image, originalName, idx } = req.body;
  let index = req.body.idx; // 쿼리 파라미터에서 idx 가져오기

  if (index === undefined) {
    const sqlDESC = `SELECT * FROM board ORDER BY idx DESC LIMIT 0, 1`;

    try {
      const data = await query(sqlDESC); // 비동기 작업
      if (data.length > 0) {
        console.log("가장 최근 인덱스 값", data[0].idx);
        index = data[0].idx + 1; // 가장 최근 인덱스 값에 1을 더하여 사용
      } else {
        index = 1; // 테이블이 비어 있는 경우 기본값 설정
      }
      console.log("index 인덱스 값 재정의", index);
    } catch (error) {
      console.error("인덱스 값을 가져오는 중 오류 발생:", error);
      return res.status(500).send({ msg: "인덱스 값을 가져오는 중 오류 발생" });
    }
  }

  // Base64 데이터 유효성 검사
  if (!base64Image) {
    return res.status(400).send({ msg: "이미지 데이터가 필요합니다." });
  }

  // Base64 데이터에서 파일 정보 추출
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    return res.status(400).send({ msg: "유효하지 않은 Base64 데이터입니다." });
  }

  const base64Data = matches[2]; // Base64 인코딩된 데이터
  const filePath = `public/images/thumbnail/${index}_${originalName}`;

  // Base64 데이터를 파일로 저장
  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    // 파일 경로를 데이터베이스에 저장
    const sql = "UPDATE board SET thumb = ? WHERE idx = ?";
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

// 게시판 글 수정
router.patch("/update", (req, res) => {
  const index = req.query.idx;
  if (!index) {
    return res.status(400).send({ msg: "수정할 게시글의 idx가 필요합니다." });
  }

  const { year, title, customer, innerUrl, outerUrl } = req.body;
  const thumb = req.file ? req.file.path : req.body.thumb || null;
  const params = [year, title, customer, innerUrl, outerUrl, thumb, index];

  const sql = `
    UPDATE board SET 
    year = ?,
    title = ?,
    customer = ?,
    innerUrl = ?,
    outerUrl = ?,
    thumb = ?
    WHERE idx = ?
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
