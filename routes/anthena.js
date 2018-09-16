var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var AnthenaAR = require('../models/anthena.js');

app.get('/', ensureAuthenticated, function (req, res) {
    AnthenaAR.find((err, anthenas) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/anthena.ejs', {anthena: anthenas});
    });
})

app.post('/update/:id', ensureAuthenticated, function(request, response){

    AnthenaAR.findById(request.params.id,function (err, anthena) {
        if(err) return handleError(err);
        anthena.asset_tag =          request.body["inventory[]"]["0"];
        anthena.model =              request.body["inventory[]"]["1"];
        anthena.location =           request.body["inventory[]"]["2"];
        anthena.owner =              request.body["inventory[]"]["3"];
        anthena.noLabel =            request.body["inventory[]"]["4"];
        anthena.date =               request.body["inventory[]"]["5"];

        anthena.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

app.post('/createAnthena', ensureAuthenticated, function (req, res) {
    anthena = new AnthenaAR({asset_tag: req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        owner: 			req.body.owner,
        noLabel:		req.body.no_label,
        date: 			req.body.date})
    // Save new module to model
    console.log(anthena);
    anthena.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/anthena');
    })
})

app.post('/delete/:id', ensureAuthenticated, function(request, response){

    AnthenaAR.findByIdAndRemove(request.params.id,function (err, anthena) {
        if(err) return handleError(err);
        response.send({err: 0, redirectUrl: "/inventory/anthena"});
    })
})

app.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newAnthena.ejs');
})

app.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/anthena/new"});
})

app.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/anthena"});
})


module.exports = route;