const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '포트번호',
    user: 'user',
    password: 'b@Con122$4',
    database: 'my_db'
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database');
});

module.exports = conn;