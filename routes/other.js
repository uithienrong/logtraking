var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var OtherAR = require('../models/others.js');

route.get('/', ensureAuthenticated, function (req, res) {
    OtherAR.find((err, others) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/other.ejs', {other: others});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    OtherAR.findById(request.params.id,function (err, other) {
        if(err) return handleError(err);
        other.asset_tag =          request.body["inventory[]"]["0"];
        other.model =              request.body["inventory[]"]["1"];
        other.location =           request.body["inventory[]"]["2"];
        other.owner =              request.body["inventory[]"]["3"];
        other.date =               request.body["inventory[]"]["4"];

        other.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createOther', ensureAuthenticated,function (req, res) {
    other = new OtherAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        owner: 			req.body.owner,
        date: 			req.body.date}
    )
    // Save new other to model
    console.log(module);
    other.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/other');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    OtherAR.findByIdAndRemove(request.params.id,function (err, other) {
        if(err) return handleError(err);
        console.log(other)
        response.send({err: 0, redirectUrl: "/inventory/other"});
    })
})

app.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newOther.ejs');
})

app.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/other/new"});
})

app.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/other"});
})

module.exports = route;