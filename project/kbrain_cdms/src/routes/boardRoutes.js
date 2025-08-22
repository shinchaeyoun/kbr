// 게시판 관련 라우트
import express from "express";
import { query } from "../helpers/dbHelper.js";
import fs from "fs";
import path from "path";
import multer from "multer";
import { log } from "console";
import AdmZip from "adm-zip";
import { queryObjects } from "v8";

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

const upload = multer({ storage });
const router = express.Router();

// 게시판 목록 가져오기
router.get("/", async (req, res) => {
  console.log("게시판 목록 요청:", req.body);
  
  const projectCode = Number(req.query.code);
  const subjectId = req.query.id ? Number(req.query.id) : null;
  const category = req.query.category || null;

  const limit = Number(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  let sqlDESC, params, totalCountSql, totalCountParams;

  if (!subjectId || subjectId === null) {
    sqlDESC = `SELECT * FROM board WHERE projectCode = ? AND (subjectId IS NULL OR subjectId = 'NULL') ORDER BY originIdx DESC LIMIT ?, ?`;
    params = [projectCode, offset, limit];
    totalCountSql = `SELECT COUNT(*) AS totalCount FROM board WHERE projectCode = ? AND (subjectId IS NULL OR subjectId = 'NULL')`;
    totalCountParams = [projectCode];
  } else {
    sqlDESC = `SELECT * FROM board WHERE projectCode = ? AND subjectId = ? AND category = ? ORDER BY originIdx DESC LIMIT ?, ?`;
    params = [projectCode, subjectId, category, offset, limit];
    totalCountSql = `SELECT COUNT(*) AS totalCount FROM board WHERE projectCode = ? AND subjectId = ? AND category = ?`;
    totalCountParams = [projectCode, subjectId, category];
  }

  // 목록 데이터 조회
  const listPromise = query(sqlDESC, params);
  // 전체 개수 조회
  const countPromise = query(totalCountSql, totalCountParams);

  Promise.all([listPromise, countPromise])
    .then(([list, count]) => {
      res.send({ list, totalCount: count[0]?.totalCount || 0 });
    })
    .catch((err) => {
      res.status(500).send({ msg: "데이터 조회 실패", err });
    });
});

// 게시물 상세페이지
router.get("/detail", async (req, res) => {
  let detailIndex = req.query.boardIndex ? Number(req.query.boardIndex) : null; // 게시판 인덱스
  if (!detailIndex || isNaN(detailIndex)) {
    return res
      .status(400)
      .send({ msg: "잘못된 게시글 인덱스입니다.", detailIndex });
  }
  const sql = `SELECT * FROM board WHERE idx = ?`; // 최신순

  query(sql, detailIndex)
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "데이터 조회 실패", err }));
});

// 게시판 글 추가
router.post("/", upload.array("attachment"), async (req, res) => {
  const { index, isMode, projectCode, subjectId, title, content, user } =
    req.body;
  const savedName = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file, idx) => {
      const fileName =
        typeof req.body.attachment_name == "object"
          ? req.body.attachment_name[idx]
          : req.body.attachment_name;

      savedName.push([file.filename, fileName].join(","));
    });
  }

  const attachment = req.files ? savedName.join("|") : null;
  const caregory = req.body.category || null;
  const label = req.body.label || null;

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

  let originIdx, depth;
  const nextIdSql = "SHOW TABLE STATUS LIKE 'board'";
  const nextIdQuery = await query(nextIdSql);
  const nextId = nextIdQuery[0].Auto_increment;
  const ogIdx = await query(
    `SELECT originIdx FROM board WHERE idx = ?`,[index]);
  if (isMode == "reply") {
    originIdx = ogIdx[0].originIdx; // 답글 작성 시 원본 게시글의 idx
    console.log('originIdx ======>', originIdx);
    
    depth = 1; // 답글 깊이 증가
  } else {
    originIdx = nextId;
    depth = 0; // 새 글 작성 시 depth는 0
  }

  let params;
  let sql;

  if (subjectId == "board") {
    // 공통 게시판
    params = [
      originIdx,
      projectCode,
      null, // subjectId를 null로 저장
      caregory,
      label,
      title,
      content,
      attachment,
      user,
      date,
      depth,
    ];
    sql = `
      INSERT INTO board
      (originIdx, projectCode, subjectId, category, label, title, content, attachment, user, date, depth, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
    `;
  } else {
    // 과목 게시판
    params = [
      originIdx,
      projectCode,
      subjectId,
      caregory,
      label,
      title,
      content,
      attachment,
      user,
      date,
      depth,
    ];
    sql = `
      INSERT INTO board
      (originIdx, projectCode, subjectId, category, label, title, content, attachment, user, date, depth, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
    `;
  }

  query(sql, params)
    .then((data) => {
      log("게시글 추가 성공:", data);
      res.send({ msg: "전송 성공", data: data, index: nextId });
    })
    .catch((err) => {
      log("게시글 추가 실패:", err);
      res.send({ msg: "전송 실패", err: err });
    });
});

// 게시글 조회수 증가
router.patch("/views/:idx", (req, res) => {
  const idx = req.params.idx;
  const sql = `UPDATE board SET views = views + 1 WHERE idx = ?`;
  query(sql, [idx])
    .then((data) => res.send({ success: true, data: data.serverStatus }))
    .catch((err) => res.status(500).send({ msg: "조회수 증가 실패", err }));
});

// 게시판 첨부파일 전체 다운로드 (zip)
router.get("/downloadAll", (req, res) => {
  const idx = req.query.idx;
  const sql = `SELECT attachment FROM board WHERE idx = ?`;
  const sql2 = `SELECT title FROM board WHERE idx = ?`;

  query(sql, [idx])
    .then(async (data) => {
      // 첨부파일 zip 파일명에 게시글 제목 사용
      let downloadName = idx;
      try {
        const data2 = await query(sql2, [idx]);
        if (data2 && data2[0] && data2[0].title) {
          downloadName = data2[0].title;
        }
      } catch (e) {
        // 실패 시 idx 사용
      }

      if (!data[0] || !data[0].attachment) {
        return res.status(404).send("첨부파일이 없습니다.");
      }

      const attachments = data[0].attachment.split("|").map((file) => {
        const [savedName] = file.split(",");
        return savedName;
      });

      const originalName = data[0].attachment.split("|").map((file) => {
        return file.split(",")[1];
      });

      const zipFilePath = `public/uploads/${idx}.zip`;
      const zip = new AdmZip();

      attachments.forEach((file, index) => {
        const filePath = path.join("public/uploads", file);
        zip.addLocalFile(filePath, "", originalName[index]);
      });

      zip.writeZip(zipFilePath);

      res.download(zipFilePath, `${downloadName}.zip`, (err) => {
        if (err) {
          console.error("ZIP 다운로드 중 오류 발생:", err);
          res.status(500).send("ZIP 다운로드 중 오류 발생");
        } else {
          fs.unlink(zipFilePath, (err) => {
            if (err) console.error("ZIP 파일 삭제 중 오류 발생:", err);
          });
        }
      });
    })
    .catch((err) => {
      console.error("첨부파일 다운로드 실패:", err);
      res.status(500).send({ msg: "첨부파일 다운로드 실패", err });
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
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${Buffer.from(safeOriginalName, "utf8").toString(
          "latin1"
        )}"; filename*=UTF-8''${encodedName}; charset=UTF-8`
      );
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

// 게시판 글 수정
router.patch("/update", upload.array("attachment"), async (req, res) => {
  // console.log('수정 요청:', req.body);

  const idx = req.query.idx;
  const { title, content } = req.body;

  let label = req.body.label || null;
  let category = req.body.category;
  if (!category) {
    const prev = await query(`SELECT category FROM board WHERE idx = ?`, [idx]);
    category = prev[0]?.category || null;
  }
  const remainFiles = req.body.remain_files
    ? JSON.parse(req.body.remain_files)
    : null;

  // 기존 첨부파일 정보 가져오기
  const getPrevAttachment = async () => {
    const sql = `SELECT attachment FROM board WHERE idx = ?`;
    const data = await query(sql, [idx]);
    return data[0]?.attachment || null;
  };

  let savedName = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file, idx) => {
      const fileName =
        typeof req.body.attachment_name == "object"
          ? req.body.attachment_name[idx]
          : req.body.attachment_name;
      savedName.push([file.filename, fileName].join(","));
    });
  }
  // 기존 첨부파일과 새 첨부파일 합치기 (삭제 반영)
  let attachment = null;
  const prev = await getPrevAttachment();
  let prevArr = prev ? prev.split("|") : [];
  if (remainFiles) {
    // remainFiles에 포함된 파일만 남김
    prevArr = prevArr.filter((f) => remainFiles.includes(f.split(",")[1]));
  }
  if (prevArr.length > 0 && savedName.length > 0) {
    attachment = prevArr.join("|") + "|" + savedName.join("|");
  } else if (prevArr.length > 0) {
    attachment = prevArr.join("|");
  } else if (savedName.length > 0) {
    attachment = savedName.join("|");
  } else {
    attachment = null;
  }

  const params = [category, title, label, content || "", attachment, idx];
  const sql = `
    UPDATE board SET 
    category = ?,
    title = ?,
    label = ?,
    content = ?,
    attachment = ?
    WHERE idx = ?
  `;
  query(sql, params)
    .then((data) => res.send({ msg: "전송 성공", data }))
    .catch((err) => res.send({ msg: "전송 실패", err: err }));
});

router.patch("/delete", async (req, res) => {
  const idx = req.body.idx;

  const sql = `
    UPDATE board SET 
    status = ?
    WHERE idx = ?
  `;

  query(sql, ["delete", idx])
    .then((data) => res.send({ msg: "전송 성공", data }))
    .catch((err) => res.send({ msg: "전송 실패", err: err }));
});

export default router;
