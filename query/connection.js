var mysql = require('mysql');

exports.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'xiaocong',
  password : '1234',
  database : 'yishu',
  port     : 3306
});