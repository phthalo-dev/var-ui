import { Children, isValidElement, type ReactNode } from 'react';

/**
 * The `id` of the first matching part in `children` (walking fragments and part elements), or
 * `fallbackId` when that part omits `id`. `undefined` when the part is not in the tree.
 *
 * Parts publish their id by rendering it, so a parent can point `aria-labelledby` at the same id
 * in the same commit. A `useEffect` that copies the id up runs after `showModal()` has already
 * moved focus and announced the dialog.
 */
export function findPartId(
  children: ReactNode,
  type: unknown,
  fallbackId: string,
): string | undefined {
  let found: string | undefined;
  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (found !== undefined || !isValidElement(child)) return;
      if (child.type === type) {
        const id = (child.props as { id?: string }).id;
        found = id ? id : fallbackId;
        return;
      }
      const nested = (child.props as { children?: ReactNode }).children;
      if (nested != null) visit(nested);
    });
  };
  visit(children);
  return found;
}
