const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Database = require('./database.js');

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var database = new Database();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/register', function (req, res) {
  let name = req.body.username;
  let password = req.body.password;
  console.log(req.body);
  database.createUser(name, password)
    .then((message) => {
      console.log(message);
      res.send(message);
    })
    .catch((error) => {
      console.error(error);
      res.send(error);
    });
});

app.post('/login', function (req, res) {
  let name = req.body.username;
  let password = req.body.password;
  console.log(req.body);
  database.checkUser(name, password)
    .then((message) => {
      database.generateToken(name)
        .then((result) => {
          res.send(result.token);
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    })
    .catch((error) => {
      console.error(error);
      res.send(error);
    });
});

app.post('/book', function (req, res) {
  let token = req.body.token;
  let date = req.body.date;
  let text = req.body.text;
  let amount = req.body.amount;
  let type = req.body.type;
  database.book(token, date, text, amount, type)
    .then((result) => {
      console.log("no error");
      res.send(result);
    })
    .catch((err) => {
      console.log("error " + err);
      res.send(err);
    });
});

app.listen(3000, function () {
  console.log('Spendings app listening on port 3000!');
});