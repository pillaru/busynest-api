var express = require('express');
var app = express();

// routes
var timesheets = require('./routes/timesheets');
var employers = require('./routes/employers');

app.use(express.static('public'));

app.use('/timesheets', timesheets);
app.use('/employers', employers);

app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});