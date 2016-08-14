const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const connectionString = 'mongodb://localhost:27017/bizhub';
const connection = mongoose.createConnection(connectionString);

autoIncrement.initialize(connection);

const OfficeSchema = Schema({
    address_line_1: String,
    address_line_2: String,
    town_or_city: String,
    county: String,
    country: String,
    postcode: String,
    organization: { type: Number, ref: 'organizations' }
}, { versionKey: false });

OfficeSchema.set('toObject', { getters: true });

OfficeSchema.virtual('url').get(() =>
    `/organizations/${this.organization._id}/offices/${this._id}`);

OfficeSchema.plugin(autoIncrement.plugin, {
    model: 'offices',
    startAt: 1
});

module.exports = mongoose.model('offices', OfficeSchema);
