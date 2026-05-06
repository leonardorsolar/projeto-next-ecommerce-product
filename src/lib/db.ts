import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dataDir = path.join(process.cwd(), 'data')
    const dbPath = path.join(dataDir, 'ecommerce.db')

    fs.mkdirSync(dataDir, { recursive: true })

    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initializeSchema(db)
  }

  return db
}

function initializeSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
      price       REAL    NOT NULL CHECK (price >= 0),
      stock       INTEGER NOT NULL CHECK (stock >= 0),
      created_at  TEXT    DEFAULT (datetime('now'))
    );
  `)

  console.info('[DB] Schema inicializado com sucesso')
}
