var connection = require('./connection').connection
var utility = require('utility');
var util = require('./util')
var moment = require('moment')

module.exports = {
	login (req, res, next) {
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
	logout (req, res, next) {
		util.update({
			token: util.getToken(req),
			table: 'ed_admin',
			query: {
				token: ''
			},
			aim: 'id',
			params: [1],
			success: function(results) {
				res.json({
					status: 200,
					message: "登出成功"
				});
			}
		})
	},
	getUserLists (req, res, next) {
		let query = "SELECT * FROM ed_user",
			count, lastResults,
			limit = [],
			range = 2
			limit.push((req.body.page-1) * range)
			limit.push(req.body.page * range)
			console.log(limit)
		util.select({
			token: util.getToken(req),
			table: 'ed_user',
			target: ['count(*)'],
			query: 'sex = 0',
			success: function(results) {
				count = results[0]['count(*)']
				util.select({
					token: util.getToken(req),
					table: 'ed_user',
					limit: limit,
					success: function(r) {
						lastResults = r
						res.json({
							status: 200,
							message: '获取用户详情成功',
							count: count,
							data: lastResults
						})
					}
				})
			}
		})
	},
	getUserDetail (req, res, next) {
		let query = "SELECT * FROM ed_user WHERE id = '" + req.body.id + "'"
		util.select({
			token: util.getToken(req),
			table: 'ed_user',
			aim: 'id',
			params: req.body.id,
			success (r) {
					res.json({
						status: 200,
						message: '获取用户详情成功',
						data: r
					})
			}
		})
	},
	blockUser (req, res, next) {
		util.update({
			token: util.getToken(req),
			table: 'ed_user',
			query: req.body.data,
			aim: 'id',
			params: req.body.data.id,
			success (results) {
				res.json({
					status: 200,
					message: "用户状态操作成功"
				});
			}
		})
	},
	userDataSubmit (req, res, next) {
		let q = req.body.data
		q.birthday = Date.parse(moment(q.birthday)) / 1000
		util.update({
			token: util.getToken(req),
			table: 'ed_user',
			query: q,
			aim: 'id',
			params: req.params.id,
			success: function(results) {
				res.json({
					status: 200,
					message: "用户状态操作成功"
				});
			}
		})
	},
	getGenderRatio (req, res, next) {
		let q = "SELECT sex, count(*) FROM ed_user GROUP BY sex"
		util.getTokenQuery(req.body.token, q, function(results) {
			let buff = [{
				name: results[0].sex === 0?'男' : '女',
				value: results[0]['count(*)']
			}, {
				name: results[1].sex === 0?'男' : '女',
				value: results[1]['count(*)']
			}]
			res.json({
					status: 200,
					message: "用户状态操作成功",
					data: buff
				});
		})
	}
}