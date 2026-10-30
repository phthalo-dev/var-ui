import { useMemo, type Ref, type RefCallback } from 'react';
import { mergeRefs } from '../internal/mergeRefs';

/**
 * Memoized callback ref that assigns the node to every given ref (object or callback, cleanup
 * functions honored). Pass stable refs; an unstable callback ref re-attaches on every render.
 */
export function useMergedRef<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- the ref list is the dependency list
  return useMemo(() => mergeRefs(...refs), refs);
}
