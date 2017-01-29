const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const stormpath = require('express-stormpath');
const loggerMiddleware = require('./src/middlewares/logger');
const logger = require('./logger/loggerFactory');

const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(express.static('public'));
app.use(stormpath.init(app, {
    debug: 'info',
    logger,
    web: {
        produces: ['application/json']
    }
}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator()); // this line must be immediately after bodyParser.json()!

mongoose.set('debug', true);
mongoose.connect(config.mongodb.connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    logger.info('connected to MongoDB');
});

// routes
const timesheetEntries = require('./src/middlewares/timesheetEntries');
const employers = require('./app/routes/organizations');
const offices = require('./app/routes/offices.route');

app.use(timesheetEntries);
app.use('/organizations', employers);
app.use('/offices', offices);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    logger.info(`app listening on port ${port}!`);
});

app.on('stormpath.ready', () => {
    logger.info('Stormpath Ready!');
});
