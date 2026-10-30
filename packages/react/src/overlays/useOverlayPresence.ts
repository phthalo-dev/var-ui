import { useEffect, useRef, useState } from 'react';

export type OverlayPresenceAttrs = {
  'data-open'?: '';
  'data-closed'?: '';
  'data-starting-style'?: '';
  'data-ending-style'?: '';
};

export type UseOverlayPresenceOptions = {
  isOpen: boolean;
  reducedMotion?: boolean;
  /** `false` turns the hook into a pass-through (`mounted === isOpen`, no timers). @default true */
  enabled?: boolean;
  getAnimatedElements: () => readonly (HTMLElement | null)[];
};

export type UseOverlayPresenceResult = {
  mounted: boolean;
  attrs: OverlayPresenceAttrs;
};

/** @deprecated until PR C: native shells use CSS `@starting-style` and `useMountedWhileAnimating`. */
export function useOverlayPresence({
  isOpen,
  reducedMotion,
  enabled = true,
  getAnimatedElements,
}: UseOverlayPresenceOptions): UseOverlayPresenceResult {
  const [mounted, setMounted] = useState(isOpen);
  const [attrs, setAttrs] = useState<OverlayPresenceAttrs>(
    isOpen ? { 'data-open': '', 'data-starting-style': '' } : {},
  );
  const generationRef = useRef(0);
  const getAnimatedElementsRef = useRef(getAnimatedElements);
  getAnimatedElementsRef.current = getAnimatedElements;

  const prefersReducedMotion =
    reducedMotion ??
    (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true);

  useEffect(() => {
    if (!enabled) return undefined;
    const generation = ++generationRef.current;

    if (isOpen) {
      setMounted(true);
      setAttrs({ 'data-open': '', 'data-starting-style': '' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (generationRef.current === generation) {
            setAttrs({ 'data-open': '' });
          }
        });
      });
    } else {
      setAttrs({
        'data-open': '',
        'data-closed': '',
        'data-ending-style': '',
      });

      if (prefersReducedMotion) {
        setMounted(false);
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (generationRef.current !== generation) {
              return;
            }

            const finishedAnimations = getAnimatedElementsRef
              .current()
              .filter((element): element is HTMLElement => element !== null)
              .flatMap((element) =>
                (element.getAnimations?.() ?? []).map((animation) => animation.finished),
              );

            if (finishedAnimations.length === 0) {
              setMounted(false);
            } else {
              void Promise.allSettled(finishedAnimations).then(() => {
                if (generationRef.current === generation) {
                  setMounted(false);
                }
              });
            }
          });
        });
      }
    }

    return () => {
      if (generationRef.current === generation) {
        generationRef.current += 1;
      }
    };
  }, [isOpen, prefersReducedMotion, enabled]);

  if (!enabled) {
    return { mounted: isOpen, attrs: isOpen ? { 'data-open': '' } : { 'data-closed': '' } };
  }
  return { mounted, attrs };
}
