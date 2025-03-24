// 데이터베이스 연결 설정을 포함하며,  객체를 내보내는 파일.

import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "b@Con122$4",
  database: "mytest",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err.stack);
    return;
  }
  console.log("데이터베이스 연결 성공!");
});

export default connection;