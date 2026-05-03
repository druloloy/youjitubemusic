import { QueueItem } from '../types';

interface Props {
  current: QueueItem | null;
  upNext: QueueItem | undefined;
}

export function NowPlaying({ current, upNext }: Props) {
  if (!current) {
    return (
      <div class="bg-zinc-900 rounded-xl p-5 text-center text-zinc-500 text-sm">
        Queue is empty — search for something to play.
      </div>
    );
  }

  return (
    <div class="bg-zinc-900 rounded-xl p-4 space-y-3">
      <p class="text-xs font-semibold uppercase tracking-widest text-red-500">Now Playing</p>
      <div class="flex gap-3 items-start">
        <img
          src={current.thumbnail}
          alt=""
          class="w-16 h-12 rounded object-cover flex-shrink-0"
        />
        <div class="min-w-0">
          <p class="font-semibold text-sm leading-snug line-clamp-2">{current.title}</p>
          <p class="text-zinc-400 text-xs mt-0.5">{current.channel} · {current.duration}</p>
        </div>
      </div>

      {upNext && (
        <div class="border-t border-zinc-800 pt-3 flex gap-2 items-center">
          <p class="text-xs text-zinc-500 shrink-0">Up next</p>
          <img src={upNext.thumbnail} alt="" class="w-9 h-7 rounded object-cover shrink-0" />
          <p class="text-xs text-zinc-300 truncate">{upNext.title}</p>
        </div>
      )}
    </div>
  );
}
