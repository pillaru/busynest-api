const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const connectionString = 'mongodb://localhost:27017/bizhub';
const connection = mongoose.createConnection(connectionString);

autoIncrement.initialize(connection);

const TimesheetEntrySchema = Schema({
    start: Date,
    end: Date,
    break: Number,
    rate_per_hour: Number,
    employer_office: { type: Number, ref: 'offices' }
}, { versionKey: false });


TimesheetEntrySchema.plugin(autoIncrement.plugin, {
    model: 'timesheet-entries',
    startAt: 1
});

TimesheetEntrySchema.set('toObject', { getters: true, virtuals: true });

TimesheetEntrySchema.virtual('url').get(function() {
  return `/timesheet-entries/${this._id}`;
});

module.exports = mongoose.model('timesheet-entries', TimesheetEntrySchema);
