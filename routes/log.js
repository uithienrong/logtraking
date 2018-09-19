var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var LogInfoAR = require('../models/logInfo.js');


route.get('/', ensureAuthenticated, function (request, response) {
    LogInfoAR.find({}).sort({"timeStart": -1}).exec(function (err,results) {
        console.log(results);
        response.render('log.ejs', { data: results});
    });
})

route.get('/2', ensureAuthenticated, function (request, response) {
    LogInfoAR.find({}).sort({"timeStart": -1}).exec(function (err,results) {
        console.log(results);
        response.render('log2.ejs', { data: results});
    });
})





module.exports = route;