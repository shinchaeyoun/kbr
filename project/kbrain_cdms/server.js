import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = 5001;
const app = express();

// 미들웨어 설정
app.use(cors({
  origin: `http://192.168.23.2:5174`,
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 라우트 전체 등록
app.use(routes);

// 정적 파일 경로
app.use("/", express.static(path.join(__dirname, "./dist")));

// 정적 파일 경로 설정
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("서버에서 오류가 발생했습니다.");
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server listening at http://192.168.23.2:${port}`);
});
