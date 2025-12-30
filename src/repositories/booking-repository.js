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

  async get(id, transaction) {
    const response = await this.model.findByPk(id, { transaction});
    if (!response) {
      throw new AppError(
        "Not able to find the resource",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async update(id, data, transaction) {
    await this.model.update(data, {
      where: { id: id },
    }, { transaction });
    return true;
  }
}

module.exports = BookingRepository;
