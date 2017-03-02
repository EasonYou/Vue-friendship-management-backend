var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var utility = require('utility');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'EasonYou',
  password : '1234',
  database : 'yishu',
  port     : 3306
});

router.get('/hello/:id', function(req, res, next) {
	console.log(req.params.id)
    connection.query("SELECT * FROM ed_user WHERE id = " + req.params.id, function (error, results, fields) {
		console.log('wwww',req.query)
		if (error) throw error;
		if(!results.length) {
			res.json({status: 300});
		}
		res.json({status: 200, message: "这是一个JSON接口", data:results});
	});
});

router.post('/wade', function(req, res, next) {
	console.log(req.body, req.headers)
	res.json({status: 200, message: "这是一个JSON接口", data: 'hahaha'});
});

router.post('/login', function(req, res, next) {
	console.log(req.body.account)
	connection.query("SELECT * FROM ed_admin WHERE account = '" + req.body.account +  "'", function (error, results, fields) {
		if (error) throw error;
		if(!results.length) {
			res.json({status: 300});
		}
		if(results[0].password === req.body.password) {
			res.json({status: 200, message: "登陆成功"});
		} else {
			res.json({status: 300, message: "登陆失败"});
		}
		
	});
	
});
module.exports = router;
