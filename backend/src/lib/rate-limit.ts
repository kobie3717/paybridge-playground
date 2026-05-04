import type { Request, Response, NextFunction } from 'express';

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;

export function rateLimit(perMinute: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      return next();
    }

    if (bucket.count >= perMinute) {
      return res.status(429).json({
        error: 'rate_limited',
        message: `Limit ${perMinute}/min`,
        retryAfterMs: bucket.resetAt - now,
      });
    }

    bucket.count++;
    next();
  };
}
