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
        });
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

    createUser(username, passwordData) {
        return new Promise((resolve, reject) => {
            con.query('INSERT INTO user (username, password, salt) VALUES (?, ?, ?)', [username, passwordData.passwordHash, passwordData.salt], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('creating user failed');
                    return;
                }
                resolve('user was successfully created');
            });
        });
    }

    checkUser(username) {
        return new Promise((resolve, reject) => {
            con.query('SELECT password, salt FROM user WHERE username=? LIMIT 1', [username], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error checking user');
                    return;
                }
                if (results[0]) {
                    resolve(results[0]);
                    return;
                }
                reject('no such user');
            });
        });
    }

    book(user, date, text, amount, type) {
        return new Promise((resolve, reject) => {
            con.query(`INSERT INTO spendings 
                            (date, text, type, amount, user) VALUES (?, ?, ?, ?, ?)`,
                [date, text, type, amount, user],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        reject('could not persist data');
                        return;
                    }
                    resolve('booking was successfull');
                });
        });
    }

    deleteBooking(user, id) {
        return new Promise((resolve, reject) => {
            con.query(`DELETE FROM spendings WHERE user=? and id=?`, [user, id], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error deleting booking for user');
                    return;
                }
                if (results) {
                    resolve(results);
                    return;
                }
                reject('error deleting booking for user');
            });
        });
    }

    getAllBookings(user) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=?`, [user], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error getting bookings for user');
                    return;
                }
                if (results) {
                    resolve(results);
                    return;
                }
                reject('error getting bookings for user');
            });
        });
    }
    getBookingsForType(user, type) { 
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND type=?`, [user, type], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error getting bookings user');
                    return;
                }
                if (results) {
                    resolve(results);
                    return;
                }
                reject('error getting bookings for user');
            });
        });
    }
    getBookingsForDate(user, dateFrom, dateTo) { 
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND 
             (date BETWEEN ? AND ?)`, [user, dateFrom, dateTo], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error getting bookings user');
                    return;
                }
                if (results) {
                    resolve(results);
                    return;
                }
                reject('error getting bookings for user');
            });
        });
    }
    getBookingsForDateAndType(user, dateFrom, dateTo, type) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND 
             (date BETWEEN ? AND ?) AND type=?`, [user, dateFrom, dateTo, type], (err, results) => {
                if (err) {
                    console.error(err);
                    reject('error getting bookings user');
                    return;
                }
                if (results) {
                    resolve(results);
                    return;
                }
                reject('error getting bookings for user');
            });
        });
     }
    getBookings(user, dateFrom, dateTo, type) { 
        if(dateFrom && dateTo) {
            if(type) {
                return this.getBookingsForDateAndType(user, dateFrom, dateTo, type);
            }
            return this.getBookingsForDate(user, dateFrom, dateTo);
        }
        if(type) {
            return this.getBookingsForType(user, type);
        }
        return this.getAllBookings(user);
    }

}

module.exports = Database;