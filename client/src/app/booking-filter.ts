/**
 * object representing the filters that are used to filter bookings in list view
 * @class
 */
export class BookingFilter {
    constructor(public type?: number,
                public from?: string,
                public to?: string){

    }
}
