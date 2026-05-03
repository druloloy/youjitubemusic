import { useEffect, useRef } from 'preact/hooks';

export function useWakeLock(enabled: boolean): void {
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return;

    let active = true;

    async function acquire() {
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
      } catch {
        // denied or not supported — fail silently
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible' && active) acquire();
    }

    acquire();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      active = false;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, [enabled]);
}
