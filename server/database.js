const mysql = require('mysql');
const fs = require('fs');
var config = require("./config.json");
var con;

/**
 * class that manages all database operations
 * @class
 */
class Database {
    /**
     * class that manages all database operations.
     * the constructur initially creates a databse connection. 
     * the connection opened is used for all other operations
     */
    constructor() {
        let p = this.connectDatabase();
        p.then(message => {
            console.log(message);
            con.query(`USE ${config.database.database};`, function (err) {
                if (err) {
                    console.error(err);
                }
            });
            //this.initDefaultSchema();
        }).catch(reason => {
            console.error(reason);
        });
    }
    /**
     * opens a connection to the database using the credentials provided in config file
     * @function
    */
    connectDatabase() {
        con = mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password
        });
        return new Promise((resolve, reject) => {
            con.connect(function (err) {
                if (err) {
                    console.log(config);
                    reject(err);
                    return;
                }
                resolve("connection to db successfull");
            });
        });
    }

    /**
     * creates the default database scheme that is needed for the app to run properly
     * @function
     */
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

    /**
     * creates user in database given the username and passwordData object
     * @function
     * @param {string} username 
     * @param {object} passwordData - object containing 'passwordHash' and 'salt'
     */
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

    /**
     * checks if user is existing in database
     * @function
     * @param {string} username 
     */
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

    /**
     * creates a new booking in the database using the given parameters
     * @function
     * @param {string} user 
     * @param {string} date 
     * @param {string} text 
     * @param {number} amount 
     * @param {number} type 
     */
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

    /**
     * deletes booking with given id and given user from database
     * @function
     * @param {string} user 
     * @param {number} id 
     */
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

    /**
     * updates booking with given id for given user
     * with the given values 
     * @function
     * @param {string} user 
     * @param {number} id 
     * @param {string} date 
     * @param {string} text 
     * @param {number} amount 
     * @param {number} type 
     */
    updateBooking(user, id, date, text, amount, type) {
        return new Promise((resolve, reject) => {
            con.query(`UPDATE spendings 
                        SET date=?, text=?, amount=?, type=? 
                        WHERE id=? AND user=?`,
                [date, text, amount, type, id, user],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        reject('error updating booking for user');
                        return;
                    }
                    resolve('booking was successfully udpated');
                });
        });
    }

    /**
     * gets the users balance from database
     * @function
     * @param {string} user 
     */
    getBalance(user) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT SUM(sum) as balance from 
                (SELECT SUM(amount) as sum from spendings WHERE type=1 and user=? 
                    GROUP BY type 
                UNION ALL 
                SELECT 0 - SUM(amount) as sum from spendings WHERE type=0 and user=? 
                GROUP BY type) as temp`, [user, user], (err, results) => {
                    if (err) {
                        console.error(err);
                        reject('error getting bookings for user');
                        return;
                    }
                    if (results[0]) {
                        resolve(results[0]);
                        return;
                    }
                    reject('error getting bookings for user');
                });
        });
    }

    /**
     * gets a single booking by id
     * @function
     * @param {number} id 
     */
    getBooking(id) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE id=? 
             LIMIT 1`, [id], (err, results) => {
                    if (err) {
                        console.error(err);
                        reject('error getting bookings for user');
                        return;
                    }
                    if (results[0]) {
                        resolve(results[0]);
                        return;
                    }
                    reject('error getting bookings for user');
                });
        });
    }

    /**
     * gets all bookings for given user
     * @function
     * @param {string} user 
     */
    getAllBookings(user) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? 
             ORDER BY date`, [user], (err, results) => {
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

    /**
     * gets all bookings for given user and type
     * @function
     * @param {string} user 
     * @param {number} type 
     */
    getBookingsForType(user, type) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND type=?
             ORDER BY date`, [user, type], (err, results) => {
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

    /**
     * gets all bookings for given user and date
     * @function
     * @param {string} user 
     * @param {string} dateFrom 
     * @param {string} dateTo 
     */
    getBookingsForDate(user, dateFrom, dateTo) {
        return new Promise((resolve, reject) => {
            let dateStatement = this.getDateCheck(dateFrom, dateTo);
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND 
             ${dateStatement} 
             ORDER BY date`, [user], (err, results) => {
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

    /**
     * gets all bookings for given user, type and date
     * @function
     * @param {string} user 
     * @param {string} dateFrom 
     * @param {string} dateTo 
     * @param {number} type 
     */
    getBookingsForDateAndType(user, dateFrom, dateTo, type) {
        return new Promise((resolve, reject) => {
            let dateStatement = this.getDateCheck(dateFrom, dateTo);
            con.query(`SELECT id, date, text, amount, type
             FROM spendings WHERE user=? AND 
             ${dateStatement} AND type=?
             ORDER BY date`, [user, type], (err, results) => {
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

    /**
     * gets bookings for user that match given parameters
     * only user parameter has bo be set
     * @function
     * @param {string} user 
     * @param {string} dateFrom 
     * @param {string} dateTo 
     * @param {number} type 
     */
    getBookings(user, dateFrom, dateTo, type) {
        if (dateFrom || dateTo) {
            if (type) {
                return this.getBookingsForDateAndType(user, dateFrom, dateTo, type);
            }
            return this.getBookingsForDate(user, dateFrom, dateTo);
        }
        if (type) {
            return this.getBookingsForType(user, type);
        }
        return this.getAllBookings(user);
    }

    /**
     * generates an escaped sql subqery check for given dates
     * only one date has to be set
     * @param {string} dateFrom 
     * @param {string} dateTo 
     */
    getDateCheck(dateFrom, dateTo) {
        let dateStatement = '';
        if (dateFrom && dateTo) {
            dateStatement = `(date BETWEEN ${con.escape(dateFrom)} AND ${con.escape(dateTo)})`;
        }
        else if (dateFrom) {
            dateStatement = `date >= ${con.escape(dateFrom)}`;
        }
        else if (dateTo) {
            dateStatement = `date <= ${con.escape(dateTo)}`;
        }
        return dateStatement;
    }
}

module.exports = Database;