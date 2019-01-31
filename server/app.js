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

var app = express();
app.use('/', routing);
app.listen(3000, function () {
  console.log('Spendings app listening on port 3000!');
});