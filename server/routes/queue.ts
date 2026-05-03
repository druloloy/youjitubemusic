import { Router } from 'express';
import { store } from '../store.js';
import { checkRateLimit, getRateLimit } from '../rateLimit.js';
import { broadcast } from '../broadcast.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(store.getState());
});

router.post('/add', (req, res) => {
  const { videoId, title, channel, thumbnail, duration, userId } = req.body as Record<string, string>;

  if (!videoId || !title || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const limit = checkRateLimit(userId);
  if (!limit.allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded', remaining: 0, resetAt: limit.resetAt });
  }

  const item = store.add({ videoId, title, channel, thumbnail, duration, userId });
  broadcast({ type: 'state', data: store.getState() });

  res.json({ item, rateLimit: { remaining: limit.remaining, resetAt: limit.resetAt } });
});

router.post('/advance', (_req, res) => {
  const state = store.advance();
  broadcast({ type: 'state', data: state });
  res.json(state);
});

router.get('/rate-limit/:userId', (req, res) => {
  res.json(getRateLimit(req.params['userId']!));
});

export default router;
