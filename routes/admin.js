var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Buku = require('../model/buku')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        //console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/databuku', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Buku.find({}, function(err, buku) {
        //console.log(buku);
        res.render('admin/buku/table', { session_store: session_store, bukus: buku })
    }).select('_id kodebuku judulbuku sinopsis pengarang harga created_at')
});

/* GET users listing. */
router.get('/inputbuku', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/buku/input_data', { session_store: session_store})
});

//input data buku
router.post('/inputbuku', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Buku.find({ kodebuku: req.body.kodebuku }, function(err, buku) {
            if (buku.length == 0) {
                var databuku = new Buku({
                    kodebuku: req.body.kodebuku,
                    judulbuku: req.body.judulbuku,
                    sinopsis: req.body.sinopsis,
                    pengarang: req.body.pengarang,
                    harga: req.body.harga,
                })
                databuku.save(function(err) {
                    if (err) {
                        console.log(err);
                        req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                        res.redirect('/databuku')
                    } else {
                        req.flash('msg_info', 'User telah berhasil dibuat')
                        res.redirect('/databuku')
                    }
                })
            } else {
                req.flash('msg_error', 'Maaf, kode buku sudah ada....')
                res.render('admin/buku/input_data', {
                    session_store: session_store,
                    kodebuku: req.body.kodebuku,
                    judulbuku: req.body.judulbuku,
                    sinopsis: req.body.sinopsis,
                    pengarang: req.body.pengarang,
                    harga: req.body.harga,
                })
            }
        })
})

//menampilkan data berdasarkan id
router.get('/:id/editbuku', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Buku.findOne({ _id: req.params.id }, function(err, buku) {
        if (buku) {
            console.log("bukussss"+buku);
            res.render('admin/buku/edit_data', { session_store: session_store, bukus: buku })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/databuku')
        }
    })
})

router.post('/:id/editbuku', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Buku.findById(req.params.id, function(err, buku) {
            buku.kodebuku = req.body.kodebuku;
            buku.judulbuku = req.body.judulbuku;
            buku.sinopsis = req.body.sinopsis;
            buku.pengarang = req.body.pengarang;
            buku.harga = req.body.harga;

            buku.save(function(err, user) {
                if (err) {
                    req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
                } else {
                    req.flash('msg_info', 'Edit data berhasil!');
                }

                res.redirect('/databuku');

            });
        });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Buku.findById(req.params.id, function(err, buku){
        buku.remove(function(err, buku){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data buku berhasil dihapus!');
            }
            res.redirect('/databuku');
        })
    })
})
module.exports = router;
