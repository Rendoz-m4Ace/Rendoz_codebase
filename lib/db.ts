import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'rendoz.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = db!;

  database.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      source TEXT DEFAULT 'website'
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_id INTEGER DEFAULT 1,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS rate_limit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_rate_limit_ip ON rate_limit(ip_address, created_at)
  `);
}

export interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
  ip_address: string | null;
  source: string;
}

export function addEmail(email: string, ipAddress?: string, source: string = 'website'): { success: boolean; message: string } {
  const database = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  const existing = database.prepare('SELECT id FROM waitlist WHERE email = ?').get(normalizedEmail) as { id: number } | undefined;
  if (existing) {
    return { success: false, message: 'This email is already on the waitlist.' };
  }

  try {
    database.prepare('INSERT INTO waitlist (email, ip_address, source) VALUES (?, ?, ?)').run(normalizedEmail, ipAddress || null, source);
    return { success: true, message: "You've been added to the waitlist!" };
  } catch (error) {
    return { success: false, message: 'Failed to add email. Please try again.' };
  }
}

export function getEmail(email: string): WaitlistEntry | undefined {
  const database = getDb();
  return database.prepare('SELECT * FROM waitlist WHERE email = ?').get(email.toLowerCase().trim()) as WaitlistEntry | undefined;
}

export function getAllEmails(): WaitlistEntry[] {
  const database = getDb();
  return database.prepare('SELECT * FROM waitlist ORDER BY created_at DESC').all() as WaitlistEntry[];
}

export function getEmailCount(): number {
  const database = getDb();
  const result = database.prepare('SELECT COUNT(*) as count FROM waitlist').get() as { count: number };
  return result.count;
}

export function deleteEmail(email: string): boolean {
  const database = getDb();
  const result = database.prepare('DELETE FROM waitlist WHERE email = ?').run(email.toLowerCase().trim());
  return result.changes > 0;
}

export function checkRateLimit(ipAddress: string, maxAttempts: number = 5, windowMinutes: number = 60): boolean {
  const database = getDb();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const result = database.prepare('SELECT COUNT(*) as count FROM rate_limit WHERE ip_address = ? AND created_at > ?').get(ipAddress, windowStart) as { count: number };

  if (result.count >= maxAttempts) {
    return false;
  }

  database.prepare('INSERT INTO rate_limit (ip_address) VALUES (?)').run(ipAddress);
  return true;
}

export function cleanupRateLimit(): void {
  const database = getDb();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  database.prepare('DELETE FROM rate_limit WHERE created_at < ?').run(thirtyDaysAgo);
}
