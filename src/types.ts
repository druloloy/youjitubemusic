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

export interface SearchResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
}

export interface QueueState {
  current: QueueItem | null;
  queue: QueueItem[];
}

export interface RateLimit {
  remaining: number;
  resetAt: number;
}
