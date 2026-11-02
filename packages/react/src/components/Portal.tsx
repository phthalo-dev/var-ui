import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  /** Content to render into the container. */
  children?: ReactNode;
  /**
   * Where to render: an element or a ref to one.
   * @default document.body
   */
  container?: Element | RefObject<Element | null> | null;
};

/**
 * Renders `children` into `document.body` (or `container`) instead of in place, for the rare
 * case of escaping an `overflow: hidden` or `transform`ed ancestor with a non-overlay element.
 *
 * It renders nothing on the server and during the first client render, then mounts after the
 * component has mounted, so it never causes a hydration mismatch. Content is therefore not in
 * the server HTML. Context, events and React state flow through it as if it were in place.
 *
 * Overlays (`Dialog`, `Popover`, `Menu`, `Tooltip`, ...) do NOT need it: they render in the
 * browser's top layer where they sit in the tree.
 *
 * ```tsx
 * <Portal>
 *   <div className="my-floating-banner">Saved</div>
 * </Portal>
 * ```
 */
export function Portal({ children, container }: PortalProps): ReactNode {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const target = container && 'current' in container ? container.current : container;
  return createPortal(children, target ?? document.body);
}
