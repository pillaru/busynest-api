var mongoose = require('mongoose');

var EmployerSchema = mongoose.Schema({
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

var Employer = mongoose.model('employers', EmployerSchema);

module.exports = Employer;