/**
 * class representing a user object in the login/registering context
 * @class
 */
export class User {
    constructor(
        public username: string,
        public password?: string,
        public password2?: string,
      ) {  }
}
