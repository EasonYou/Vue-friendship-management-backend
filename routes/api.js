var express = require('express');
var router = express.Router();
var utility = require('utility');
var connection = require('../query/connection').connection;
var query = require('../query/query')

router.post('/userLists', function(req, res, next) {
	query.getUserLists(req, res, next)
});

router.post('/wade', function(req, res, next) {
	res.json({status: 200, message: "这是一个JSON接口", data: 'hahaha'});
});

router.post('/login', function(req, res, next) {
	query.login(req, res, next)
});
router.post('/logout', function(req, res, next) {
	query.logout(req, res, next)
});

router.post('/userDetail/:id', function(req, res, next) {
	query.getUserDetail(req, res, next)
});
module.exports = router;
