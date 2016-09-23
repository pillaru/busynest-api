const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
var config = require('./config');
var stormpath = require('express-stormpath');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator()); // this line must be immediately after bodyParser.json()!
app.use(stormpath.init(app, {
    web: {
        produces: ['application/json']
    }
}))

mongoose.connect(config.mongodb.connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('connected to MongoDB');
});

// routes
const timesheetEntries = require('./app/routes/timesheets-entries');
const employers = require('./app/routes/organizations');
const offices = require('./app/routes/offices.route');

app.use(cors());

app.use('/timesheet-entries', stormpath.apiAuthenticationRequired, timesheetEntries);
app.use('/organizations', employers);
app.use('/offices', offices);

const port = process.env.PORT || 5000;

app.on('stormpath.ready', function () {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    });
});
