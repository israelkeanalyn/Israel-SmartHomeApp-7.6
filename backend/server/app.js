const express = require('express');
const cors = require('cors');
const deviceController = require('../controllers/deviceController');
const sensorReadingController = require('../controllers/sensorReadingController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/devices', deviceController.getDevices);
app.patch('/api/devices/:id/status', deviceController.updateDeviceStatus);
app.get('/api/sensor-readings/latest', sensorReadingController.getLatestReading);
app.post('/api/sensor-readings', sensorReadingController.createReading);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error',
  });
});

module.exports = app;