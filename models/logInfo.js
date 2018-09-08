var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
	testcasename: String,
	executedBy: String,
	imeiModule: String,
	fsnModule: String,
	module: String,
	fw: String,
	iccid: String,
	status: String,
	issueID: String
})

module.exports = mongoose.model('AR75xx', AR75xxSchema)