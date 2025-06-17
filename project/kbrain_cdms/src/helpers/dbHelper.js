// 데이터베이스 헬퍼 파일 데이터베이스 쿼리 헬퍼 함수
import connection from "./dbConnection.js";

export const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      
      resolve(results);
    });
  });
};