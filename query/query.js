var connection = require('./connection').connection
var utility = require('utility');

module.exports = {
	login: function(req, res, next) {
	connection.query("SELECT * FROM ed_admin WHERE account = '" + req.body.account +  "'", function (error, results, fields) {
			if (error) throw error;
			if(!results.length) {
				res.json({status: 300});
				return;
			}
			if(results[0].password === req.body.password) {
				var buffer = (Date.parse(new Date()) + results[0].id).toString()
				var token = utility.md5(buffer)
				connection.query("UPDATE ed_admin SET token = '" + token + "' WHERE id = 1" , function(error, results, fields) {
					if (error) throw error;
					res.json({status: 200, message: "登陆成功", token: token});
				})
			} else {
				res.json({status: 300, message: "登陆失败"});
			}
			
		});
	},
	getUserLists: function(req, res, next) {
		console.log('cookies', req.cookies)
		connection.query("SELECT * FROM ed_admin WHERE token = '" + req.body.token + "'", function(error, results, fields) {
			if(error) throw error
			if(!results.length) {
				res.json({status: 300, message: '登陆超时'})
				return
			}
			connection.query("SELECT * FROM ed_user", function(error, results, fields) {
				if (error) throw error
				res.json({status: 200, message: '获取列表成功', data: results})
			})
		})
	}
}