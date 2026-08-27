import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const WAITLIST_KEY = 'rendoz:waitlist';
const WAITLIST_INDEX_KEY = 'rendoz:waitlist:index';
const RATE_LIMIT_KEY = 'rendoz:ratelimit';

export interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
  ip_address: string | null;
  source: string;
}

export async function addEmail(email: string, ipAddress?: string, source: string = 'website'): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await redis.sismember(WAITLIST_INDEX_KEY, normalizedEmail);
  if (exists) {
    return { success: false, message: 'This email is already on the waitlist.' };
  }

  try {
    const id = await redis.incr('rendoz:waitlist:counter');

    const entry: WaitlistEntry = {
      id,
      email: normalizedEmail,
      created_at: new Date().toISOString(),
      ip_address: ipAddress || null,
      source,
    };

    await redis.hset(WAITLIST_KEY, { [normalizedEmail]: JSON.stringify(entry) });
    await redis.sadd(WAITLIST_INDEX_KEY, normalizedEmail);

    return { success: true, message: "You've been added to the waitlist!" };
  } catch (error) {
    console.error('Failed to add email:', error);
    return { success: false, message: 'Failed to add email. Please try again.' };
  }
}

export async function getEmail(email: string): Promise<WaitlistEntry | undefined> {
  const normalizedEmail = email.toLowerCase().trim();
  const data = await redis.hget<string>(WAITLIST_KEY, normalizedEmail);
  if (!data) return undefined;
  return typeof data === 'string' ? JSON.parse(data) : data as unknown as WaitlistEntry;
}

export async function getAllEmails(): Promise<WaitlistEntry[]> {
  const emails = await redis.smembers(WAITLIST_INDEX_KEY);
  const entries: WaitlistEntry[] = [];

  for (const email of emails) {
    const data = await redis.hget<string>(WAITLIST_KEY, email);
    if (data) {
      entries.push(typeof data === 'string' ? JSON.parse(data) : data as unknown as WaitlistEntry);
    }
  }

  entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return entries;
}

export async function getEmailCount(): Promise<number> {
  return await redis.scard(WAITLIST_INDEX_KEY);
}

export async function deleteEmail(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const removed = await redis.srem(WAITLIST_INDEX_KEY, normalizedEmail);
  await redis.hdel(WAITLIST_KEY, normalizedEmail);
  return removed > 0;
}

export async function checkRateLimit(ipAddress: string, maxAttempts: number = 5, windowMinutes: number = 60): Promise<boolean> {
  const key = `${RATE_LIMIT_KEY}:${ipAddress}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowMinutes * 60);
  }

  if (count > maxAttempts) {
    return false;
  }

  return true;
}
