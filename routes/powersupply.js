var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var PowerSupplyAR = require('../models/powerSupply.js');

route.get('/', ensureAuthenticated, function (req, res) {
    PowerSupplyAR.find((err, powersupplys) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/powersupply.ejs', {powerSupply: powersupplys});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    PowerSupplyAR.findById(request.params.id,function (err, powersupply) {
        if(err) return handleError(err);
        powersupply.asset_tag =          request.body["inventory[]"]["0"];
        powersupply.model =              request.body["inventory[]"]["1"];
        powersupply.location =           request.body["inventory[]"]["2"];
        powersupply.owner =              request.body["inventory[]"]["3"];
        powersupply.date =               request.body["inventory[]"]["4"];

        powersupply.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createPowersupply', ensureAuthenticated, function (req, res) {
    power = new PowerSupplyAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        owner: 			req.body.owner,
        date: 			req.body.date}
    )
    // Save new power supply to model
    console.log(power);
    power.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/powersupply.js');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    PowerSupplyAR.findByIdAndRemove(request.params.id,function (err, powersupply) {
        if(err) return handleError(err);
        console.log(powersupply)
        response.send({err: 0, redirectUrl: "/inventory/powersupply.js"});
    })
})

route.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newPowersupply.ejs');
})

route.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/powersupply/new"});
})

route.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/powersupply.js"});
})


module.exports = route;