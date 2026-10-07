const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = path.join(__dirname, '..', '..', 'database', 'smarthome.db');
const db = new DatabaseSync(databasePath);
db.exec('PRAGMA foreign_keys = ON');

module.exports = db;