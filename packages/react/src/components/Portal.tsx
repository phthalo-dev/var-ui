import { useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

function containerElement(
  container: Element | RefObject<Element | null> | null | undefined,
): Element | null {
  if (container == null) return null;
  if ('current' in container)
    return container.current instanceof Element ? container.current : null;
  return container;
}

export type PortalProps = {
  /** Content to render into the container. */
  children?: ReactNode;
  /**
   * Where to render: an element or a ref to one. A ref that has no node yet renders nothing
   * until it does, instead of falling back to `document.body`.
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
  const [target, setTarget] = useState<Element | null>(null);
  // A container was asked for. A ref object is always present even while `current` is null,
  // which is distinct from omitting `container` (that defaults to document.body).
  const explicit = container != null;

  // Every commit: refs are assigned before layout effects, including a container that just mounted.
  useIsomorphicLayoutEffect(() => {
    const next = containerElement(container);
    setMounted(true);
    setTarget((current) => (current === next ? current : next));
  });

  if (!mounted) return null;
  if (explicit && target == null) return null;
  return createPortal(children, target ?? document.body);
}
