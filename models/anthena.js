var mongoose = require('mongoose');
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
    id: String,
    asset_tag: String,
    model: String,
    location: String,
    owner: String,
    noLabel: String,
    date:String
})

module.exports = mongoose.model('AthenaAR', AR75xxSchema)