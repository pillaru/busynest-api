const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator()); // this line must be immediately after bodyParser.json()!

const connectionString = 'mongodb://localhost:27017/bizhub';

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('connected to MongoDB');
});

// routes
const timesheetEntries = require('./app/routes/timesheets-entries');
const employers = require('./app/routes/organizations');

app.use('/timesheet-entries', timesheetEntries);
app.use('/organizations', employers);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
