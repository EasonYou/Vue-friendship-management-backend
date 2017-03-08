var connection = require('./connection').connection
var utility = require('utility');
var util = require('./util')

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
	logout: function(req, res, next) {
		util.checkToken(req, res, next, function() {
			connection.query("UPDATE ed_admin SET token = '' WHERE id = 1" , function(error, results, fields) {
				if (error) throw error;
				res.json({status: 200, message: "登出成功"});
			})
		})
	},
	getUserLists: function(req, res, next) {
		util.checkToken(req, res, next, function() {
			connection.query("SELECT * FROM ed_user", function(error, results, fields) {
				if (error) throw error
				res.json({status: 200, message: '获取列表成功', data: results})
			})
		})
	},
	getUserDetail: function(req, res, next) {
		console.log(req.body, 'gud')
		util.checkToken(req, res, next, function() {
			console.log('aaa')
			connection.query("SELECT * FROM ed_user WHERE id = '" + req.body.id + "'", function(error, results, fields) {
				if (error) throw error
				console.log('results')
				res.json({status: 200, message: '获取用户详情成功', data: results})
			})
		})
	},
	blockUser: function(req, res, next) {
		console.log(req.body)
		util.checkToken(req, res, next, function() {
			connection.query("UPDATE ed_user SET state = '" + req.body.state + "' WHERE id = " + req.body.id , function(error, results, fields) {
					if (error) throw error;
					res.json({status: 200, message: "用户状态操作成功"});
				})
		})
	},
	userDataSubmit: function(req, res, next) {
		let q = req.body
		console.log("UPDATE ed_user SET nickname = '" + q.nickname 
						+ ",address = '" + q.address			
						+ "' WHERE id = " + req.params.id)

		connection.query("UPDATE ed_user SET nickname = '" + q.nickname 
						+ ",address = '" + q.address			
						+ "' WHERE id = " + req.params.id , function(error, results, fields) {
					if (error) throw error;
					res.json({status: 200, message: "用户状态操作成功"});
				})
	}
}