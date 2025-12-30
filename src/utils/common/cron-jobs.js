const cron = require("node-cron");
const { BookingService } = require("../../services");

function scheduleCrons() {
  // Define cron jobs here in future
  cron.schedule("*/30 * * * *", async () => {
    await BookingService.cancelOldBookings();
    console.log("Running cron job to clean up expired bookings");
  });
}

module.exports = { scheduleCrons };
