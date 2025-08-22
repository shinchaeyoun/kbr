// 로그인 및 회원가입 관련 라우트
import express from "express";
import util from "util";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";
import path from "path";
import multer from "multer";
import { log } from "console";
import AdmZip from "adm-zip";

// 한글 파일명도 저장 가능한 multer storage 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // 한글 파일명 + 타임스탬프
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    let base = path.basename(originalName, ext);
    // 한글, 영문, 숫자, 일부 특수문자만 허용
    let safeBase = base.replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\s\(\)\[\]\-_.]/g, "");
    if (!safeBase || safeBase.trim() === "") {
      safeBase = "file";
    }
    const timestamp = Date.now();
    cb(null, `${safeBase}_${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 개별 파일 최대 500MB
    files: 3, // 최대 3개 파일
    fieldSize: 10 * 1024 * 1024, // 필드 크기 10MB 제한
    totalFileSize: 500 * 1024 * 1024, // 전체 파일 총 용량 500MB 제한
  },
  fileFilter: (req, file, cb) => {
    // 허용할 파일 확장자
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
      "application/x-zip-compressed",
      "text/plain",
      "audio/mpeg",
      "audio/wav",
      "video/mp4",
      "video/avi",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`), false);
    }
  },
});
const router = express.Router();

// 게시물 목록 조회
router.get("/", (req, res) => {
  const sql = `SELECT * FROM item ORDER BY \`index\` DESC;`;
  query(sql).then((data) => res.send(data));
});

// 제안 샘플 조회
router.get("/sample", (req, res) => {
  const category = req.query.category;
  const year = req.query.year;
  const depth = req.query.depth || 1;

  let sql = "SELECT * FROM item WHERE `category` = ? AND depth = ?";
  if (year) sql += " AND year = ?";

  sql += " ORDER BY `index` DESC";
  query(sql, [category, depth, year]).then((data) => res.send(data));
});

// 차시 정보 조회
router.get("/chasi", (req, res) => {
  const customer = req.query.customer;
  const year = req.query.year;
  const depth = 2;

  let sql = "SELECT * FROM item WHERE `customer` = ? AND depth = ?";
  if (year) sql += " AND year = ?";

  sql += " ORDER BY `index` ASC";
  query(sql, [customer, depth, year]).then((data) => res.send(data));
});

// 연도 정보 조회
router.get("/year", (req, res) => {
  const sql = "SELECT * FROM item WHERE year IS NOT NULL ORDER BY `index` DESC";
  query(sql).then((data) => res.send(data));
});

// 검색 기능
router.get("/search/:term", (req, res) => {
  const searchTerm = req.params.term;
  const sql = `
    SELECT * FROM item 
    WHERE title LIKE ? OR description LIKE ? OR tag LIKE ? 
    ORDER BY \`index\` DESC
  `;
  const searchPattern = `%${searchTerm}%`;

  query(sql, [searchPattern, searchPattern, searchPattern])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error("검색 실패:", err);
      res.status(500).send({ msg: "검색 실패", error: err });
    });
});

// header search
router.get("/search", async (req, res) => {
  const { searchTrim } = req.query;
  let limits = req.query.limits || [3, 3, 3];

  try {
    if (typeof limits === "string") {
      try {
        limits = JSON.parse(limits);
      } catch {
        limits = Array.isArray(limits) ? limits : [limits];
      }
    }

    const categorySql = `SELECT DISTINCT category FROM item`;
    const categories = await query(categorySql);

    const results = {};
    const totalCounts = {}; // 전체 개수를 저장할 객체

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];

      // 전체 개수를 먼저 구하기
      let countSql = `SELECT COUNT(*) as total FROM item WHERE category = ?`;
      const countParams = [cat.category];

      if (searchTrim) {
        countSql += ` AND (title LIKE ? OR tag LIKE ?)`;
        countParams.push(`%${searchTrim}%`, `%${searchTrim}%`);
      }

      const countResult = await query(countSql, countParams);
      totalCounts[cat.category] = countResult[0].total;

      // 제한된 개수만큼 데이터 가져오기
      let sql = `SELECT * FROM item WHERE category = ?`;
      const params = [cat.category];

      if (searchTrim) {
        sql += ` AND (title LIKE ? OR tag LIKE ?)`;
        params.push(`%${searchTrim}%`, `%${searchTrim}%`);
      }

      // limit 결정
      let limit = 3;
      if (Array.isArray(limits)) limit = Number(limits[i] ?? 3);
      else if (limits && typeof limits === "object") limit = Number(limits[cat.category] ?? 3);
      else limit = Number(req.query.limit ?? 3);

      sql += ` ORDER BY \`index\` DESC LIMIT ?`;
      params.push(limit);

      const items = await query(sql, params);
      results[cat.category] = items;
    }
    res.send({ data: results, totalCounts }); // 전체 개수도 함께 전송
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    res.status(500).send({ msg: "검색 중 오류가 발생했습니다.", error });
  }
});

// 게시판 첨부파일 다운로드
router.get("/filedownload", (req, res) => {
  const idx = Number(req.query.idx);
  const fileIdx = Number(req.query.fileIdx) || 0;
  const sql = "SELECT attachment FROM item WHERE `index` = ?";

  let savedName, originalName;
  query(sql, [idx])
    .then((data) => {
      if (!data[0] || !data[0].attachment) {
        return res.status(404).send("첨부파일이 없습니다.");
      }

      if (data[0].attachment) {
        originalName = data[0].attachment.split("|").map((file) => {
          const [savedName, originalName] = file.split(",");
          return originalName;
        });
        savedName = data[0].attachment.split("|").map((file) => {
          const [savedName, originalName] = file.split(",");
          return savedName;
        });
      }

      if (!savedName[fileIdx] || !originalName[fileIdx]) {
        return res.status(404).send("요청한 파일이 존재하지 않습니다.");
      }

      const filePath = path.join(process.cwd(), "public", "uploads", savedName[fileIdx]);
      const safeOriginalName = originalName[fileIdx].replace(/["\\]/g, "");

      // 파일 존재 여부 확인
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error("파일이 존재하지 않습니다:", filePath);
          return res.status(404).send("파일을 찾을 수 없습니다.");
        }

        // 파일 정보 확인
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error("파일 정보 조회 실패:", err);
            return res.status(500).send("파일 정보 조회 실패");
          }

          const encodedName = encodeURIComponent(safeOriginalName);
          res.setHeader("Content-Disposition", `attachment; filename="${Buffer.from(safeOriginalName, "utf8").toString("latin1")}"; filename*=UTF-8''${encodedName}`);
          res.setHeader("Content-Type", "application/octet-stream");
          res.setHeader("Content-Length", stats.size);

          res.download(filePath, safeOriginalName, (err) => {
            if (err) {
              console.error("파일 다운로드 중 오류 발생:", err);
              if (!res.headersSent) {
                res.status(500).send("파일 다운로드 중 오류 발생");
              }
            }
          });
        });
      });
    })
    .catch((err) => {
      console.error("첨부파일 다운로드 실패:", err);
      res.status(500).send({ msg: "첨부파일 다운로드 실패", err });
    });
});

// 전체 태그 조회
router.get("/tag", (req, res) => {
  const sql = `SELECT DISTINCT tag FROM item WHERE tag IS NOT NULL AND tag != ''`;
  query(sql).then((data) => res.send(data));
});

// 상세 페이지 조회
router.get("/detail/:no", (req, res) => {
  const idx = Number(req.params.no);

  if (isNaN(idx)) {
    return res.status(400).send("Invalid index");
  }

  const sql = `SELECT * FROM item WHERE \`index\` = ?;`;
  query(sql, [idx])
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).send("Item not found");
      }
      res.send(data[0]);
    })
    .catch((err) => {
      console.error("Error fetching item detail:", err);
      res.status(500).send("Error fetching item detail");
    });
});

// 카테고리별 게시물 조회
router.get("/:cate", (req, res) => {
  const category = req.params.cate;
  const sql = "SELECT * FROM item WHERE `category` = ? ORDER BY `index` DESC";
  query(sql, [category]).then((data) => res.send(data));
});

// 태그별 게시물 조회
router.get("/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  // FIND_IN_SET을 사용하여 쉼표로 구분된 tag 필드에서 해당 태그가 포함되어 있는지 확인
  const sql = "SELECT * FROM item WHERE FIND_IN_SET(?, `tag`) > 0 ORDER BY `index` DESC";
  query(sql, [tag]).then((data) => res.send(data));
});

// 수정모드 데이터 조회
router.get("/edit/:no", (req, res) => {
  console.log("req.params", req.params);
  const index = Number(req.params.no);
  const sql = `SELECT * FROM item WHERE \`index\` = ?;`;

  query(sql, [index])
    .then((data) => res.send(data[0]))
    .catch((err) => {
      console.error("Error fetching item detail:", err);
      res.status(500).send("Error fetching item detail");
    });
});

// 게시판 첨부파일 다운로드
router.get("/filedownload", (req, res) => {
  const idx = req.query.idx;
  const fileIdx = req.query.fileIdx || 0;
  const sql = `SELECT attachment FROM board WHERE idx = ?`;

  let savedName, originalName;
  query(sql, [idx])
    .then((data) => {
      if (data[0].attachment) {
        originalName = data[0].attachment.split("|").map((file) => {
          const [savedName, originalName] = file.split(",");
          return originalName;
        });
        savedName = data[0].attachment.split("|").map((file) => {
          const [savedName, originalName] = file.split(",");
          return savedName;
        });
      }

      if (!data[0] || !data[0].attachment) {
        return res.status(404).send("첨부파일이 없습니다.");
      }

      const filePath = `public/uploads/${savedName[fileIdx]}`;
      const safeOriginalName = originalName[fileIdx].replace(/["\\]/g, "");
      const encodedName = encodeURIComponent(safeOriginalName);
      res.setHeader("Content-Disposition", `attachment; filename="${Buffer.from(safeOriginalName, "utf8").toString("latin1")}"; filename*=UTF-8''${encodedName}; charset=UTF-8`);
      res.setHeader("Content-Type", "application/octet-stream; charset=UTF-8");
      res.download(filePath, safeOriginalName, (err) => {
        if (err) {
          console.error("파일 다운로드 중 오류 발생:", err);
          res.status(500).send("파일 다운로드 중 오류 발생");
        }
      });
    })
    .catch((err) => {
      console.error("첨부파일 다운로드 실패:", err);
      res.status(500).send({ msg: "첨부파일 다운로드 실패", err });
    });
});

// 게시판 글 등록
router.post(
  "/",
  upload.fields([
    { name: "attachment", maxCount: 3 },
    { name: "thumb", maxCount: 1 },
  ]),
  async (req, res) => {
    const { index, category, title, description, innerUrl, outerUrl, thumb, tag, user } = req.body;

    // 첨부파일 처리
    const savedName = [];

    if (req.files && req.files.attachment && req.files.attachment.length > 0) {
      req.files.attachment.forEach((file, idx) => {
        const fileName = typeof req.body.attachment_name == "object" ? req.body.attachment_name[idx] : req.body.attachment_name;

        savedName.push([file.filename, fileName].join(","));
      });
    }

    const attachments = req.files && req.files.attachment ? savedName.join("|") : null;

    // 썸네일 처리
    let thumbPath = null;
    if (req.files && req.files.thumb && req.files.thumb[0]) {
      thumbPath = req.files.thumb[0].filename;
    }

    // 현재 날짜 가져오기
    const now = new Date();

    // 한국 시간으로 변환 (UTC+9)
    const nowKR = new Date(now.getTime());
    const hours = String(nowKR.getHours()).padStart(2, "0");
    const minutes = String(nowKR.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day} ${time}`;

    let ogIndex;
    const nextIdSql = "SHOW TABLE STATUS LIKE 'item'";
    const nextIdQuery = await query(nextIdSql);
    const nextId = nextIdQuery[0].Auto_increment;
    // const ogIdx = await query(`SELECT ogIndex FROM item WHERE index = ?`, [index]);

    // if (isMode == "reply") {
    //   ogIndex = ogIdx[0].ogIndex; // 답글 작성 시 원본 게시글의 idx

    // } else {
    ogIndex = nextId;
    // }

    const sql = `
    INSERT INTO item (ogIndex, category, title, description, date, innerUrl, outerUrl, thumb, tag, attachment, user, views, type, customer, year, depth, width, height, etc4, etc5, etc6)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?,?);
  `;

    const params = [
      ogIndex,
      category,
      title,
      description,
      date,
      innerUrl,
      outerUrl,
      // thumbPath || thumb,
      thumb,
      tag,
      attachments,
      user || "anonymous",
      req.body.type || "",
      req.body.customer || "",
      req.body.year || "",
      req.body.etc1 || "",
      req.body.width || "",
      req.body.height || "",
      req.body.etc4 || "",
      req.body.etc5 || "",
      req.body.etc6 || "",
    ];

    query(sql, params)
      .then((data) => res.send({ msg: "등록 완료", data: data }))
      .catch((err) => {
        console.error("Error adding item:", err);
        res.status(500).send({ msg: "Error adding item" });
      });
  }
);

// 제안 샘플 고객사 등록
router.post("/customer", async (req, res) => {
  const { category, title, year } = req.body;

  let ogIndex;
  const nextIdSql = "SHOW TABLE STATUS LIKE 'item'";
  const nextIdQuery = await query(nextIdSql);
  const nextId = nextIdQuery[0].Auto_increment;
  ogIndex = nextId;

  const sql = `
    INSERT INTO item (ogIndex, category, title, description, date, innerUrl, outerUrl, thumb, tag, attachment, user, views, type, customer, year, depth, width, height, etc4, etc5, etc6)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 1, ?, ?, ?, ?,?);
  `;

  const params = [
    ogIndex,
    category,
    title,
    req.body.description || "",
    req.body.date || "",
    req.body.innerUrl || "",
    req.body.outerUrl || "",
    req.body.thumb || "",
    req.body.tag || "",
    req.body.attachments || "",
    req.body.user || "anonymous",
    req.body.type || "",
    req.body.customer || "",
    req.body.year || "",
    req.body.etc1 || "",
    req.body.width || "",
    req.body.height || "",
    req.body.etc4 || "",
    req.body.etc5 || "",
    req.body.etc6 || "",
  ];

  query(sql, params)
    .then((data) => res.send({ msg: "등록 완료", data: data }))
    .catch((err) => {
      console.error("Error adding item:", err);
      res.status(500).send({ msg: "Error adding item" });
    });
});

// 차시 등록
router.post("/chasi", async (req, res) => {
  const { ogIndex, category, title, innerUrl, outerUrl, type, customer, year, width, height } = req.body;
  const depth = 2; // 차시는 항상 depth 2로 설정

  const sql = `
    INSERT INTO item (ogIndex, category, title, description, date, innerUrl, outerUrl, thumb, tag, attachment, user, views, type, customer, year, depth, width, height, etc4, etc5, etc6)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,?,?,?);
  `;

  const params = [
    ogIndex,
    category,
    title,
    req.body.description || "",
    req.body.date || "",
    innerUrl || "",
    outerUrl || "",
    req.body.thumb || "",
    req.body.tag || "",
    req.body.attachments || "",
    req.body.user || "anonymous",
    type || "",
    customer || "",
    year || "",
    depth,
    width || "",
    height || "",
    req.body.etc4 || "",
    req.body.etc5 || "",
    req.body.etc6 || "",
  ];

  query(sql, params)
    .then((data) => res.send({ msg: "등록 완료", data: data }))
    .catch((err) => {
      console.error("Error adding item:", err);
      res.status(500).send({ msg: "Error adding item" });
    });
});

// 썸네일 업로드
router.post("/thumbupload", upload.single("thumb"), async (req, res) => {
  const { base64Image, originalName } = req.body;
  let code = req.body.code; // 쿼리 파라미터에서 code 가져오기
  let index;

  if (code === undefined) {
    const sqlDESC = `SELECT * FROM item ORDER BY \`index\` DESC LIMIT 0, 1`;

    try {
      const data = await query(sqlDESC); // 비동기 작업
      if (data.length > 0) {
        index = data[0].index + 1; // 가장 최근 인덱스 값에 1을 더하여 사용
      } else {
        index = 1; // 테이블이 비어 있는 경우 기본값 설정
      }
    } catch (error) {
      console.error("인덱스 값을 가져오는 중 오류 발생:", error);
      return res.status(500).send({ msg: "인덱스 값을 가져오는 중 오류 발생" });
    }
  } else {
    index = code; // code가 있으면 index로 사용
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
  // 항상 index를 기준으로 파일 이름 생성
  const filePathSubproject = `public/images/thumbnail/${index}_${cleanedOriginalName}`;

  // Base64 데이터를 파일로 저장
  fs.writeFile(filePathSubproject, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    // 데이터베이스 업데이트 (index 컬럼 사용)
    const sql = "UPDATE item SET thumb = ? WHERE `index` = ?";
    query(sql, [filePathSubproject, index])
      .then(() => {
        res.send({ msg: "이미지 업로드 성공", thumb: filePathSubproject });
      })
      .catch((dbErr) => {
        console.error("데이터베이스 저장 실패:", dbErr);
        res.status(500).send({ msg: "데이터베이스 저장 중 오류가 발생했습니다." });
      });
  });
});

// 게시판 글 검색
router.post("/search", async (req, res) => {
  console.log("안녕", req.query);

  // const { searchTrim, offset = 0, limit = 3 } = req.body;
  // const limit = Number(req.query.limit) || 10; // 기본값 10
  // const offset = parseInt(req.query.offset) || 0; // 기본값 0

  // 카테고리 목록을 먼저 가져옴
  const categorySql = `SELECT DISTINCT category FROM item`;
  try {
    const categories = await query(categorySql);

    // 각 카테고리별로 3개씩 가져오기
    const results = {};
    for (const cat of categories) {
      let sql = `SELECT * FROM item WHERE category = ?`;
      const params = [cat.category];

      if (searchTrim) {
        sql += ` AND (title LIKE ? OR tag LIKE ?)`;
        params.push(`%${searchTrim}%`, `%${searchTrim}%`);
      }

      sql += ` ORDER BY \`index\` DESC LIMIT ?, ?`;
      params.push(Number(offset), Number(limit));

      const items = await query(sql, params);
      results[cat.category] = items;
    }

    res.send(results);
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    res.status(500).send({ msg: "검색 중 오류가 발생했습니다.", error });
  }
});

// 상호작용 수정
router.patch(
  "/update",
  upload.fields([
    { name: "attachment", maxCount: 3 },
    { name: "thumb", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("req.files", req.files);

    const index = req.query.index;
    const { category, title, description, innerUrl, outerUrl, tag, user } = req.body;

    // 첨부파일 처리
    const savedName = [];
    if (req.files && req.files.attachment && req.files.attachment.length > 0) {
      req.files.attachment.forEach((file, idx) => {
        const fileName = Array.isArray(req.body.attachment_name) ? req.body.attachment_name[idx] : req.body.attachment_name;
        savedName.push([file.filename, fileName].join(","));
      });
    }
    const attachments = req.files && req.files.attachment ? savedName.join("|") : req.body.attachment || null;

    // 썸네일 처리
    // let thumbPath = null;
    // if (req.files && req.files.thumb && req.files.thumb[0]) {
    //   thumbPath = req.files.thumb[0].filename;
    // }

    // 썸네일이 새로 등록되는 경우만 파일 경로 사용, 아니면 기존 값 유지
    let thumb = req.body.thumb || null;
    if (req.files && req.files.thumb && req.files.thumb[0]) {
      thumb = req.files.thumb[0].filename;
    }

    const sql = `
      UPDATE item SET
        category = ?,
        title = ?,
        description = ?,
        innerUrl = ?,
        outerUrl = ?,
        thumb = ?,
        tag = ?,
        attachment = ?,
        width = ?,
        height = ?
      WHERE \`index\` = ?
    `;
    const params = [category, title, description, innerUrl, outerUrl, thumb, tag, attachments, req.body.width || 1280, req.body.height || 720, index];

    query(sql, params)
      .then((data) => res.send({ msg: "수정 완료", data }))
      .catch((err) => {
        console.error("Error updating item:", err);
        res.status(500).send({ msg: "Error updating item" });
      });
  }
);

// 제안 샘플 타이틀 수정
router.patch("/sample/title", (req, res) => {
  const { index, title, year } = req.body;
  const sql = `UPDATE item SET title = ?, year = ? WHERE \`index\` = ?`;
  query(sql, [title, year, index])
    .then((data) => {
      res.send({ msg: "제안 샘플 타이틀 수정 완료", data: data });
    })
    .catch((err) => {
      console.error("제안 샘플 타이틀 수정 오류:", err);
      res.status(500).send({ msg: "제안 샘플 타이틀 수정 중 오류 발생", err });
    });
});

// 제안 샘플 차시 수정
router.patch("/chasi", (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  const updatePromises = items.map((item) => {
    const { index, title, description, innerUrl, outerUrl, thumb, tag, attachment, user, type, customer, year, width, height, etc4, etc5, etc6 } = item;

    const sql = `
      UPDATE item SET
        title = ?,
        description = ?,
        innerUrl = ?,
        outerUrl = ?,
        thumb = ?,
        tag = ?,
        attachment = ?,
        user = ?,
        type = ?,
        customer = ?,
        year = ?,
        width = ?,
        height = ?,
        etc4 = ?,
        etc5 = ?,
        etc6 = ?
      WHERE \`index\` = ?
    `;

    const params = [title, description, innerUrl, outerUrl, thumb, tag, attachment, user, type, customer, year, width, height, etc4, etc5, etc6, index];

    return query(sql, params);
  });

  Promise.all(updatePromises)
    .then((results) => {
      res.send({ msg: "차시 수정 완료", results });
    })
    .catch((err) => {
      console.error("차시 수정 오류:", err);
      res.status(500).send({ msg: "차시 수정 중 오류 발생", err });
    });
});

// 게시글 조회수 증가
router.patch("/views/:idx", (req, res) => {
  const idx = req.params.idx;
  const sql = `UPDATE item SET views = views + 1 WHERE index = ?`;
  query(sql, [idx])
    .then((data) => res.send({ success: true, data: data.serverStatus }))
    .catch((err) => res.status(500).send({ msg: "조회수 증가 실패", err }));
});

// 게시물 삭제
router.delete("/delete", (req, res) => {
  const idx = req.query.idx;
  const sql = `DELETE FROM item WHERE \`index\` = ?`;
  query(sql, [idx])
    .then((data) => res.send({ msg: "삭제 완료", data: data }))
    .catch((err) => res.status(500).send({ msg: "삭제 실패", err }));
});

// 제안 샘플 삭제
router.delete("/sample/delete", (req, res) => {
  const idx = req.query.idx;
  const sql = `DELETE FROM item WHERE \`ogIndex\` = ?`;
  query(sql, [idx])
    .then((data) => res.send({ msg: "삭제 완료", data: data }))
    .catch((err) => res.status(500).send({ msg: "삭제 실패", err }));
});

export default router;
