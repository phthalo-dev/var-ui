import type { Ref, RefCallback } from 'react';

/** Combines several refs into one callback ref (React 19 cleanup functions are honored). */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      } else if (ref) {
        ref.current = node;
      }
    }
    if (cleanups.length > 0) {
      return () => {
        for (const cleanup of cleanups) cleanup();
      };
    }
  };
}
