const db = require('./database');

function findLatest() {
  return db.prepare(`
    SELECT
      id,
      temperature,
      humidity,
      light_level AS lightLevel,
      device_id AS deviceId,
      recorded_at AS recordedAt
    FROM sensor_readings
    ORDER BY recorded_at DESC, id DESC
    LIMIT 1
  `).get() || null;
}

function create({ temperature, humidity, lightLevel, deviceId = null }) {
  const recordedAt = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO sensor_readings
      (temperature, humidity, light_level, device_id, recorded_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(temperature, humidity, lightLevel, deviceId, recordedAt);

  return db.prepare(`
    SELECT
      id,
      temperature,
      humidity,
      light_level AS lightLevel,
      device_id AS deviceId,
      recorded_at AS recordedAt
    FROM sensor_readings
    WHERE id = ?
  `).get(result.lastInsertRowid);
}

module.exports = { findLatest, create };