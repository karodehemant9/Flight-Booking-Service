const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const { Enums } = require("../utils/common");
const { INITIATED, PENDING, BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const booking = await Booking.create(data, { transaction });
    return booking;
  }

  async get(id, transaction) {
    const response = await Booking.findByPk(id, { transaction });
    if (!response) {
      throw new AppError(
        "Not able to find the resource",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async update(id, data, transaction) {
    await Booking.update(
      data,
      {
        where: { id: id },
      },
      { transaction }
    );
    return true;
  }

  async cancelOldBookings(cutoffTime) {
    const response = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            { createdAt: { [Op.lt]: cutoffTime } },
            { status: { [Op.ne]: [BOOKED, CANCELLED] } },
          ],
        },
      }
    );
    return response;
  }
}

module.exports = BookingRepository;
