// 게시판 관련 라우트
import express from "express";
import multer from "multer";
import path from "path";
import util from "util";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";

const router = express.Router();

// 파일 저장 경로 및 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/thumbnail/"); // 저장 경로
  },
  filename: (req, file, cb) => { 
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(
    //   null,
    //   `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    // );
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB 제한
const upload = multer({ storage }); // 파일 크기 제한 없음 (테스트용)
;

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const index = req.query.idx;
  const limit = Number(req.query.limit) || 10; // 기본값 10
  const offset = parseInt(req.query.offset) || 0; // 기본값 0
  const sqlDESC = `SELECT * FROM board ORDER BY idx DESC LIMIT ?, ?`; // 최신순
  const sqlASC = `SELECT * FROM board ORDER BY idx ASC LIMIT ?, ?`; // 오래된순
  const sql = `SELECT * FROM board WHERE idx = ?`;
  console.log("req.query !!!!!!!!!!!!!", req.query);

  if (index == undefined) {
    console.log("index == undefined / if", offset, limit);
    console.log("req.query", req.query.test);

    query(sqlDESC, [offset, limit]).then((data) => res.send(data));
  } else {
    console.log("index == undefined / else", index == undefined);
    query(sql, [index]).then((data) => res.send(data[0]));
  }
});

// 게시판 글 추가
router.post("/", (req, res) => {
  console.log("req.body ====== res", req.body);
  const { year, title, customer, innerUrl, outerUrl, thumb } = req.body;

  const sql = `
    INSERT INTO board
    VALUES (NULL,?,?,?,?,?,?);
  `;

  const params = [year, title, customer, innerUrl, outerUrl, thumb];

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
  // const sql1 = `
  //         SELECT * FROM board
  //         WHERE title LIKE ?
  //         ORDER BY idx DESC
  //         LIMIT 0, 10;
  //       `;
  // const sql1 = `
  //         SELECT * FROM board
  //         WHERE MATCH(title, subTitle, customer, pm1, pm2, pm3) AGAINST(? IN BOOLEAN MODE)
  //         ORDER BY idx DESC
  //         LIMIT 0, 10;
  //       `;
  const sql1 = `
          SELECT * FROM board
          WHERE year LIKE ? OR title LIKE ? OR customer LIKE ?
          ORDER BY idx DESC
          LIMIT 0, 10;
        `;
  const sql2 = "SELECT * FROM board ORDER BY idx DESC LIMIT 0, 10";
  const searchValue = req.body.search;

  if (searchValue !== undefined) {
    const searchPattern = `%${searchValue}%`;
    query(sql1, [searchPattern, searchPattern, searchPattern])
      .then((data) => {
        res.send(data);
      })
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
  query(sql, [idx])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error("삭제 실패:", err);
      res.status(500).send({ msg: "삭제 중 오류가 발생했습니다.", error: err });
    });
});

// 이미지 업로드 엔드포인트
router.post("/upload", (req, res) => {
  const { base64Image, idx } = req.body;

  // Base64 데이터와 idx 유효성 검사
  if (!base64Image || !idx) {
    return res.status(400).send({ msg: "이미지 데이터와 idx가 필요합니다." });
  }

  // Base64 데이터에서 파일 정보 추출
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    return res.status(400).send({ msg: "유효하지 않은 Base64 데이터입니다." });
  }

  const mimeType = matches[1]; // MIME 타입 (예: image/png)
  const base64Data = matches[2]; // Base64 인코딩된 데이터
  const fileExtension = mimeType.split("/")[1]; // 확장자 (예: png)

  // 파일 저장 경로 및 이름 설정
  const fileName = `image-${Date.now()}.${fileExtension}`;
  const filePath = `public/images/thumbnail/${fileName}`;

  // Base64 데이터를 파일로 저장
  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    // 파일 경로를 데이터베이스에 저장
    const sql = "UPDATE board SET thumb = ? WHERE idx = ?";
    query(sql, [filePath, idx])
      .then((data) => {
        console.log("저장된 데이터:", data);
        res.send({ msg: "이미지 업로드 성공", thumb: filePath });
      })
      .catch((err) => {
        console.error("데이터베이스 저장 실패:", err);
        res.status(500).send({ msg: "데이터베이스 저장 중 오류가 발생했습니다." });
      });
  });
});

// 게시판 글 수정
router.patch("/update", (req, res) => {
  console.log(`= = = > update req.query : ${util.inspect(req.query)}`);
  console.log(`= = = > update req.body : ${util.inspect(req.body)}`);
  console.log(`= = = > update req.file : ${util.inspect(req.file)}`);
  const index = req.query.idx;

  console.log("req.file:", req.file); // 업로드된 파일 정보
  console.log("req.body:", req.body); // 요청 본문 데이터

  if (!index) {
    return res.status(400).send({ msg: "수정할 게시글의 idx가 필요합니다." });
  }

  const { year, title, customer, innerUrl, outerUrl } = req.body;
  const thumb = req.file ? req.file.path : req.body.thumb || null;

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

  const params = [year, title, customer, innerUrl, outerUrl, thumb, index];

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

// module.exports = router;
export default router;
