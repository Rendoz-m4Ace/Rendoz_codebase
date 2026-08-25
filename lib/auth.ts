import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from './db';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

interface Session {
  id: string;
  admin_id: number;
  expires_at: string;
  created_at: string;
}

export function initializeAdmin(): void {
  const db = getDb();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return;
  }

  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin') as AdminUser | undefined;

  if (!existingAdmin) {
    const passwordHash = bcryptjs.hashSync(adminPassword, 10);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
    console.log('Admin user created successfully');
  } else {
    const passwordHash = bcryptjs.hashSync(adminPassword, 10);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(passwordHash, 'admin');
    console.log('Admin password updated');
  }
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export function createSession(): string {
  const db = getDb();
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  db.prepare('INSERT INTO admin_sessions (id, expires_at) VALUES (?, ?)').run(sessionId, expiresAt);

  return sessionId;
}

export function validateSession(sessionId: string): boolean {
  const db = getDb();
  const session = db.prepare('SELECT * FROM admin_sessions WHERE id = ? AND expires_at > ?').get(sessionId, new Date().toISOString()) as Session | undefined;
  return !!session;
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  db.prepare('DELETE FROM admin_sessions WHERE id = ?').run(sessionId);
}
