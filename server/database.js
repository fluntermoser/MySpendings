const mysql = require('mysql');
const fs = require('fs');
var con;
class Database {
    constructor() {
        let p = this.connectDatabase();
        p.then(message => {
            console.log(message);
            con.query('USE myspendings;', function (err) {
                if (err) {
                    console.error(err);
                }
            });
            //this.initDefaultSchema();
        }).catch(reason => {
            console.err(reason);
        })
    }

    connectDatabase() {
        con = mysql.createConnection({
            host: "localhost",
            user: "myspendings",
            password: "passwort1234"
        });
        let p = new Promise((resolve, reject) => {
            con.connect(function (err) {
                if (err) {
                    reject("connection to db failed");
                    return;
                }
                resolve("connection to db successfull");
            });
        });
        return p;
    }

    initDefaultSchema() {
        fs.readFile('defaultschema.sql', 'utf8', function (err3, data) {
            if (err3) throw err3;
            console.log('OK: ' + data);
            con.query(data, function (err2, result) {
                if (err2) {
                    con.rollback(function () {
                        throw err2;
                    });
                }
                con.commit(function (err1) {
                    if (err1) {
                        con.rollback(function () {
                            throw err1;
                        });
                    }
                    console.log('Transaction Complete.');
                });
                console.log("Default Database Schema created");
            });
        });
    }

    createUser(username, password) {
        return new Promise((resolve, reject) => {
            con.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('creating user failed');
                    return;
                }
                resolve('user was successfully created');
            });
        });
    }

    checkUser(username, password) {
        return new Promise((resolve, reject) => {
            con.query('SELECT COUNT(*) as count FROM user WHERE username=? AND password=?', [username, password], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error checking user');
                    return;
                }
                if (results[0].count > 0) {
                    resolve('correct credentials');
                    return;
                }
                reject('wrong username or password');
            });
        });
    }

    generateToken(username) {
        let highSecurityToken = Math.random().toString(36).substr(2);
        return new Promise((resolve, reject) => {
            con.query('UPDATE user SET token =? WHERE username =?', [highSecurityToken, username], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error writing token');
                }
                resolve({ token: highSecurityToken, message: 'token was successfully generated' });
            });
        });
    }

    checkAuthorization(token) {
        return new Promise((resolve, reject) => {
            con.query('SELECT id FROM user WHERE token=?', [token], (err, results) => {
                if (err || results.length === 0) {
                    console.error(err);
                    reject('user not logged in');
                    return;
                }
                resolve(results[0].id);
            });
        });
    }

    book(token, date, text, amount, type) {
        return new Promise((resolve, reject) => {
            this.checkAuthorization(token)
                .then((id) => {
                    con.query(`INSERT INTO spendings 
                            (date, text, type, amount, user_id) VALUES (?, ?, ?, ?, ?)`,
                        [date, text, type, amount, id],
                        (err, results) => {
                            if (err) {
                                console.error(err);
                                reject('could not persist data');
                                return;
                            }
                            resolve('booking was successfull');
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getBookings(token) {
        return new Promise((resolve, reject) => {
            this.checkAuthorization(token)
                .then((id) => {
                    
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    getBookings(token, type) {}
    getBookings(token, dateFrom, dateTo) {}
    getBookings(token, dateFrom, dateTo, type) {}
    
}

module.exports = Database;