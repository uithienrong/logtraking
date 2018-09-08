var mongoose = require('mongoose');
var Schema = mongoose.Schema

var AR75xxSchema = new Schema({
    id: String,
    asset_tag: String,
    model: String,
    location: String,
    status: String
})

module.exports = mongoose.model('DevkitAR', AR75xxSchema)