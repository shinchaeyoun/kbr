import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = 5001;
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 형식의 본문을 파싱할 수 있도록 설정

// 라우트 전체 등록
app.use(routes);

// 정적 파일 경로
app.use("/", express.static(path.join(__dirname, "./dist")));

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("서버에서 오류가 발생했습니다.");
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server listening at http://192.168.23.2:${port}`);
});
