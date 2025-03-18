const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  port: '3000',
  user: 'root',
  password: 'b@Con122$4',
  database: 'mytest'
});

conn.connect((err) => {
  if(err) console.log(err);
  else console.log('Connected to the database');
});

module.exports = conn;