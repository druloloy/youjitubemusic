import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import searchRouter from './routes/search.js';
import queueRouter from './routes/queue.js';
import adminRouter from './routes/admin.js';
import { store } from './store.js';
import { addClient } from './broadcast.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env['NODE_ENV'] === 'production';

const app = express();
if (!isProd) app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  addClient(ws);
  ws.send(JSON.stringify({ type: 'state', data: store.getState() }));
});

app.use('/api/search', searchRouter);
app.use('/api/queue', queueRouter);
app.use('/api/admin', adminRouter);

if (isProd) {
  const distPath = join(__dirname, '../src/dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

const PORT = process.env['PORT'] ?? 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
