var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/index', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});


module.exports = router;
