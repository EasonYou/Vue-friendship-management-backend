var connection = require('./connection').connection

module.exports = {
	checkToken: function(req, res, next, callback) {
		console.log(req.body.token, 'CT')
		connection.query("SELECT * FROM ed_admin WHERE token = '" + req.body.token + "'", function (error, results, fields) {
			if(error) throw error
			if(!results.length) {
				res.json({status: 300, message: '登陆超时'})
				return
			}
			callback()
		})
	}
}