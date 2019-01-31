var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Database = require('./database.js');
var config = require('./config.json');
var Crypto = require('./crypto.js');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

var database = new Database();
var crypto = new Crypto();

router.post('/register', function (req, res) {
    let name = req.body.username;
    let passwordData = crypto.hashPasswordNew(req.body.password);
    console.log(req.body);
    database.createUser(name, passwordData)
        .then((message) => {
            let token = jwt.sign({ id: name }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            console.log(message);
            res.status(200).send({ auth: true, token: token });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send('Unable to create user');
        });
});

router.post('/login', function (req, res) {
    let name = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    database.checkUser(name)
        .then((userObj) => {
            if (!crypto.compare(password, userObj.salt, userObj.password)) {
                res.status(400).send('wrong credentials');
                return;
            }
            let token = jwt.sign({ id: name }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).send('Wrong credentials');
        });
});

router.post('/book', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            let date = req.body.date;
            let text = req.body.text;
            let amount = req.body.amount;
            let type = req.body.type;
            database.book(decoded.id, date, text, amount, type)
                .then((result) => {
                    res.status(200).send(JSON.stringify('Booking received'));
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to compute booking');
                });
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

router.post('/getBookings', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            let datefrom = req.body.from;
            let dateto = req.body.to;
            let type = req.body.type;
            database.getBookings(decoded.id, datefrom, dateto, type)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to get bookings');
                });
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

router.get('/get/:id', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            let id = req.params.id;
            if(id) {
                database.getBooking(id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to get booking');
                });
            }
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

router.get('/balance', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            database.getBalance(decoded.id)
                .then((result) => {
                    res.status(200).send(result);
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to get balance');
                });
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

router.put('/update', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            let id = req.body.id;
            let date = req.body.date;
            let text = req.body.text;
            let amount = req.body.amount;
            let type = req.body.type;
            database.updateBooking(decoded.id, id, date, text, amount, type)
                .then((result) => {
                    res.status(200).send(JSON.stringify('Booking updated.'));
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to update booking');
                });
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

router.delete('/delete/:id', function (req, res) {
    verifyToken(req)
        .then(decoded => {
            let id = req.params.id;
            database.deleteBooking(decoded.id, id)
                .then((result) => {
                    res.status(200).send(JSON.stringify('Booking deleted.'));
                })
                .catch((err) => {
                    console.log("error " + err);
                    res.status(500).send('Unable to delete booking');
                });
        })
        .catch(reason => {
            console.log(reason);
            res.status(401).send({ auth: false, message: reason });
            return;
        })
});

function verifyToken(req) {
    var token = req.headers['x-access-token'];
    return new Promise((resolve, reject) => {
        if (!token) {
            console.log('no token provided');
            reject('Not authenticated');
            return;
        }
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.error(err);
                reject('Not authenticated');
                return;
            }
            resolve(decoded);
        });
    });
}

module.exports = router;
