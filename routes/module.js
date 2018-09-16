var express = require('express');
var route = express.Router();
var ensureAuthenticated = require('../config/authenticate');

//Load model
var ModuleAR = require('../models/module.js');


route.get('/', ensureAuthenticated, function getModule(req, res){
    ModuleAR.find((err, modules) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/module.ejs', {module: modules});
    });
})

//Update function
route.post('/module/update/:id', ensureAuthenticated, function(request, response){

    ModuleAR.findById(request.params.id,function (err, module) {
        if(err) return handleError(err);
        module.asset_tag =          request.body["inventory[]"]["0"];
        module.serial_number =      request.body["inventory[]"]["1"];
        module.model =              request.body["inventory[]"]["2"];
        module.location =           request.body["inventory[]"]["3"];
        module.remote_station =     request.body["inventory[]"]["4"];
        module.status =             request.body["inventory[]"]["5"];
        module.verification =       request.body["inventory[]"]["6"];
        module.validation =         request.body["inventory[]"]["7"];
        module.owner =              request.body["inventory[]"]["8"];
        module.date =               request.body["inventory[]"]["9"];
        module.note =               request.body["inventory[]"]["10"];

        module.save(function (err) {
            if (err) return handleError(err);
        });
    })
})

route.post('/module/createModule', ensureAuthenticated, function (req, res) {
    module = new ModuleAR({asset_tag: 		req.body.asset_tag,
        serial_number: 	req.body.serial_number,
        model: 			req.body.model,
        location: 		req.body.location,
        remote_station: req.body.remote_station,
        status: 		req.body.status,
        verification: 	req.body.verification,
        validation: 	req.body.validation,
        owner: 			req.body.owner,
        date: 			req.body.date,
        note: 			req.body.note}
    )
    // Save new module to model
    console.log(module);
    module.save(function(err){
        if (err) return handleError(err);
        res.redirect('/inventory');
    })
})

route.post('/module/delete/:id', ensureAuthenticated, function(request, response){

    ModuleAR.findByIdAndRemove(request.params.id,function (err, module) {
        if(err) return handleError(err);
        response.send({err: 0, redirectUrl: "/inventory"});
    })
})

route.get('/new', ensureAuthenticated, function (request, response) {
    response.render('inventory/new/newModule.ejs');
})

route.post('/new', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/module/new"});
})

route.post('/cancel', ensureAuthenticated, function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory"});
})

module.exports = route;