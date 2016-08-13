var express = require('express');
var app = express();
var mongoose = require('mongoose');

// routes
var timesheets = require('./routes/timesheets');
var employers = require('./routes/employers');

app.use(express.static('public'));

var connection_string = 'mongodb://localhost:27017/bizhub';

mongoose.connect(connection_string);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('connected to MongoDB');
});

app.use('/timesheets', timesheets);
app.use('/employers', employers);

app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});