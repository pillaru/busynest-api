var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection_string = 'mongodb://localhost:27017/bizhub';
var connection = mongoose.createConnection(connection_string);
 
autoIncrement.initialize(connection);

var TimesheetEntrySchema = Schema({
    start: Date,
    end: Date,
    break: Number,
    rate_per_hour: Number
}, { versionKey: false });

TimesheetEntrySchema.set('toObject', { getters:true });

TimesheetEntrySchema.virtual('url').get(function() {
    return "/timesheet-entries/" + this._id;
});

TimesheetEntrySchema.plugin(autoIncrement.plugin, {
    model: 'timesheet-entries',
    startAt: 1
});

module.exports = mongoose.model('timesheet-entries', TimesheetEntrySchema);