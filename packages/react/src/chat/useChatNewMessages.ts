import { useCallback, useEffect, useRef, useState } from 'react';

export type UseChatNewMessagesOptions = {
  /** Current lock state from `useChatStreamScroll`. */
  locked: boolean;
  /** Called when content grows while locked — typically `scroll.scrollIfLocked`. */
  onResize?: () => void;
};

export type UseChatNewMessagesReturn = {
  /** Whether content grew while unlocked (drives a "New messages" button). */
  hasNewMessages: boolean;
  /** Callback ref — attach to the element whose height grows as messages stream in. */
  contentRef: (el: HTMLElement | null) => void;
  /** Clear `hasNewMessages` — call when the user scrolls to the latest message. */
  dismiss: () => void;
};

/**
 * Tracks content growth via `ResizeObserver`. While locked, calls
 * `onResize` (typically re-triggering auto-scroll); while unlocked, flags
 * `hasNewMessages` so a caller can surface a "New messages" affordance.
 * Also clears `hasNewMessages` whenever lock re-engages (e.g. the user
 * manually scrolls back to the bottom), not just via `dismiss()`.
 */
export function useChatNewMessages({
  locked,
  onResize,
}: UseChatNewMessagesOptions): UseChatNewMessagesReturn {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const lastHeightRef = useRef(0);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    if (locked) {
      setHasNewMessages(false);
    }
  }, [locked]);

  const contentRef = useCallback(
    (el: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) {
        return;
      }
      lastHeightRef.current = el.scrollHeight;
      const observer = new ResizeObserver(() => {
        const nextHeight = el.scrollHeight;
        if (nextHeight > lastHeightRef.current) {
          if (lockedRef.current) {
            onResize?.();
          } else {
            setHasNewMessages(true);
          }
        }
        lastHeightRef.current = nextHeight;
      });
      observer.observe(el);
      observerRef.current = observer;
    },
    [onResize],
  );

  const dismiss = useCallback(() => setHasNewMessages(false), []);

  return { hasNewMessages, contentRef, dismiss };
}
