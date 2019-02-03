/**
 * app that listens to requests from any client
 * users can be created
 * a user can log in
 * logged in users can
 * - add new spendings
 * - delte spendings
 * - update spendings
 * - get a balance
 * - list all spendings
 * - filter spendings
 * @module
 */
var express = require('express');
var routing = require('./router.js');
var config = require('./config.json');

var app = express();
app.use('/', routing);
app.listen(config.server.port, function () {
  console.log(`Spendings app listening on port ${config.server.port}!`);
});