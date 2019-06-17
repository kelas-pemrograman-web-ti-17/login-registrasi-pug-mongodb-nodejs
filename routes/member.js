var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var Buku = require('../model/buku')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/databukumember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Buku.find({}, function(err, buku) {
        console.log(buku);
        res.render('admin/buku/table', { session_store: session_store, bukus: buku })
    }).select('_id kodebuku judulbuku sinopsis pengarang harga created_at')
});





module.exports = router;
