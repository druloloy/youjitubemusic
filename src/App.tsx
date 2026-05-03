import { useState, useEffect } from 'preact/hooks';
import { QueueState, SearchResult, RateLimit } from './types';
import { useUserId } from './hooks/useUserId';
import { useWebSocket } from './hooks/useWebSocket';
import { useWakeLock } from './hooks/useWakeLock';
import { Player } from './components/Player';
import { NowPlaying } from './components/NowPlaying';
import { Queue } from './components/Queue';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { Admin } from './components/Admin';

export function App() {
  if (window.location.pathname === '/admin') return <Admin />;
  return <Main />;
}

function Main() {
  const userId = useUserId();
  const [queueState, setQueueState] = useState<QueueState>({ current: null, queue: [] });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimit>({ remaining: 5, resetAt: 0 });
  const [isHost, setIsHost] = useState(() => localStorage.getItem('isHost') === 'true');

  useWakeLock(isHost);

  useWebSocket((msg) => {
    const m = msg as { type: string; data: QueueState };
    if (m.type === 'state') setQueueState(m.data);
  });

  useEffect(() => {
    fetch(`/api/queue/rate-limit/${userId}`)
      .then((r) => r.json())
      .then((d: RateLimit) => setRateLimit(d))
      .catch(() => {});
  }, [userId]);

  const toggleHost = () => {
    const next = !isHost;
    setIsHost(next);
    localStorage.setItem('isHost', String(next));
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      setSearchResults((await res.json()) as SearchResult[]);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async (result: SearchResult) => {
    setAddError(null);
    setAdding(result.videoId);
    try {
      const res = await fetch('/api/queue/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result, userId }),
      });
      const data = (await res.json()) as {
        item?: unknown;
        rateLimit?: RateLimit;
        error?: string;
        resetAt?: number;
      };

      if (res.status === 429) {
        const resetTime = data.resetAt ? new Date(data.resetAt).toLocaleTimeString() : 'later';
        setAddError(`Limit reached — try again at ${resetTime}`);
        return;
      }

      if (data.rateLimit) setRateLimit(data.rateLimit);
      setSearchResults([]);
    } finally {
      setAdding(null);
    }
  };

  const handleAdvance = async () => {
    await fetch('/api/queue/advance', { method: 'POST' });
  };

  return (
    <div class="min-h-screen bg-zinc-950 text-white">
      <header class="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold tracking-tight">
          <span class="text-red-500">◆</span> Office Jukebox
        </h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-zinc-400">
            {rateLimit.remaining} add{rateLimit.remaining !== 1 ? 's' : ''} left
          </span>
          <button
            onClick={toggleHost}
            class={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
              isHost
                ? 'bg-red-600 border-red-600 text-white'
                : 'border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isHost ? '☀ Player' : 'Guest'}
          </button>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="order-2 md:order-1 space-y-4">
          {isHost && (
            <Player
              videoId={queueState.current?.videoId ?? null}
              isHost={isHost}
              onEnd={handleAdvance}
            />
          )}
          <NowPlaying current={queueState.current} upNext={queueState.queue[0]} />
          <Queue queue={queueState.queue} />
        </div>

        <div class="order-1 md:order-2 space-y-3">
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          {addError && (
            <p class="text-red-400 text-sm px-1">{addError}</p>
          )}
          <SearchResults results={searchResults} onAdd={handleAdd} adding={adding} />
        </div>
      </div>

      <footer class="text-center py-6 text-zinc-700 text-xs">
        <a href="/admin" class="hover:text-zinc-500 transition-colors">Admin</a>
      </footer>
    </div>
  );
}
