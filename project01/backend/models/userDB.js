const db = require('../database/db'); // 데이터베이스 연결 설정

exports.getUser = (userID) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM user where userID = ?`, userID, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};