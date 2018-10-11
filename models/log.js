var mongoose = require('mongoose')
var Schema = mongoose.Schema

var logSchema = new Schema({
    user: String,
    client: String,
    duration: String,
    testcase: String,
    startTime: String,
    imei: String,
    ccid: String,
    product: String,
    serial: String
})

module.exports = mongoose.model('run_time', logSchema)