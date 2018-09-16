var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

var UartAR 	= require('../models/uart.js');

route.get('/',ensureAuthenticated, function (req, res) {
    UartAR.find((err, uarts) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/uart.ejs', {uart: uarts});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    UartAR.findById(request.params.id,function (err, uart) {
        if(err) return handleError(err);
        uart.asset_tag =          request.body["inventory[]"]["0"];
        uart.model =              request.body["inventory[]"]["1"];
        uart.location =           request.body["inventory[]"]["2"];
        uart.owner =              request.body["inventory[]"]["3"];
        uart.date =               request.body["inventory[]"]["4"];

        uart.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createUart', ensureAuthenticated, function (req, res) {
    uart = new UartAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        owner: 			req.body.owner,
        date: 			req.body.date}
    )
    // Save new module to model
    console.log(uart);
    uart.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/uart.js');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    UartAR.findByIdAndRemove(request.params.id,function (err, uart) {
        if(err) return handleError(err);
        console.log(uart)
        response.send({err: 0, redirectUrl: "/inventory/uart.js"});
    })
})

route.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newUart.ejs');
})

route.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/uart/new"});
})

route.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/uart.js"});
})

module.exports = route;