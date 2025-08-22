import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kbrainc3158!@",
  database: "resource_hub",
  charset: "utf8mb4",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err);
    console.error("에러 코드:", err.code);
    console.error("에러 메시지:", err.message);
    process.exit(1);
  }
  console.log("데이터베이스 연결 성공!");
  
  // 테스트 쿼리
  connection.query("SELECT COUNT(*) as count FROM item", (err, results) => {
    if (err) {
      console.error("쿼리 실행 실패:", err);
    } else {
      console.log("아이템 총 개수:", results[0].count);
    }
    connection.end();
  });
});
