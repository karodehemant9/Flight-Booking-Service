const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Enums } = require("../utils/common");
const { BOOKED, INITIATED, PENDING, CANCELLED } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (flightData.totalSeats < data.noOfSeats) {
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = flightData.price * data.noOfSeats;
    const bookingPayload = {
      ...data,
      totalCost: totalBillingAmount,
    };

    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );

    await transaction.commit();
    return booking;
  } catch (error) {
    console.log("Error in booking service:", error);
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  // Implementation for making payment
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );

    if (bookingDetails.status === "CANCELLED") {
      throw new AppError("Booking Cancelled", StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    const timeDiff = currentTime - bookingTime; // in miliseconds
    // 5 minutes = 300000 ms
    if (timeDiff > 300000) {
      await cancelBooking(data.bookingId);
      throw new AppError("Booking Expired", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost !== data.amount) {
      throw new AppError("Amount mismatch", StatusCodes.BAD_REQUEST);
    }
    // Further payment processing logic goes here
    if (bookingDetails.userId !== data.userId) {
      throw new AppError("User ID mismatch", StatusCodes.BAD_REQUEST);
    }
    // Assuming payment is successful
    const response = await bookingRepository.update(
      data.bookingId,
      { status: "BOOKED" },
      transaction
    );
    await transaction.commit();
    return response;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelBooking(bookingId) {
  // Implementation for cancelling booking
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if (bookingDetails.status === "CANCELLED") {
      await transaction.commit();
      return true;
    }
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
      {
        seats: bookingDetails.noOfSeats,
        decrease: false,
      }
    );
    const response = await bookingRepository.update(
      bookingId,
      { status: "CANCELLED" },
      transaction
    );
    await transaction.commit();
    return response;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelOldBookings() {
  try {
    const time = new Date(Date.now() - 1000 * 60 * 5); // 5 minutes ago
    const response = await bookingRepository.cancelOldBookings(time);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelBooking,
  cancelOldBookings,
};
