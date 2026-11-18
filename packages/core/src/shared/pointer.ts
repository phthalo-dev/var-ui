/** A touch-first device: the primary pointer is coarse and cannot hover. */
export const coarsePointerQuery = '(hover: none) and (pointer: coarse)';

/** Whether the primary pointer is touch-first right now; `false` where `matchMedia` is missing. */
export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(coarsePointerQuery).matches
    : false;
}
