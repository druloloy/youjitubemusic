import { Router } from 'express';
import { store } from '../store.js';
import { broadcast } from '../broadcast.js';

const router = Router();

router.delete('/queue', (_req, res) => {
  store.clear();
  broadcast({ type: 'state', data: store.getState() });
  res.json({ success: true });
});

export default router;
