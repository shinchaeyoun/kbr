var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'b@Con122$4',
    database: 'mytest'
});
db.connect();

module.exports = db;