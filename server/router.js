/**
 * Module that manages all routes that are available 
 */

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
/**
 * register route manages new users and returns a jwt if login was successfull
 * @method POST
 * @param username - request body param
 * @param password - request body param
 */
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

/**
 * login route manages new logins and returns a jwt if login was successfull
 * @method POST
 * @param username - request body param
 * @param password - request body param
 */
router.post('/login', function (req, res) {
    let name = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    database.checkUser(name)
        .then((userObj) => {
            if (!crypto.compare(password, userObj.salt, userObj.password)) {
                res.status(400).send('Wrong credentials');
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

/**
 * book route manages new bookings
 * @method POST
 * @param data -request body param
 * @param text -request body param
 * @param amount -request body param
 * @param type -request body param
 */
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

/**
 * getBookings rout loads all bookings for a user
 * @method POST
 * @param from -request body param
 * @param to -request body param
 * @param type -request body param
 */
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

/**
 * get route gets a single booking by its id
 * @method GET
 * @param id - url parameter
 */
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

/**
 * balance route gets the balance for a user
 * @method GET
 */
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

/**
 * update route updates a booking with the given values
 * @method PUT
 * @param id -request body param
 * @param data -request body param
 * @param text -request body param
 * @param amount -request body param
 * @param type -request body param
 */
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

/**
 * delete route deletes a booking by its id
 * @method DELETE
 * @param id - url parameter
 */
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

/**
 * verifies that the request that was sent has a valid token from an authenticated user
 * @function
 * @param {object} req -request object from request
 */
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
