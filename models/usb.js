var mongoose = require('mongoose');
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
    id: String,
    asset_tag: String,
    model: String,
    location: String,
    status: String,
    owner: String,
    date:String
})

module.exports = mongoose.model('UsbAR', AR75xxSchema)