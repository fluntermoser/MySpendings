var crypto = require('crypto');
/**
 * class to encrypt and compare user passwords
 */
class Crypto {
    /**
     * class to encrypt and compare user passwords
     */
    constructor() { }

    /**
     * generate a hash for a newly created password
     * @function
     * @param {string} password - string that was set by the user as a password
     */
    hashPasswordNew(password) {
        var salt = genRandomString(16); /** Gives us salt of length 16 */
        var passwordData = sha512(password, salt);
        console.log(passwordData);
        return passwordData;
    }

    /**
     * compare a password that was given by the user with the hash stored in the database
     * @function
     * @param {string} password 
     * @param {string} salt 
     * @param {string} hash 
     */
    compare(password, salt, hash) {
        return sha512(password, salt).passwordHash === hash;
    }
}
/**
 * generates random string of characters to be used as salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - password string
 * @param {string} salt - salt that is attached to password before hashing
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


module.exports = Crypto;