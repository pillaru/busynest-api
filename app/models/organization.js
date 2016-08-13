var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection_string = 'mongodb://localhost:27017/bizhub';
var connection = mongoose.createConnection(connection_string);
 
autoIncrement.initialize(connection);

var OrganizationSchema = Schema({
    name: String,
}, { versionKey: false });

OrganizationSchema.set('toObject', { getters:true });

OrganizationSchema.virtual('url').get(function() {
    return "/organizations/" + this.id;
});

OrganizationSchema.virtual('offices_url').get(function() {
    return "/organizations/" + this.id + "/offices";
});

OrganizationSchema.plugin(autoIncrement.plugin, {
    model: 'organizations',
    startAt: 1
});

module.exports = mongoose.model('organizations', OrganizationSchema);
