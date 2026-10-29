import { useCallback, useSyncExternalStore } from 'react';

/** SSR-safe media query subscription; returns false where matchMedia is unavailable. */
export function useMediaQuery(query: string): boolean {
  // Stable per query so useSyncExternalStore doesn't resubscribe on every render.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () =>
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
    () => false,
  );
}
