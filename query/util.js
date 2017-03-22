var connection = require('./connection').connection

module.exports = {
	getToken (req) {
		return req.body.token
	},
	checkToken (token, callback) {
		let q = "SELECT * FROM ed_admin WHERE token = '" + token + "'"
		this.query(q, function() {
			callback()
		})
	},
	getTokenQuery (token, query, callback) {
		this.checkToken(token, function() {
			connection.query(query, function(error, results, fields) {
				if(error) throw error
				callback(results)
			})
		})
	},
	query (query, callback) {
		connection.query(query, function(error, results, fields) {
			if(error) throw error
			if(!results.length) {
				res.json({status: 300, message: '登陆超时'})
				return
			}
			callback()
		})
	},
	/*
	* @param {Object} options 一个简单的UPDATE方法
	* {String} token token
	* {String} table 表名
	* {Object} query 查询字符，不能有对象
	* {String} aim 查询目标
	* {Array} params 目标
	* {Function} success(results) 成功回调函数
	*/
	// unpdate table SET query WHERE target in aim 
	update: function(options) {	
		let str = '',
			q = 'UPDATE ' + options.table,
			p = '('
		for(key in options.query) {
			if(key === 'id') continue
			str = str + key + " = '" + options.query[key] + "', "
		}
		str = str.replace(/,\ $/, '')
		if(typeof options.params === 'string') {
			var params = [].push(options.params)
		} else {
			var params = options.params
		}
		for(let i = 0; i < options.params.length; i++) {
			p += options.params[i] + ','
		}
		p = p.replace(/,$/, '')
		p += ')'
		str = str.replace(/,$/, '')
		q += ' SET ' + str + ' WHERE ' + options.aim + ' in ' + p
		console.log(q)
		if(options.token) {
			this.getTokenQuery(options.token, q, options.success)
		} else {
			this.query(q, options.success)
		}
	},
	// select target from table where aim in params
	select: function(options) {
		let target = '',
			q = 'SELECT '
		
		if(options.target && options.target.constructor === Array) {
			for(let i = 0; i < options.target.length; i ++) {
				if(options.target[i] === 'count(*)' || options.target[i] === 'count') {
					target += ' count(*) '
					break;
				}
				target += options.target[i] + ','
			}
		} else {
			target = '*'
		}

		target = target.replace(/,$/, '')
		q += target + ' FROM ' + options.table
		if(options.aim) {
			q += ' WHERE ' + options.aim + ' in '
			q += '('
			if(options.params && options.params.constructor === Array) {
				for(let i = 0; i <options.params.length ; i++ ) {
					q += options.params[i] + ','
				}
			} else {
				q += options.params
			}
			q = q.replace(/,$/, '')
			q += ')'
		}
		if(options.limit) {
			var limit = ' LIMIT '
			for(let i = 0; i< options.limit.length; i++) {
				limit += options.limit[i] +','
			}
			limit = limit.replace(/,$/, '')
			q += limit
		}
		console.log(q)
		if(options.token) {
			this.getTokenQuery(options.token, q, options.success)
		} else {
			this.query(q, options.success)
		}
	}
}