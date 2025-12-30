const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  FLIGHT_SERVICE: process.env.FLIGHT_SERVICE_URL || 'http://localhost:4000',
};