var express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
var home = express.Router();

home.use(flash());
home.use(session({
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));

home.get('/', function (req, res) {
    res.render('home')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error','Please login');
        res.redirect('/users/login');
    }
}

module.exports = home;

