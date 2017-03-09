var connection = require('./connection').connection
var utility = require('utility');
var util = require('./util')
var moment = require('moment')

module.exports = {
	login: function(req, res, next) {
		let query = "SELECT * FROM ed_admin WHERE account = '" + req.body.account + "'"
		connection.query(query, function(error, results, fields) {
			if (error) throw error;
			if (!results.length) {
				res.json({
					status: 300
				});
				return;
			}
			if (results[0].password === req.body.password) {
				var buffer = (Date.parse(new Date()) + results[0].id).toString()
				var token = utility.md5(buffer)
				let query = "UPDATE ed_admin SET token = '" + token + "' WHERE id = 1"
				connection.query(query, function(error, results, fields) {
					if (error) throw error;
					res.json({
						status: 200,
						message: "登陆成功",
						token: token
					});
				})
			} else {
				res.json({
					status: 300,
					message: "登陆失败"
				});
			}

		});
	},
	logout: function(req, res, next) {
		util.update({
			token: util.getToken(req),
			table: 'ed_admin',
			query: {
				token: ''
			},
			target: 'id',
			params: [1],
			success: function(results) {
				res.json({
					status: 200,
					message: "登出成功"
				});
			}
		})
	},
	getUserLists: function(req, res, next) {
		let query = "SELECT * FROM ed_user"
		util.select({
			token: util.getToken(req),
			table: 'ed_user',
			// target: ['nickname', 'birthday'],
			// limit: [0, 2],
			// params: {
			// 	nickname: ['13750051234'],
			// 	email: ['yycanusher@126.com']
			// },
			success: function(results) {
				res.json({
					status: 200,
					message: '获取列表成功',
					data: results
				})
			}
		})
	},
	getUserDetail: function(req, res, next) {
		let query = "SELECT * FROM ed_user WHERE id = '" + req.body.id + "'"

		util.query(util.getToken(req), query, function(results) {
			results[0].birthday = moment.unix(results[0].birthday).format().slice(0, 10)
			res.json({
				status: 200,
				message: '获取用户详情成功',
				data: results
			})
		})
	},
	blockUser: function(req, res, next) {
		util.update({
			token: util.getToken(req),
			table: 'ed_user',
			query: req.body.data,
			target: 'id',
			params: req.body.data.id,
			success: function(results) {
				res.json({
					status: 200,
					message: "用户状态操作成功"
				});
			}
		})
	},
	userDataSubmit: function(req, res, next) {
		let q = req.body.data
		q.birthday = Date.parse(moment(q.birthday)) / 1000
		util.update({
			token: util.getToken(req),
			table: 'ed_user',
			query: q,
			target: 'id',
			params: req.params.id,
			success: function(results) {
				res.json({
					status: 200,
					message: "用户状态操作成功"
				});
			}
		})
	}
}