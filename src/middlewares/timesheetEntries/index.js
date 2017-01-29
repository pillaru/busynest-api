const express = require('express');
const stormpath = require('express-stormpath');
const handler = require('./handler');

const app = express();

const path = '/timesheet-entries';

app.get(path, stormpath.apiAuthenticationRequired, stormpath.getUser, handler.get);
app.post(path, stormpath.apiAuthenticationRequired, stormpath.getUser, handler.create);
app.get(`${path}/:id`, stormpath.apiAuthenticationRequired, stormpath.getUser, handler.getById);
app.delete(`${path}:/id`, stormpath.apiAuthenticationRequired, stormpath.getUser, handler.remove);

module.exports = app;
