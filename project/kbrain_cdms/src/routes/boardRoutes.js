// 게시판 관련 라우트
import express from "express";
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

const upload = multer({ storage });
// const upload = multer({ dest: "public/uploads/" });

const router = express.Router();

// 게시판 목록 가져오기
router.get("/", (req, res) => {
  const projectCode = Number(req.query.code);
  const limit = Number(req.query.limit) || 10; // 기본값 10
  const offset = parseInt(req.query.offset) || 0; // 기본값 0

  const sqlDESC = `SELECT * FROM board WHERE projectCode = ? ORDER BY idx DESC LIMIT ?, ?`; // 최신순
  const sqlASC = `SELECT * FROM board WHERE projectCode = ? ORDER BY idx ASC LIMIT ?, ?`; // 오래된순

  query(sqlDESC, [projectCode, offset, limit]).then((data) => res.send(data));
});

// 게시판 글 추가
router.post("/", upload.array("attachment"), (req, res) => {
  const { projectCode, subjectId, title, content, user } = req.body;

  const savedName = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file, idx) => {
      const fileName =
        typeof req.body.attachment_name == "object"
          ? req.body.attachment_name[idx]
          : req.body.attachment_name;

      savedName.push([file.filename, fileName].join(","));
    });
  } else {
    // 파일이 없는 경우 처리
  }

  const attachment = req.files ? savedName.join("|") : null;
  const tag = req.body.tag || null;

  // 현재 날짜 가져오기
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;

  const params = [
    projectCode,
    subjectId,
    tag,
    title,
    content,
    attachment,
    user,
    date,
  ];
  const sql = `
    INSERT INTO board
    VALUES (NULL, ?,?,?,?,?,?,?,?,0);
  `;

  query(sql, params)
    .then((data) => res.send({ msg: "전송 성공", data: data }))
    .catch((err) => res.send({ msg: "전송 실패", err: err }));
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
router.patch("/update", upload.single("attachment"), (req, res) => {
  const idx = req.query.idx;

  const { title, content } = req.body;
  const savedValue = req.file
    ? [req.file.filename, req.body.attachment_name, req.file.path].join(",")
    : null;
  const attachment = req.file ? savedValue : null;

  const params = [title, content || "", attachment, idx];

  const sql = `
    UPDATE board SET 
    title = ?,
    content = ?,
    attachment = ?
    WHERE idx = ?
  `;

  query(sql, params)
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "전송 실패", err: err }));
});

export default router;
