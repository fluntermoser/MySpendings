/**
 * object representing a single booking (spending/income)
 * @class
 */
export class Booking {
  dateString: string;
    constructor(
        public id: number,
        public date?: string,
        public text?: string,
        public amount?: number,
        public type?: number,
      ) {  
      }
}

