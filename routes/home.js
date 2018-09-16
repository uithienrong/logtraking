var express = require('express');
var home = express.Router();
console.log(__dirname);
var ensureAuthenticated = require('../config/authenticate');

home.get('/',ensureAuthenticated, function (req, res) {
    res.render('home')
})

module.exports = home;

