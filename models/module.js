var mongoose = require('mongoose');
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
	id: String,
	asset_tag: String,
	serial_number: String,
	model: String,
	location: String,
	remote_station: String,
	status: String,
	verification: String,
	validation: String,
	owner: String,
	date:String,
	note: String
})

module.exports = mongoose.model('ModuleAR', AR75xxSchema)