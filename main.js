var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
const config = require('./config/database');
var app = express();

//session for flash
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

//Passport config
require('./config/passport')(passport);
//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//for mongoose module
mongoose.connect(config.database,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//load Excel file
var xlsx = require('node-xlsx');
var arrExcel = xlsx.parse(__dirname + '/AR_INVENTORY.xlsx');

//set view
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//load static file
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'script')));
app.use(express.static(path.join(__dirname, 'image')));

//Express Messages Middleware
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
})

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

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
	//uart.js save
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

//define route
var users = require('./routes/users');
var home_route = require('./routes/home');
var log = require('./routes/log');
var inventory = require('./routes/module');
var uart = require('./routes/uart');
var devkit = require('./routes/devkit');
var usb = require('./routes/usb');
var powersupply = require('./routes/powersupply');
var sim = require('./routes/sim');
var anthena = require('./routes/anthena');
var other = require('./routes/other');
app.use('/', home_route);
app.use('/users', users);
app.use('/log', log);
app.use('/inventory', inventory);
app.use('/inventory/uart', uart);
app.use('/inventory/devkit', devkit);
app.use('/inventory/usb', usb);
app.use('/inventory/powersupply', powersupply);
app.use('/inventory/sim', sim);
app.use('/inventory/anthena', anthena);
app.use('/inventory/other', other);


app.listen(8080,'0.0.0.0', function () {
   console.log('Listen port 8080');
});
