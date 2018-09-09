const express = require('express');
const router = express.Router();
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var session = require('express-session');
router.use(flash());
router.use(session({
    secret: 'woot',
    resave: false,
    saveUninitialized: false}));

//Bring in User Model
let User = require('../models/user');
router.use(expressValidator());

router.get('/register', function (req, res) {
    res.render('register', {errors: null});
})

//register process
router.post('/register', function (req, res) {
    const name = req.body.name;
    const ip = req.body.ip;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('ip', 'IP is required').notEmpty();
    req.checkBody('username', 'User Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    let errors =req.validationErrors();
    if(errors){
        res.render('register', {errors:errors});
    } else {
        let newUser = new User({
            name:name,
            ip:ip,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if(err){
                        console.log(err);
                        return
                    } else {
                        req.flash('success', 'You are registered and can login');
                        res.redirect('/users/login');
                    }
                })
            });
        });
    }

})

router.get('/login', function (req, res) {
    res.render('login', {message: req.flash('success')})
})

module.exports = router;