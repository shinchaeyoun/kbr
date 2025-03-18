// const express = require("express");
// const cors = require("cors");
// const util = require("util");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
import express from 'express';
import cors from 'cors';
import util from 'util';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from "url"; 

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);


const port = 5000;


const app = express();

// app.use(cors({ credentials: true, origin: "http://localhost:5176" }));
app.use(cors());

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "b@Con122$4",
  database: "mytest",
  port: 3306,
});

// 데이터베이스 연결
connection.connect((error) => {
  if (error) {
    return console.error("데이터베이스 연결 실패:", error);
  }
  console.log("데이터베이스에 성공적으로 연결됨");
});

// JSON 형식의 본문을 파싱할 수 있도록 설정
app.use(bodyParser.json());


app.use('/', express.static(path.join(__dirname, './dist')));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
// });
// app.use('/', express.static('dist/client')); // 클라이언트 정적 파일 제공
// app.use('/app', (req, res) => {
//     const { html } = ssr(); // ssr.tsx의 render 함수 호출

//     const index = fs.readFileSync('./dist/client/index.html'); // 클라이언트 HTML 파일 읽기
//     const result = `${index}`.replace('<!-- root-container -->', html); // HTML 삽입    

//     res.setHeader('Content-Type', 'text/html').send(result); // 클라이언트에 응답
// });

// app.listen(5000); // 서버 시작


// 데이터베이스 쿼리 실행 예제
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 데이터베이스 쿼리 실행 예제
app.get("/hello", (req, res) => {
  connection.query("SELECT VERSION()", (error, result, fields) => {
    if (error) {
      return res.send("쿼리 실행 실패: " + error.message);
    }
    res.send("데이터베이스 서버 버전:" + result[0]["VERSION()"]);
  });
});

app.get("/send", (req, res) => {
  res.send("send!");
});
// '/send' 경로에 대한 POST 요청 처리
app.post("/send", (req, res) => {
  const { id, password } = req.body;
  console.log("Received data:", { id, password });

  const query = `
    INSERT INTO user (id, password)
    VALUES (?, ?);
  `;

  // 데이터베이스에 데이터를 삽입
  connection.execute(query, [id, password], (error, results, fields) => {
    if (error) {
      console.error("데이터 삽입 실패:", error);
      res.status(500).send("데이터 삽입에 실패했습니다.");
    } else {
      console.log("데이터 삽입 성공:", results);
      res.status(200).send("데이터가 성공적으로 삽입되었습니다.");
    }
  });
});

// login
app.get("/login", (req, res) => {
  // connection.query("SELECT * FROM user", (err, data) => {
  //   console.log("SELECT * FROM user", data);

  //   if (!err) res.send(data);
  //   else res.send(err);
  // });
  res.send("login");
});
app.post("/login", (req, res) => {
  console.log(`= = = > req : ${util.inspect(req.body)}`);
  const userId = req.body.id;
  const userPw = req.body.password;
  const userAuth = req.body.authority;
  const sql1 = "SELECT COUNT(*) AS result FROM user WHERE id = ?";

  console.log("userAuth", userAuth);

  connection.query(sql1, userId, (err, data, fields) => {
    if (!err) {
      // 동일한 id가 없다면
      if (data[0].result < 1) {
        console.log("동일한 id가 없다면", data, req.body);
        res.send({ msg: "입력하신 id 가 일치하지 않습니다." });
      } else {
        // 동일한 id 가 있으면 비밀번호 일치 확인
        // const sql2 = `SELECT
        //                     CASE (SELECT COUNT(*) FROM user WHERE id = ? AND password = ?)
        //                         WHEN '0' THEN NULL
        //                         ELSE (SELECT id FROM user WHERE id = ? AND password = ?)
        //                     END AS userId
        //                     , CASE (SELECT COUNT(*) FROM user WHERE id = ? AND password = ?)
        //                         WHEN '0' THEN NULL
        //                         ELSE (SELECT password FROM user WHERE id = ? AND password = ?)
        //                     END AS userPw
        //                     , CASE (SELECT authority FROM user WHERE id = ?)
        //                       WHEN '0' THEN NULL
        //                       ELSE (SELECT authority FROM user WHERE id = ?)
        //                     END AS userAuth`;

        // // sql 란에 필요한 parameter 값을 순서대로 기재
        // const params = [
        //   userId,
        //   userPw,
        //   userId,
        //   userPw,
        //   userId,
        //   userPw,
        //   userId,
        //   userPw,
        //   userAuth,
        // ];

        const sql2 = `
                      SELECT id AS userId, password AS userPw, authority AS userAuth
                      FROM user
                      WHERE id = ? AND password = ?
                    `;

        const params = [userId, userPw];

        connection.query(sql2, params, (err, data) => {
          if (!err) {
            // console.log("server : 로그인 성공", data[0]);

            const user = data[0];
            if (user.userAuth) {
              console.log("server: 로그인 성공, authority 값:", user.userAuth);
            } else {
              console.log("server: 로그인 성공, authority 값 없음");
            }

            res.send(user);
          } else {
            console.log("로그인 실패", err);
            res.send(err);
          }
        });
      }
    } else {
      res.send(err);
    }
  });
});

// signup
app.post("/signup", (req, res) => {
  const { id, password } = req.body;
  console.log("Received data:", { id, password });

  const query = `
    INSERT INTO user (id, password)
    VALUES (?, ?);
  `;

  // 데이터베이스에 데이터를 삽입
  connection.execute(query, [id, password], (error, results, fields) => {
    if (error) {
      console.error("데이터 삽입 실패:", error);
      res.status(500).send("데이터 삽입에 실패했습니다.");
    } else {
      console.log("데이터 삽입 성공:", results);
      res.status(200).send("데이터가 성공적으로 삽입되었습니다.");
    }
  });
});

app.post("/authority", (req, res) => {
  console.log("authority", req.body);
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});