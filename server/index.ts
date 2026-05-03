import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import searchRouter from './routes/search.js';
import queueRouter from './routes/queue.js';
import adminRouter from './routes/admin.js';
import { store } from './store.js';
import { addClient } from './broadcast.js';

const app = express();
app.use(cors());
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

const PORT = process.env['PORT'] ?? 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
