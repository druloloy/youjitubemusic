import { Router } from 'express';
import { YouTube } from 'youtube-sr';

const router = Router();

router.get('/', async (req, res) => {
  const q = String(req.query['q'] ?? '').trim();
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const results = await YouTube.search(q, { limit: 8, type: 'video' });
    res.json(
      results
        .filter((v) => v.id)
        .map((v) => ({
          videoId: v.id,
          title: v.title ?? 'Unknown',
          channel: v.channel?.name ?? 'Unknown',
          thumbnail: `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`,
          duration: v.durationFormatted ?? '?',
        })),
    );
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
