var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection_string = 'mongodb://localhost:27017/bizhub';
var connection = mongoose.createConnection(connection_string);
 
autoIncrement.initialize(connection);

var EmployerSchema = Schema({
    name: String,
    address_line_1: String,
    address_line_2: String,
    town_or_city: String,
    county: String,
    country: String,
    postcode: String
});

EmployerSchema.set('toObject', { getters:true });

EmployerSchema.virtual('url').get(function() {
    return "/employers/" + this.id;
});

EmployerSchema.plugin(autoIncrement.plugin, 'employers');

var Employer = mongoose.model('employers', EmployerSchema);

module.exports = Employer;