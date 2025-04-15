// models/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('Connected to SQLite DB');
});

module.exports = db;