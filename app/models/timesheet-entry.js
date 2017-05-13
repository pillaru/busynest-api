const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./../../config');

// Use native promises
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const connection = mongoose.createConnection(config.mongodb.connectionString);

autoIncrement.initialize(connection);

const TimesheetEntrySchema = Schema({
    start: Date,
    end: Date,
    break: Number,
    ratePerHour: Number,
    employerOffice: { type: Number, ref: 'offices' },
    userId: String
}, { versionKey: false });


TimesheetEntrySchema.plugin(autoIncrement.plugin, {
    model: 'timesheet-entries',
    startAt: 1
});

TimesheetEntrySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('timesheet-entries', TimesheetEntrySchema);
