import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const hasRedis = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

// Falls back to noop when Redis env vars are missing (local dev without KV) so
// server actions still work — real throttling only kicks in on Vercel prod.
const redis = hasRedis ? Redis.fromEnv() : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, requests: number, windowSec: number): Ratelimit | null {
  if (!redis) return null;
  const key = `${name}:${requests}:${windowSec}`;
  let l = limiters.get(key);
  if (!l) {
    l = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, `${windowSec} s`),
      prefix: `rl:${name}`,
      analytics: true,
    });
    limiters.set(key, l);
  }
  return l;
}

export async function checkRateLimit(
  name: string,
  requests: number,
  windowSec: number,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getLimiter(name, requests, windowSec);
  if (!limiter) return { success: true, remaining: requests };

  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'anonymous';

  const { success, remaining } = await limiter.limit(ip);
  return { success, remaining };
}
