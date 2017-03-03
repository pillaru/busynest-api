const express = require('express');
const morgan = require('morgan');
const logger = require('../../../logger/loggerFactory');

const app = express();

app.use(morgan('dev', { stream: logger.stream }));

module.exports = app;
