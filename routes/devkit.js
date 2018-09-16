var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var DevkitAR = require('../models/devkit.js');

route.get('/', ensureAuthenticated, function (req, res) {
    DevkitAR.find((err, devkits) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/devkit.ejs', {devkit: devkits});
    });
})

route.post('/update/:id', ensureAuthenticated, function(request, response){

    DevkitAR.findById(request.params.id,function (err, devkit) {
        if(err) return handleError(err);
        devkit.asset_tag =          request.body["inventory[]"]["0"];
        devkit.model =              request.body["inventory[]"]["1"];
        devkit.location =           request.body["inventory[]"]["2"];
        devkit.status =             request.body["inventory[]"]["3"];

        devkit.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/createDevkit', ensureAuthenticated,function (req, res) {
    devkit = new DevkitAR({asset_tag: 		req.body.asset_tag,
        model: 			req.body.model,
        location: 		req.body.location,
        status: 		req.body.status}
    )
    // Save new module to model
    console.log(devkit);
    devkit.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory/devkit');
    })
})

route.post('/delete/:id', ensureAuthenticated, function(request, response){
    DevkitAR.findByIdAndRemove(request.params.id,function (err, devkit) {
        if(err) return handleError(err);
        console.log(devkit)
        response.send({err: 0, redirectUrl: "/inventory/devkit"});
    })
})

app.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newDevkit.ejs');
})

app.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/devkit/new"});
})

app.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/devkit"});
})

module.exports = route;