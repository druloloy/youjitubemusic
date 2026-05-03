import { QueueItem } from '../types';

interface Props {
  queue: QueueItem[];
}

export function Queue({ queue }: Props) {
  if (!queue.length) return null;

  return (
    <div class="bg-zinc-900 rounded-xl p-4">
      <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        Queue · {queue.length}
      </p>
      <ul class="space-y-2">
        {queue.map((item, i) => (
          <li key={item.id} class="flex gap-2 items-center">
            <span class="text-zinc-600 text-xs w-5 text-right shrink-0">{i + 2}</span>
            <img src={item.thumbnail} alt="" class="w-10 h-7 rounded object-cover shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm truncate leading-tight">{item.title}</p>
              <p class="text-zinc-500 text-xs truncate">{item.channel} · {item.duration}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
