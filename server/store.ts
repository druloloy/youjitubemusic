import { randomUUID } from 'crypto';

export interface QueueItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  userId: string;
  addedAt: number;
}

export interface QueueState {
  current: QueueItem | null;
  queue: QueueItem[];
}

const state: QueueState = { current: null, queue: [] };
let lastAdvanceAt = 0;

export const store = {
  getState(): QueueState {
    return { current: state.current, queue: [...state.queue] };
  },

  add(item: Omit<QueueItem, 'id' | 'addedAt'>): QueueItem {
    const entry: QueueItem = { ...item, id: randomUUID(), addedAt: Date.now() };
    if (!state.current) {
      state.current = entry;
    } else {
      state.queue.push(entry);
    }
    return entry;
  },

  advance(): QueueState {
    const now = Date.now();
    if (now - lastAdvanceAt < 2000) return this.getState();
    lastAdvanceAt = now;
    state.current = state.queue.shift() ?? null;
    return this.getState();
  },

  clear(): void {
    state.current = null;
    state.queue = [];
  },
};
