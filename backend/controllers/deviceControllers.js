const deviceService = require('../services/deviceService');

function getDevices(_request, response, next) {
  try {
    response.json(deviceService.listDevices());
  } catch (error) {
    next(error);
  }
}

function updateDeviceStatus(request, response, next) {
  try {
    const id = Number(request.params.id);
    const { status } = request.body;

    if (!Number.isInteger(id) || typeof status !== 'boolean') {
      return response.status(400).json({
        error: 'id must be an integer and status must be a boolean',
      });
    }

    return response.json(deviceService.setDeviceStatus(id, status));
  } catch (error) {
    next(error);
  }
}

module.exports = { getDevices, updateDeviceStatus };