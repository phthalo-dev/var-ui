import { useLayoutEffect, useState, type RefObject } from 'react';

/** Safety cap on chained animation generations (opacity, then display/overlay, ...). */
const MAX_PASSES = 4;

/**
 * `true` while `open`, and after `open` turns `false` for as long as the shell element still has
 * running finite animations or transitions (`getAnimations({ subtree: true })`, which includes the
 * `display`/`overlay` discrete transitions and `::backdrop`). Use it to keep an overlay's children
 * mounted through the CSS exit, and to avoid mounting heavy bodies (or autofocusing react-aria
 * content) while closed. Replaces the rAF-based `useOverlayPresence` for native shells.
 *
 * The close render keeps the previous mounted value, so children do not unmount and remount at the
 * start of the exit (that reset their state and re-ran `autoFocus`). With no finite animations
 * (reduced motion, no transition, or a runtime without `getAnimations` such as jsdom) the layout
 * effect unmounts before paint. Infinite animations (a spinner) are ignored so they cannot pin the
 * body open. It reads animations in a layout effect, so it must run after the effect that closes
 * the shell: call it after `useDialogElement` (which already does this for you).
 *
 * Reopening while exiting cancels the pending unmount.
 */
export function useMountedWhileAnimating(ref: RefObject<Element | null>, open: boolean): boolean {
  const [mounted, setMounted] = useState(open);

  if (open && !mounted) {
    setMounted(true);
  }

  useLayoutEffect(() => {
    if (open) return undefined;
    const el = ref.current;
    const running = () => (el?.getAnimations?.({ subtree: true }) ?? []).filter(isFiniteRunning);
    if (!el || running().length === 0) {
      setMounted(false);
      return undefined;
    }
    let cancelled = false;
    void (async () => {
      for (let pass = 0; pass < MAX_PASSES; pass++) {
        const animations = running();
        if (animations.length === 0) break;
        await Promise.allSettled(animations.map((animation) => animation.finished));
        if (cancelled) return;
      }
      if (!cancelled) setMounted(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, ref]);

  return mounted;
}

function isFiniteRunning(animation: Animation): boolean {
  if (animation.playState !== 'running' && !animation.pending) return false;
  const iterations = animation.effect?.getComputedTiming().iterations;
  return iterations !== Infinity;
}
