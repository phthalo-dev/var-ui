import { useCallback, type MutableRefObject, type Ref } from 'react';

/**
 * Returns a callback ref that assigns the node to an internal ref object and to the consumer's
 * forwarded `ref` (callback or object).
 */
export function useMergedRef<T>(
  internal: MutableRefObject<T | null>,
  external?: Ref<T>,
  onNode?: (node: T | null) => void,
): (node: T | null) => void {
  return useCallback(
    (node: T | null) => {
      internal.current = node;
      onNode?.(node);
      if (typeof external === 'function') external(node);
      else if (external) (external as MutableRefObject<T | null>).current = node;
    },
    [internal, external, onNode],
  );
}
