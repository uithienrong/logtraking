//input library
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
var mongo = require('mongodb');
var mongoose = require('mongoose');

//config database

//for mongoDB module
var url = 'mongodb://localhost:27017/informationAR75xx';

//for mongoose module
var mongoDB = 'mongodb://127.0.0.1/informationAR75xx';
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Load table in database
var ModuleAR 		= require('./models/module.js');
var UartAR 			= require('./models/uart.js');
var DevkitAR 		= require('./models/devkit.js');
var UsbAR 			= require('./models/usb.js');
var PowerSupplyAR 	= require('./models/powerSupply.js');
var SimAR 			= require('./models/sim.js');
var AnthenaAR 		= require('./models/anthena.js');
var OtherAR 		= require('./models/others.js');


//load Excel file
var xlsx = require('node-xlsx');
var arrExcel = xlsx.parse(__dirname + '/AR_INVENTORY.xlsx');

//set view
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//load static file
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'script')));
app.use(express.static(path.join(__dirname, 'image')));


//functions
app.get('/home', function (request, response) {

	mongo.connect(url, function (err, client) {
		var db = client.db('informationAR75xx');
		var data = db.collection('adminAR').find({}).sort({"timeStart": -1}).toArray(function (err,results) {
			console.log(results);
			response.render('home.ejs', { data: results });
		});
	})
})

app.get('/inventory', function getModule(req, res){
    ModuleAR.find((err, modules) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/module.ejs', {module: modules});
    });
})

app.get('/inventory/uart', function (req, res) {
    UartAR.find((err, uarts) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/uart.ejs', {uart: uarts});
    });
})

app.get('/inventory/usb', function (req, res) {
    UsbAR.find((err, usbs) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/usb.ejs', {usb: usbs});
    });
})

app.get('/inventory/devkit', function (req, res) {
    DevkitAR.find((err, devkits) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/devkit.ejs', {devkit: devkits});
    });
})

app.get('/inventory/powersupply', function (req, res) {
    PowerSupplyAR.find((err, powersupplys) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/powersupply.ejs', {powerSupply: powersupplys});
    });
})

app.get('/inventory/sim', function (req, res) {
    SimAR.find((err, sims) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/sim.ejs', {sim: sims});
    });
})

app.get('/inventory/anthena', function (req, res) {
    AnthenaAR.find((err, anthenas) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/anthena.ejs', {anthena: anthenas});
    });
})

app.get('/inventory/other', function (req, res) {
    OtherAR.find((err, others) => {
        if (err) return res.status(500).send(err)
        return res.render('inventory/other.ejs', {other: others});
    });
})

//Upload function
app.post('/inventory/module/upload', function(request, response){
	var arrExcel = xlsx.parse(__dirname + '/AR_INVENTORY.xlsx');
	var moduleSheet 		= arrExcel[0];
    var uartSheet 			= arrExcel[1];
    var devkitSheet 		= arrExcel[2];
    var usbSheet 			= arrExcel[3];
    var powerSupplySheet 	= arrExcel[4];
    var simSheet 			= arrExcel[5];
    var anthenaSheet 		= arrExcel[6];
    var otherSheet 			= arrExcel[7];

	var columns = moduleSheet.data;
	for(var i = 1; i < columns.length; i++){
		module = new ModuleAR({asset_tag: 		columns[i][0], 
								serial_number: 	columns[i][1], 
								model: 			columns[i][2], 
								location: 		columns[i][3], 
								remote_station: columns[i][4], 
								status: 		columns[i][5], 
								verification: 	columns[i][6], 
								validation: 	columns[i][7],
								owner: 			columns[i][8],
								date: 			columns[i][9],
								note: 			columns[i][10]}
							)
		// Save new module to model
		console.log(module);
		module.save(function(err){
			if (err) return handleError(err);
		})
	}
	//uart save
    var columns = uartSheet.data;
    for(var i = 1; i < columns.length; i++){
        uart = new UartAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            owner: 			columns[i][3],
            date: 			columns[i][4]}
        )
        // Save new module to model
        console.log(uart);
        uart.save(function(err){
            if (err) return handleError(err);
        })
    }
    //devkit save
    var columns = devkitSheet.data;
    for(var i = 1; i < columns.length; i++){
        devkit = new DevkitAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            status: 		columns[i][3]}
        )
        // Save new module to model
        console.log(devkit);
        devkit.save(function(err){
            if (err) return handleError(err);
        })
    }
    //usb save
    var columns = usbSheet.data;
    for(var i = 1; i < columns.length; i++){
        usb = new UsbAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
			status:			columns[i][3],
            owner: 			columns[i][4],
            date: 			columns[i][5]}
        )
        // Save new module to model
        console.log(usb);
        usb.save(function(err){
            if (err) return handleError(err);
        })
    }
    //power supply save
    var columns = powerSupplySheet.data;
    for(var i = 1; i < columns.length; i++){
        power = new PowerSupplyAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            owner: 			columns[i][3],
            date: 			columns[i][4]}
        )
        // Save new module to model
        console.log(power);
        power.save(function(err){
            if (err) return handleError(err);
        })
    }
    //power sim save
    var columns = simSheet.data;
    for(var i = 1; i < columns.length; i++){
        sim = new SimAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            status: 		columns[i][3],
            owner: 			columns[i][4],
            date: 			columns[i][5],
            note: 			columns[i][6],
            subcriber: 		columns[i][7]}
        )
        // Save new module to model
        console.log(sim);
        sim.save(function(err){
            if (err) return handleError(err);
        })
    }
    //anthena save
    var columns = anthenaSheet.data;
    for(var i = 1; i < columns.length; i++){
        anthena = new AnthenaAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            owner: 			columns[i][3],
            noLabel:		columns[i][4],
            date: 			columns[i][5]}
        )
        // Save new module to model
        console.log(anthena);
        anthena.save(function(err){
            if (err) return handleError(err);
        })
    }
    //other save
    var columns = otherSheet.data;
    for(var i = 1; i < columns.length; i++){
        other = new OtherAR({asset_tag: 		columns[i][0],
            model: 			columns[i][1],
            location: 		columns[i][2],
            owner: 			columns[i][3],
            date: 			columns[i][4]}
        )
        // Save new module to model
        console.log(other);
        other.save(function(err){
            if (err) return handleError(err);
        })
    }
})


//Update function
app.post('/inventory/module/update/:id', function(request, response){

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

app.post('/inventory/uart/update/:id', function(request, response){

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

app.post('/inventory/devkit/update/:id', function(request, response){

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

app.post('/inventory/usb/update/:id', function(request, response){

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

app.post('/inventory/powersupply/update/:id', function(request, response){

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

app.post('/inventory/sim/update/:id', function(request, response){

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

app.post('/inventory/anthena/update/:id', function(request, response){

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

app.post('/inventory/other/update/:id', function(request, response){

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

//Add new function

app.post('/inventory/anthena/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/anthena/new"});
})

app.post('/inventory/devkit/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/devkit/new"});
})

app.post('/inventory/module/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/module/new"});
})

app.post('/inventory/other/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/other/new"});
})

app.post('/inventory/powersupply/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/powersupply/new"});
})

app.post('/inventory/sim/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/sim/new"});
})

app.post('/inventory/uart/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/uart/new"});
})

app.post('/inventory/usb/new', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/usb/new"});
})

app.get('/inventory/anthena/new', function (request, response) {
    response.render('inventory/new/newAnthena.ejs');
})

app.get('/inventory/devkit/new', function (request, response) {
    response.render('inventory/new/newDevkit.ejs');
})

app.get('/inventory/module/new', function (request, response) {
    response.render('inventory/new/newModule.ejs');
})

app.get('/inventory/other/new', function (request, response) {
    response.render('inventory/new/newOther.ejs');
})

app.get('/inventory/powersupply/new', function (request, response) {
    response.render('inventory/new/newPowersupply.ejs');
})

app.get('/inventory/sim/new', function (request, response) {
    response.render('inventory/new/newSim.ejs');
})

app.get('/inventory/uart/new', function (request, response) {
    response.render('inventory/new/newUart.ejs');
})

app.get('/inventory/usb/new', function (request, response) {
    response.render('inventory/new/newUsb.ejs');
})

//save new function
app.post('/inventory/anthena/createAnthena', function (req, res) {
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

app.post('/inventory/module/createModule', function (req, res) {
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

app.post('/inventory/other/createOther', function (req, res) {
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

app.post('/inventory/uart/createUart', function (req, res) {
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
        res.redirect('/inventory/uart');
    })
})

app.post('/inventory/devkit/createDevkit', function (req, res) {
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

app.post('/inventory/usb/createUsb', function (req, res) {
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

app.post('/inventory/powersupply/createPowersupply', function (req, res) {
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
        res.redirect('/inventory/powersupply');
    })
})

app.post('/inventory/sim/createSim', function (req, res) {
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

//cancel button
app.post('/inventory/anthena/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/anthena"});
})

app.post('/inventory/module/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory"});
})

app.post('/inventory/uart/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/uart"});
})

app.post('/inventory/devkit/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/devkit"});
})

app.post('/inventory/usb/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/usb"});
})

app.post('/inventory/powersupply/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/powersupply"});
})

app.post('/inventory/sim/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/sim"});
})

app.post('/inventory/other/cancel', function (request, response) {
    response.send({err: 0, redirectUrl: "/inventory/other"});
})

//delete function
app.post('/inventory/anthena/delete/:id', function(request, response){

    AnthenaAR.findByIdAndRemove(request.params.id,function (err, anthena) {
        if(err) return handleError(err);
        response.send({err: 0, redirectUrl: "/inventory/anthena"});
    })
})

app.post('/inventory/module/delete/:id', function(request, response){

    ModuleAR.findByIdAndRemove(request.params.id,function (err, module) {
        if(err) return handleError(err);
        response.send({err: 0, redirectUrl: "/inventory"});
    })
})

app.post('/inventory/uart/delete/:id', function(request, response){
    UartAR.findByIdAndRemove(request.params.id,function (err, uart) {
        if(err) return handleError(err);
        console.log(uart)
        response.send({err: 0, redirectUrl: "/inventory/uart"});
    })
})

app.post('/inventory/devkit/delete/:id', function(request, response){
    DevkitAR.findByIdAndRemove(request.params.id,function (err, devkit) {
        if(err) return handleError(err);
        console.log(devkit)
        response.send({err: 0, redirectUrl: "/inventory/devkit"});
    })
})

app.post('/inventory/usb/delete/:id', function(request, response){
    UsbAR.findByIdAndRemove(request.params.id,function (err, usb) {
        if(err) return handleError(err);
        console.log(usb)
        response.send({err: 0, redirectUrl: "/inventory/usb"});
    })
})

app.post('/inventory/powersupply/delete/:id', function(request, response){
    PowerSupplyAR.findByIdAndRemove(request.params.id,function (err, powersupply) {
        if(err) return handleError(err);
        console.log(powersupply)
        response.send({err: 0, redirectUrl: "/inventory/powersupply"});
    })
})

app.post('/inventory/sim/delete/:id', function(request, response){
    SimAR.findByIdAndRemove(request.params.id,function (err, sim) {
        if(err) return handleError(err);
        console.log(sim)
        response.send({err: 0, redirectUrl: "/inventory/sim"});
    })
})

app.post('/inventory/other/delete/:id', function(request, response){
    OtherAR.findByIdAndRemove(request.params.id,function (err, other) {
        if(err) return handleError(err);
        console.log(other)
        response.send({err: 0, redirectUrl: "/inventory/other"});
    })
})

app.listen(8080,'0.0.0.0', function () {
   console.log('Listen port 8080');
});
