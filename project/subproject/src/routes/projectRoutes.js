// 게시판 관련 라우트
import express from "express";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";

const router = express.Router();

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const code = req.query.code;
  const limit = Number(req.query.limit) || 10; // 기본값 10
  const offset = parseInt(req.query.offset) || 0; // 기본값 0
  const sqlDESC = `SELECT * FROM project ORDER BY code DESC LIMIT ?, ?`; // 최신순
  const sqlASC = `SELECT * FROM project ORDER BY code ASC LIMIT ?, ?`; // 오래된순
  const sql = `SELECT * FROM project WHERE code = ?`;

  if (code == undefined) {
    query(sqlDESC, [offset, limit]).then((data) => res.send(data));
  } else {
    query(sql, [code]).then((data) => res.send(data[0]));
  }
});

// 게시판 글 추가
router.post("/", (req, res) => {
  const { year, title, customer, innerUrl, outerUrl, thumb } = req.body;
  const params = [year, title, customer, innerUrl, outerUrl, thumb];
  const sql = `
    INSERT INTO project
    VALUES (NULL,?,?,?,?,?,?,NULL);
  `;

  query(sql, params)
    .then((data) => {
      console.log("게시글 추가 성공");
      res.send(data);
    })
    .catch((err) => {
      console.log("게시글 추가 실패", err);
      res.send({ msg: "전송 실패" });
    });
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
        res.send({
          result: true,
          msg: "중복된 데이터가 있습니다.",
          code: data[0].code,
        });
      } else {
        res.send({ result: false, msg: "중복된 데이터가 없습니다." });
      }
    })
    .catch((err) => {
      console.log("error", err);
      res.send(err);
    });
});

// 게시판 데이터 총 개수 가져오기
router.get("/count", async (req, res) => {
  const sql1 = `SELECT COUNT(*) AS totalCount FROM project`;
  query(sql1).then((data) => res.send(data[0]));
});

// 게시판 글 검색
router.post("/search", async (req, res) => {
  const { search, year } = req.body;
  console.log("search, year", search, year);

  // 기본 SQL 쿼리
  let sql = `SELECT * FROM project WHERE 1=1 `; // 기본 조건 (항상 참)
  const params = [];

  // search 값이 있는 경우 조건 추가
  if (search) {
    sql += ` AND (title LIKE ? OR customer LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  // year 값이 "all"이 아닌 경우에만 조건 추가
  if (year && year !== "all") {
    sql += ` AND year = ?`;
    params.push(Number(year));
  }

  sql += ` ORDER BY code DESC`;

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
  console.log("삭제 요청", req.body);
  
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

// 이미지 업로드 엔드포인트
router.post("/upload", async (req, res) => {
  console.log("이미지 업로드 요청");

  const { base64Image, originalName } = req.body;
  let code = req.body.code; // 쿼리 파라미터에서 code 가져오기

  if (code === undefined) {
    const sqlDESC = `SELECT * FROM project ORDER BY code DESC LIMIT 0, 1`;

    try {
      const data = await query(sqlDESC); // 비동기 작업
      if (data.length > 0) {
        index = data[0].code + 1; // 가장 최근 인덱스 값에 1을 더하여 사용
      } else {
        index = 1; // 테이블이 비어 있는 경우 기본값 설정
      }
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
  // 기존 파일 이름에서 "index_" 접두사를 제거
  const cleanedOriginalName = originalName.replace(/^\d+_/, "");
  // 항상 code를 기준으로 파일 이름 생성
  const filePathSubproject = `public/images/thumbnail/${index}_${cleanedOriginalName}`;
  const filePathKbrainCdms = `../kbrain_cdms/public/images/thumbnail/${index}_${cleanedOriginalName}`;

  // Base64 데이터를 파일로 저장
  fs.writeFile(filePathSubproject, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    // kbrain_cdms에 저장
    fs.writeFile(filePathKbrainCdms, base64Data, { encoding: "base64" }, (err) => {
      if (err) {
        return res.status(500).send({ msg: "kbrain_cdms에 파일 저장 중 오류가 발생했습니다." });
      }

      const sql = "UPDATE project SET thumb = ? WHERE code = ?";
      query(sql, [filePathSubproject, index])
        .then(() => res.send({ msg: "이미지 업로드 성공", thumb: filePathSubproject }))
        .catch(() => res.status(500).send({ msg: "데이터베이스 저장 중 오류가 발생했습니다." }));
    });
  });
});

// 게시판 글 수정
router.patch("/update", (req, res) => {
  console.log("게시글 수정 요청", req.body);
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
