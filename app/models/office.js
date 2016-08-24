const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const connectionString = 'mongodb://localhost:27017/bizhub';
const connection = mongoose.createConnection(connectionString);

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

OfficeSchema.virtual('url').get(function() {
  return `/offices/${this._id}`;
});

OfficeSchema.plugin(autoIncrement.plugin, {
    model: 'offices',
    startAt: 1
});

module.exports = mongoose.model('offices', OfficeSchema);
