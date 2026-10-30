import { useLayoutEffect, useState, type RefObject } from 'react';

/** Safety cap on chained animation generations (opacity, then display/overlay, ...). */
const MAX_PASSES = 4;

/**
 * `true` while `open`, and after `open` turns `false` for as long as the shell element still has
 * running animations or transitions (`getAnimations({ subtree: true })`, which includes the
 * `display`/`overlay` discrete transitions and `::backdrop`). Use it to keep an overlay's children
 * mounted through the CSS exit, and to avoid mounting heavy bodies (or autofocusing react-aria
 * content) while closed. Replaces the rAF-based `useOverlayPresence` for native shells.
 *
 * With no animations (reduced motion, no transition, or a runtime without `getAnimations` such as
 * jsdom) it unmounts in the same commit that closes the shell. It reads animations in a layout
 * effect, so it must run after the effect that closes the shell: call it after
 * `useDialogElement` (which already does this for you).
 *
 * Reopening while exiting cancels the pending unmount.
 */
export function useMountedWhileAnimating(ref: RefObject<Element | null>, open: boolean): boolean {
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    if (open) {
      setExiting(false);
      return undefined;
    }
    const el = ref.current;
    const running = () => (el?.getAnimations?.({ subtree: true }) ?? []).filter(isRunning);
    if (!el || running().length === 0) {
      setExiting(false);
      return undefined;
    }
    setExiting(true);
    let cancelled = false;
    void (async () => {
      for (let pass = 0; pass < MAX_PASSES; pass++) {
        const animations = running();
        if (animations.length === 0) break;
        await Promise.allSettled(animations.map((animation) => animation.finished));
        if (cancelled) return;
      }
      if (!cancelled) setExiting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, ref]);

  return open || exiting;
}

function isRunning(animation: Animation): boolean {
  return animation.playState === 'running' || animation.pending;
}
