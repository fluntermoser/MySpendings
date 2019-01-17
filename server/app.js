var express = require('express');
var authentication = require('./auth.js');

var app = express();
app.use('/', authentication);
app.listen(3000, function () {
  console.log('Spendings app listening on port 3000!');
});