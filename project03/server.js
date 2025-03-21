// const express = require("express");
// const cors = require("cors");
// const util = require("util");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
import express from "express";
import cors from "cors";
import util from "util";
import mysql from "mysql2";
import bodyParser from "body-parser";
import path from "path";
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

app.use("/", express.static(path.join(__dirname, "./dist")));
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
  res.send("server");
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
  console.log("??? login");

  res.send("login");
});
app.post("/login", (req, res) => {
  console.log(`= = = > req : ${util.inspect(req.body)}`);
  const userId = req.body.id;
  const userPw = req.body.password;
  const userAuth = req.body.level;
  const sql1 = "SELECT COUNT(*) AS result FROM user WHERE id = ?";

  connection.query(sql1, userId, (err, data, fields) => {
    if (!err) {
      // 동일한 id가 없다면
      if (data[0].result < 1) {
        console.log("동일한 id가 없다면", data, req.body);
        res.send({ msg: "입력하신 id 가 일치하지 않습니다." });
      } else {
        const sql2 = `
                      SELECT id AS userId, password AS userPw, level AS userAuth
                      FROM user
                      WHERE id = ? AND password = ?
                    `;

        const params = [userId, userPw];

        connection.query(sql2, params, (err, data) => {
          if (!err) {
            console.log("server : 로그인 성공 //////", data[0]);
            res.send(data[0]);
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

app.post("/search", (req, res) => {
  console.log(`= = = > req.query : ${util.inspect(req.query)}`);
  console.log(`= = = > req.body : ${util.inspect(req.body)}`);

  const searchValue = req.body.search;
  const params = [`%${searchValue}%`];

  if (searchValue !== undefined) {
    console.log("검색 값 보여주기");
    console.log("if =============", searchValue !== undefined);
    const query = `
      SELECT * FROM board 
      WHERE title LIKE ? 
      ORDER BY idx DESC 
      LIMIT 0, 10;
    `;

    connection.query(query, params, (error, data, fields) => {
      if (data !== undefined) {
        res.send(data);
      }
    });
  } else {
    console.log("전체 값 보여주기");

    const queryDESC = "SELECT * FROM board ORDER BY idx DESC LIMIT 0, 10";
    connection.query(queryDESC, (error, data, fields) => {
      res.send(data);
    });
  }
});

app.get("/board", (req, res) => {
  console.log(`= = = > req.body.idx : ${util.inspect(req.query.idx)}`);
  const index = req.query.idx;

  if (index == undefined) {
    // 0~n 번째 데이터만 가져오기
    const queryDESC = "SELECT * FROM board ORDER BY idx DESC LIMIT 0, 10";
    const queryASC = "SELECT * FROM board ORDER BY idx ASC LIMIT 0, 10";
    connection.query(queryDESC, (error, data, fields) => {
      res.send(data);
    });
  } else {
    // 인덱스 값을 받았을 때 해당 정보만 보내주기)
    const query = `
      SELECT * FROM board WHERE idx = ?
    `;
    connection.query(query, [index], (error, data, fields) => {
      console.log("data[0]", data[0]);

      res.send(data[0]);
    });
  }
});
app.post("/board", (req, res) => {
  // req.body에서 데이터를 바로 추출
  const {
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  } = req.body;

  // SQL 쿼리와 데이터 매핑
  const query = `
    INSERT INTO board
    VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
  `;
  const params = [
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  ];

  // DB 쿼리 실행
  connection.query(query, params, (err, data) => {
    if (err) {
      console.error("전송 실패:", err);
      // return res.status(500).send({ msg: "전송 실패" });
      res.send({ msg: "전송 실패" });
    }
    res.send(data);
  });

  console.log("Board 데이터 추가 시도");
});

app.delete("/board/delete", (req, res) => {
  console.log(`= = = > req : ${util.inspect(req.body)}`);
  const idx = req.body.idx;
  console.log(`= = = > idx : ${idx}`);

  const query = `
    DELETE FROM board WHERE idx = ?  
  `;
  connection.query(query, [idx], (err, data) => {
    res.send(data);
    console.log(err, data);
  });
});
app.patch("/update", (req, res) => {
  console.log(`= = = > req.query : ${util.inspect(req.query)}`);
  console.log(`= = = > req.body : ${util.inspect(req.body)}`);
  const index = req.query.idx;

  const {
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  } = req.body;

  const formattedStartAt = new Date(startAt)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const query = `
    UPDATE board SET 
    title = ?,
    subTitle = ?,
    customer = ?,
    pm1 = ?,
    pm2 = ?,
    pm3 = ?,
    startAt = ?,
    scheduledAt = ?,
    completedAt = ?,
    totalCha = ?,
    lmsTime = ?,
    lmsCode = ?,
    innerUrl = ?,
    outerUrl = ?,
    customerName = ?,
    customerTel = ?,
    customerPlan = ?,
    pottingComp = ?,
    etc = ?
    WHERE idx = ?
  `;

  const params = [
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    formattedStartAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
    index,
  ];

  connection.query(query, params, (error, data, fields) => {
    console.log([params, index], "data ===== ", error, data, fields);
    // res.send(data[0]);
    if (error) {
      console.error("수정 실패:", error);
      return res.status(500).send({ msg: "수정 실패", error });
    }
    res.status(200).send({ msg: "수정 성공", data });
  });
});

// signup 아이디 중복 확인
app.get("/signup", (req, res) => {
  const query = `
    SELECT COUNT(*) AS result FROM user WHERE id = ?
  `
  connection.query(query, req.query.id, (err, data, fields) => {
    let sendMsg = '';
    data[0].result == 1 ? sendMsg = "중복 아이디" : sendMsg = "생성 가능 아이디";
    res.send({result: data[0].result, msg: sendMsg});
  });
});
// 계정 생성
app.post("/signup", (req, res) => {
  const { id, password } = req.body;
  console.log("Received data:", { id, password });

  const query = `
    INSERT INTO user (id, password, level)
    VALUES (?, ?, 1);
  `;
  
  // 데이터베이스에 데이터를 삽입
  connection.query(query, [id, password], (error, data, fields) => {
    console.log('~~~~send data /////',data);
    
    if (error) {
      console.error("데이터 삽입 실패:", error);
      res.send({ msg: "전송 실패" });
    } else {
      console.log("데이터 삽입 성공:", data);
      res.send(data);
    }
    // if (error) {
    //   console.error("전송 실패:", error);
    //   res.send({ msg: "전송 실패" });
    // };
    // res.send(data);

  });


});

app.post("/authority", (req, res) => {
  console.log("authority", req.body);
});

app.get("/userinfo", (req, res) => {
  console.log(`= = = > req.query : ${util.inspect(req.query)}`);
  console.log(`= = = > req.body : ${util.inspect(req.body)}`);

  const query = "SELECT * FROM user";
  connection.query(query, (error, data, fields) => {
    res.send(data);
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server listening at http://192.168.23.65:${port}`);
});
