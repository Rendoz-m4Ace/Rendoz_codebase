import { Redis } from '@upstash/redis';
import crypto from 'crypto';

function sanitize(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/^["']|["']$/g, '').trim();
}

let redisInstance: Redis | null = null;

function getRedis(): Redis {
  if (redisInstance) return redisInstance;
  const url = sanitize(process.env.UPSTASH_REDIS_REST_URL);
  const token = sanitize(process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!url || !token) {
    throw new Error('Missing Upstash Redis env: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN');
  }
  redisInstance = new Redis({ url, token });
  return redisInstance;
}

const SESSION_KEY = 'rendoz:sessions';
const SESSION_DURATION_SECONDS = 24 * 60 * 60;

export function validateAdminPassword(password: string): boolean {
  const adminPassword = sanitize(process.env.ADMIN_PASSWORD);
  if (!adminPassword) return false;
  return password === adminPassword;
}

export async function createSession(): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const redis = getRedis();
  await redis.hset(SESSION_KEY, { [sessionId]: Date.now().toString() });
  await redis.expire(SESSION_KEY, SESSION_DURATION_SECONDS);
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const redis = getRedis();
  const exists = await redis.hget<string>(SESSION_KEY, sessionId);
  return !!exists;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const redis = getRedis();
  await redis.hdel(SESSION_KEY, sessionId);
}
