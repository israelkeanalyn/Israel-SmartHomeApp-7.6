const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const databaseDirectory = __dirname;
const databasePath = path.join(databaseDirectory, 'smarthome.db');
const schemaPath = path.join(databaseDirectory, 'schema.sql');

const db = new DatabaseSync(databasePath);
const tables = db.prepare(
  "SELECT name FROM sqlite_master WHERE type = 'table'"
).all();
const tableNames = new Set(tables.map((table) => table.name));

if (tableNames.has('sensors') && !tableNames.has('sensor_readings')) {
  db.exec('ALTER TABLE sensors RENAME TO sensor_readings');
}

db.exec(fs.readFileSync(schemaPath, 'utf8'));

const seedDevices = [
  [1, 'Living Room Light', 'Smart Light', 'bulb-outline', 1],
  [2, 'Bedroom Fan', 'Smart Fan', 'sync-outline', 0],
  [3, 'Front Door Lock', 'Smart Lock', 'lock-closed-outline', 1],
];

const insertDevice = db.prepare(`
  INSERT OR IGNORE INTO devices (id, name, type, icon, status)
  VALUES (?, ?, ?, ?, ?)
`);

for (const device of seedDevices) {
  insertDevice.run(...device);
}

const sensorCount = db.prepare(
  'SELECT COUNT(*) AS count FROM sensor_readings'
).get().count;

if (sensorCount === 0) {
  db.prepare(`
    INSERT INTO sensor_readings
      (temperature, humidity, light_level, device_id, recorded_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(22.5, 45, 300, 1, new Date().toISOString());
}

db.close();
console.log(`SQLite database ready: ${databasePath}`);
