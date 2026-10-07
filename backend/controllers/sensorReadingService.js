const sensorReadingService = require('../services/sensorReadingService');

function getLatestReading(_request, response, next) {
  try {
    const reading = sensorReadingService.getLatestReading();

    if (!reading) {
      return response.status(404).json({ error: 'No sensor readings found' });
    }

    return response.json(reading);
  } catch (error) {
    next(error);
  }
}

function createReading(request, response, next) {
  try {
    const { temperature, humidity, lightLevel, deviceId } = request.body;
    const values = [temperature, humidity, lightLevel];

    if (
      values.some((value) => typeof value !== 'number' || !Number.isFinite(value)) ||
      (deviceId !== undefined && deviceId !== null && !Number.isInteger(deviceId))
    ) {
      return response.status(400).json({
        error: 'temperature, humidity, and lightLevel must be numbers',
      });
    }

    return response.status(201).json(
      sensorReadingService.addReading({
        temperature,
        humidity,
        lightLevel,
        deviceId,
      })
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { getLatestReading, createReading };