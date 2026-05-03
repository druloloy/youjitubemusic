const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(userId);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX - 1, resetAt: now + WINDOW_MS };
  }

  if (bucket.count >= MAX) {
    return { allowed: false, remaining: 0, resetAt: bucket.windowStart + WINDOW_MS };
  }

  bucket.count++;
  return { allowed: true, remaining: MAX - bucket.count, resetAt: bucket.windowStart + WINDOW_MS };
}

export function getRateLimit(userId: string): { remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(userId);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    return { remaining: MAX, resetAt: now + WINDOW_MS };
  }
  return { remaining: Math.max(0, MAX - bucket.count), resetAt: bucket.windowStart + WINDOW_MS };
}
