PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1))
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  light_level REAL NOT NULL,
  device_id INTEGER,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);