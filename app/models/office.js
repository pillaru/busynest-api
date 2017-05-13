const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./../../config');

// Use native promises
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const connection = mongoose.createConnection(config.mongodb.connectionString);

autoIncrement.initialize(connection);

const OfficeSchema = Schema({
    addressLine1: String,
    addressLine2: String,
    townOrCity: String,
    county: String,
    country: String,
    postcode: String,
    organization: { type: Number, ref: 'organizations' }
}, { versionKey: false });

OfficeSchema.set('toObject', { getters: true, virtuals: true });

OfficeSchema.plugin(autoIncrement.plugin, {
    model: 'offices',
    startAt: 1
});

module.exports = mongoose.model('offices', OfficeSchema);
