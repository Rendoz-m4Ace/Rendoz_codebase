import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_KEY = 'rendoz:sessions';
const SESSION_DURATION_SECONDS = 24 * 60 * 60;

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export async function createSession(): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex');

  await redis.hset(SESSION_KEY, { [sessionId]: Date.now().toString() });
  await redis.expire(SESSION_KEY, SESSION_DURATION_SECONDS);

  return sessionId;
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const exists = await redis.hget<string>(SESSION_KEY, sessionId);
  return !!exists;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.hdel(SESSION_KEY, sessionId);
}
