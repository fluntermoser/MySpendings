var express = require('express');
var routing = require('./router.js');

var app = express();
app.use('/', routing);
app.listen(3000, function () {
  console.log('Spendings app listening on port 3000!');
});