import { SearchResult } from '../types';

interface Props {
  results: SearchResult[];
  onAdd: (result: SearchResult) => Promise<void>;
  adding: string | null;
}

export function SearchResults({ results, onAdd, adding }: Props) {
  if (!results.length) return null;

  return (
    <div class="bg-zinc-900 rounded-xl divide-y divide-zinc-800 overflow-hidden">
      {results.map((r) => (
        <div key={r.videoId} class="flex gap-3 p-3 hover:bg-zinc-800 transition-colors">
          <img
            src={r.thumbnail}
            alt=""
            class="w-16 h-12 rounded object-cover shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{r.title}</p>
            <p class="text-zinc-400 text-xs mt-0.5">{r.channel}</p>
            <p class="text-zinc-500 text-xs">{r.duration}</p>
          </div>
          <button
            onClick={() => onAdd(r)}
            disabled={adding === r.videoId}
            class="shrink-0 self-center bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 text-sm font-bold transition-colors"
          >
            {adding === r.videoId ? '…' : '+'}
          </button>
        </div>
      ))}
    </div>
  );
}
