const deviceRepository = require('../repositories/deviceRepository');

function listDevices() {
  return deviceRepository.findAll();
}

function setDeviceStatus(id, status) {
  const device = deviceRepository.updateStatus(id, status);

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return device;
}

module.exports = { listDevices, setDeviceStatus };