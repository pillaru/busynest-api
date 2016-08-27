const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var config = require('./../../config');

const Schema = mongoose.Schema;

const connection = mongoose.createConnection(config.mongodb.connectionString);

autoIncrement.initialize(connection);

const OrganizationSchema = Schema({
    name: String
}, { versionKey: false });

OrganizationSchema.set('toObject', { getters: true, virtuals: true });

OrganizationSchema.plugin(autoIncrement.plugin, {
    model: 'organizations',
    startAt: 1
});

module.exports = mongoose.model('organizations', OrganizationSchema);
