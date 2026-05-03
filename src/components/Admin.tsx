import { useState } from 'preact/hooks';

export function Admin() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const clearQueue = async () => {
    setStatus('loading');
    await fetch('/api/admin/queue', { method: 'DELETE' });
    setStatus('done');
  };

  return (
    <div class="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div class="bg-zinc-900 rounded-2xl p-8 text-center space-y-5 w-full max-w-sm">
        <h1 class="text-2xl font-bold">Admin</h1>
        <p class="text-zinc-400 text-sm">Clear the entire queue and stop playback on the host device.</p>
        {status === 'done' && (
          <p class="text-green-400 text-sm font-medium">Queue cleared.</p>
        )}
        <button
          onClick={clearQueue}
          disabled={status !== 'idle'}
          class="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
        >
          {status === 'loading' ? 'Clearing…' : 'Clear Queue'}
        </button>
        <a href="/" class="block text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
          ← Back to Jukebox
        </a>
      </div>
    </div>
  );
}
