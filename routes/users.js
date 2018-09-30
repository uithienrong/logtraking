var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var ensureAuthenticated = require('../config/authenticate');

//Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function (req, res) {
    res.render('register');
});

//register process
router.post('/register', function (req, res) {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'User Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    let errors =req.validationErrors();
    if(errors){
        for(var i in errors){
            req.flash('error', errors[i].msg)
        }
        res.render('register');
    } else {
        let newUser = new User({
            name:name,
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

//Login form
router.get('/login', function (req, res) {
    res.render('login')
})

//Login process
router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    req.checkBody('username', 'User Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors =req.validationErrors();
    if(errors){
        for(var i in errors){
            req.flash('error', errors[i].msg)
        }
        res.render('login');
    } else {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');
});

router.get('/management', ensureAuthenticated, function (req, res) {
    User.find((err, users) => {
        if (err) return res.status(500).send(err)
        return res.render('userManagement.ejs', {users: users});
    });
});


router.get('/chart', function (req, res) {
    res.render('charts/example.ejs')
})

router.post('/delete', function (req, res) {
    User.findByIdAndRemove(req.body.id, function (err, user) {
        if(err) return handleError(err);
        console.log(user);
        req.flash('success', 'Delete user successful!');
        return res.redirect('/users/management');
    })

});


module.exports = router;