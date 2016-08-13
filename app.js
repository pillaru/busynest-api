var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator()); // this line must be immediately after bodyParser.json()!

var connection_string = 'mongodb://localhost:27017/bizhub';

mongoose.connect(connection_string);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('connected to MongoDB');
});

// routes
var timesheetEntries = require('./app/routes/timesheets-entries');
var employers = require('./app/routes/organizations');

app.use('/timesheet-entries', timesheetEntries);
app.use('/organizations', employers);

app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});