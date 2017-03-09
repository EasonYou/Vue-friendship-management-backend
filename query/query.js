var connection = require('./connection').connection
var utility = require('utility');
var util = require('./util')
var moment = require('moment')

module.exports = {
	login: function(req, res, next) {
	let query = "SELECT * FROM ed_admin WHERE account = '" + req.body.account +  "'"
	connection.query(query, function (error, results, fields) {
			if (error) throw error;
			if(!results.length) {
				res.json({status: 300});
				return;
			}
			if(results[0].password === req.body.password) {
				var buffer = (Date.parse(new Date()) + results[0].id).toString()
				var token = utility.md5(buffer)
				let query = "UPDATE ed_admin SET token = '" + token + "' WHERE id = 1"
				connection.query(query , function(error, results, fields) {
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
			let query = "UPDATE ed_admin SET token = '' WHERE id = 1"
			connection.query(query , function(error, results, fields) {
				if (error) throw error;
				res.json({status: 200, message: "登出成功"});
			})
		})
	},
	getUserLists: function(req, res, next) {
		util.checkToken(req, res, next, function() {
			let query = "SELECT * FROM ed_user"
			connection.query(query, function(error, results, fields) {
				if (error) throw error
				res.json({status: 200, message: '获取列表成功', data: results})
			})
		})
	},
	getUserDetail: function(req, res, next) {
		console.log(req.body, 'gud')
		util.checkToken(req, res, next, function() {
			let query = "SELECT * FROM ed_user WHERE id = '" + req.body.id + "'"
			connection.query(query, function(error, results, fields) {
				if (error) throw error
				results[0].birthday = moment.unix(results[0].birthday).format().slice(0, 10)
				console.log(results[0])
				res.json({status: 200, message: '获取用户详情成功', data: results})
			})
		})
	},
	blockUser: function(req, res, next) {
		util.checkToken(req, res, next, function() {
			let ids = ''
			for(let i = 0; i < req.body.ids.length; i++) {
				ids = req.body.ids + ','
			}
			ids = ids.replace(/,$/, '')
			console.log(req.body.dtime, 'dtime')
			let query = "UPDATE ed_user SET state = '" + req.body.state 
						+ "', dtime = '" + req.body.dtime
						+ "' WHERE id in (" + ids + ")"
						console.log(query)
			connection.query(query, function(error, results, fields) {
					if (error) throw error;
					res.json({status: 200, message: "用户状态操作成功"});
				})
		})
	},
	userDataSubmit: function(req, res, next) {
		let q = req.body
		q.birthday = Date.parse(moment(q.birthday))/1000
		var query = "UPDATE ed_user SET nickname = '" + q.nickname 
						+ "', address = '" + q.address
						+ "', phone = '" + q.phone
						+ "', sex = '" + q.sex
						+ "', state = '" + q.state
						+ "', birthday = '" + q.birthday
						+ "', email = '" + q.email
						+ "' WHERE id = " + req.params.id
			console.log(query)
		connection.query(query , function(error, results, fields) {
					if (error) throw error;
					res.json({status: 200, message: "用户状态操作成功"});
				})
	}
}