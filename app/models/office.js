var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection_string = 'mongodb://localhost:27017/bizhub';
var connection = mongoose.createConnection(connection_string);
 
autoIncrement.initialize(connection);

var OfficeSchema = Schema({
    address_line_1: String,
    address_line_2: String,
    town_or_city: String,
    county: String,
    country: String,
    postcode: String,
    organization: { type: Number, ref: 'organizations'}
}, { versionKey: false });

OfficeSchema.set('toObject', { getters:true });

OfficeSchema.virtual('url').get(function() {
    return "/organizations/" + this.organization._id + "/offices/" + this._id;
});

OfficeSchema.plugin(autoIncrement.plugin, {
    model: 'offices',
    startAt: 1
});

module.exports = mongoose.model('offices', OfficeSchema);