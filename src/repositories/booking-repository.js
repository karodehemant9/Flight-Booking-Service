const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const booking = await Booking.create(data, { transaction });
    return booking;
  }
}

module.exports = BookingRepository;
