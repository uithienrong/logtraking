var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var UsbAR = require('../models/usb.js');

route.get('/', ensureAuthenticated, function (req, res) {
    UsbAR.find((err, usbs) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/usb.ejs', {usb: usbs});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    UsbAR.findById(request.params.id,function (err, usb) {
        if(err) return handleError(err);
        usb.asset_tag =          request.body["inventory[]"]["0"];
        usb.model =              request.body["inventory[]"]["1"];
        usb.location =           request.body["inventory[]"]["2"];
        usb.status =             request.body["inventory[]"]["3"];
        usb.owner =              request.body["inventory[]"]["4"];
        usb.date =               request.body["inventory[]"]["5"];

        usb.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createUsb', ensureAuthenticated, function (req, res) {
    usb = new UsbAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        status:			req.body.status,
        owner: 			req.body.owner,
        date: 			req.body.date}
    )
    // Save new usb to model
    console.log(usb);
    usb.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/usb');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    UsbAR.findByIdAndRemove(request.params.id,function (err, usb) {
        if(err) return handleError(err);
        console.log(usb)
        response.send({err: 0, redirectUrl: "/inventory/usb"});
    })
})

app.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newUsb.ejs');
})

app.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/usb/new"});
})

app.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/usb"});
})


module.exports = route;