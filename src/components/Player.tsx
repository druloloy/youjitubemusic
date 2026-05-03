import { useEffect, useRef } from 'preact/hooks';

declare global {
  interface Window {
    YT: {
      Player: new (
        el: string | HTMLElement,
        config: {
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayerInstance }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayerInstance;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayerInstance {
  loadVideoById(videoId: string): void;
  destroy(): void;
}

interface Props {
  videoId: string | null;
  isHost: boolean;
  onEnd: () => void;
}

export function Player({ videoId, isHost, onEnd }: Props) {
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const onEndRef = useRef(onEnd);
  const isHostRef = useRef(isHost);
  const videoIdRef = useRef(videoId);

  onEndRef.current = onEnd;
  isHostRef.current = isHost;
  videoIdRef.current = videoId;

  useEffect(() => {
    function initPlayer() {
      playerRef.current = new window.YT.Player('yt-player', {
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onReady: ({ target }) => {
            if (videoIdRef.current) target.loadVideoById(videoIdRef.current);
          },
          onStateChange: ({ data }) => {
            if (data === window.YT.PlayerState.ENDED && isHostRef.current) {
              onEndRef.current();
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
      if (!document.querySelector('script[src*="iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    try {
      playerRef.current.loadVideoById(videoId);
    } catch {
      // player not yet ready; onReady will handle it
    }
  }, [videoId]);

  return (
    <div class="rounded-lg overflow-hidden bg-black aspect-video">
      <div id="yt-player" class="w-full h-full" />
    </div>
  );
}
