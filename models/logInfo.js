var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
	file: String,
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

module.exports = mongoose.model('adminAR', AR75xxSchema)