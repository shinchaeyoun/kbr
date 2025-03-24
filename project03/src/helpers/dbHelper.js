// 데이터베이스 헬퍼 파일 데이터베이스 쿼리 헬퍼 함수

import connection from "./dbConnection.js";

export const query = (sql, params) => {
  // console.log('query',sql, params);
  
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        // console.log('쿼리 실행 중 에러 발생:', error);
        return reject(error);
      }
      
      // console.log('쿼리 실행 성공:', results); // 쿼리 결과 출력
      resolve(results);
    });
  });
};