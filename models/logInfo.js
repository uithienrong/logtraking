var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
	testcasename: String,
	executedBy: String,
    timeStart: String,
    localIP: String,
    imei: String,
    fsn: String,
    module: String,
    revision: String,
    fw: String,
    iccid: String,
    status: String
})

module.exports = mongoose.model('AR75xx', AR75xxSchema)