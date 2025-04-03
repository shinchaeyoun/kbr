import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = 5000;
const app = express();

// 미들웨어 설정
// app.use(cors());
app.use(cors({
  origin: `http://192.168.23.65:5173`, // 클라이언트 URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));

// app.use(express.json()); // JSON 형식의 본문을 파싱할 수 있도록 설정
app.use(express.json({ limit: "50mb" })); // JSON 요청 크기 제한
app.use(express.urlencoded({ limit: "50mb", extended: true })); // URL-encoded 요청 크기 제한


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
  console.log(`Server listening at http://192.168.23.65:${port}`);
});
