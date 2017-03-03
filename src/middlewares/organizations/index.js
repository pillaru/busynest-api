const express = require('express');
const handler = require('./handler');

const app = express();

const path = '/organizations';

app.get(path, handler.get);
app.post(path, handler.create);
app.get(`${path}/:id`, handler.getById);
app.get(`${path}/:id/offices`, handler.getOffices);

module.exports = app;
