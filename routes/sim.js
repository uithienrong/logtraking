var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var SimAR = require('../models/sim.js');

route.get('/', ensureAuthenticated, function (req, res) {
    SimAR.find((err, sims) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/sim.ejs', {sim: sims});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    SimAR.findById(request.params.id,function (err, sim) {
        if(err) return handleError(err);
        sim.asset_tag =          request.body["inventory[]"]["0"];
        sim.model =              request.body["inventory[]"]["1"];
        sim.location =           request.body["inventory[]"]["2"];
        sim.status =             request.body["inventory[]"]["3"];
        sim.owner =              request.body["inventory[]"]["4"];
        sim.date =               request.body["inventory[]"]["5"];
        sim.note =               request.body["inventory[]"]["6"];
        sim.subcriber =          request.body["inventory[]"]["7"];

        sim.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createSim', ensureAuthenticated, function (req, res) {
    sim = new SimAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        status: 		req.body.status,
        owner: 			req.body.owner,
        date: 			req.body.date,
        note: 			req.body.note,
        subcriber: 		req.body.subcriber}
    )
    // Save new sim to model
    console.log(sim);
    sim.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/sim');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    SimAR.findByIdAndRemove(request.params.id,function (err, sim) {
        if(err) return handleError(err);
        console.log(sim)
        response.send({err: 0, redirectUrl: "/inventory/sim"});
    })
})

app.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newSim.ejs');
})

app.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/sim/new"});
})

app.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/sim"});
})

module.exports = route;