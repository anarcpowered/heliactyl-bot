const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./config.db", (err) => {
  if (err) console.error("Failed to connect to database:", err);
  else console.log("Connected to SQLite database.");
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    url TEXT
  )
`);

module.exports = db;
