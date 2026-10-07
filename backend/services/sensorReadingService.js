const sensorReadingRepository = require('../repositories/sensorReadingRepository');
const deviceRepository = require('../repositories/deviceRepository');

function getLatestReading() {
  return sensorReadingRepository.findLatest();
}

function addReading(reading) {
  if (reading.deviceId !== null && reading.deviceId !== undefined) {
    const device = deviceRepository.findById(reading.deviceId);

    if (!device) {
      const error = new Error('Device not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return sensorReadingRepository.create(reading);
}

module.exports = { getLatestReading, addReading };