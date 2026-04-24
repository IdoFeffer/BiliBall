const { createClient } = require('@libsql/client')

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
})

const initDB = async () => {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL DEFAULT '',
      full_name TEXT NOT NULL,
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leagues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS league_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      league_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (league_id) REFERENCES leagues(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      league_id INTEGER NOT NULL,
      winner_id INTEGER NOT NULL,
      loser_id INTEGER NOT NULL,
      note TEXT,
      status TEXT DEFAULT 'pending',
      expires_at DATETIME,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      winner_score INTEGER DEFAULT 0,
      loser_score INTEGER DEFAULT 0,
      FOREIGN KEY (league_id) REFERENCES leagues(id),
      FOREIGN KEY (winner_id) REFERENCES users(id),
      FOREIGN KEY (loser_id) REFERENCES users(id)
    );
  `)
}

module.exports = { db, initDB }
