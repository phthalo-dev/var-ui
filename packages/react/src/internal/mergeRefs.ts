import type { Ref, RefCallback } from 'react';

/**
 * Combines several refs into one callback ref. React 19 cleanup functions are honored; when the
 * node detaches, every object ref is reset to `null` and callback refs without a cleanup are
 * called with `null`, so mixing the two kinds is safe.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return undefined;
    });
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  };
}
