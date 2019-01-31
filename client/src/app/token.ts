/**
 * class describing the object the server returns after register/login of a user
 * @class
 */
export class Token {
    constructor(public auth: boolean,public token: string) {
    }
}
