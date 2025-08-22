// 데이터베이스 연결 설정을 포함하며,  객체를 내보내는 파일.
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kbrainc3158!@",
  database: "resource_hub",
  charset: "utf8mb4",
  port: 3306,
  // connectionLimit: 10,
  // timezone: 'Asia/Seoul',
});

// connection.query('SELECT * FROM project', (err, results) => {
//   if (err) throw err;
// });
// connection.query('SELECT * FROM user', (err, results) => {
//   if (err) throw err;
// });

connection.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err.stack);
    return;
  }
  console.log("데이터베이스 연결 성공!");
});

export default connection;