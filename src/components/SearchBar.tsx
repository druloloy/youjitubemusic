import { useState, useRef } from 'preact/hooks';

interface Props {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching }: Props) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(val), 400);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} class="flex gap-2">
      <input
        type="text"
        value={query}
        onInput={handleInput}
        placeholder="Search for a song or artist..."
        class="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:ring-2 focus:ring-red-500 transition"
      />
      <button
        type="submit"
        disabled={isSearching}
        class="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {isSearching ? '…' : 'Search'}
      </button>
    </form>
  );
}
