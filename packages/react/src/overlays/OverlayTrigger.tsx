import { Children, type JSX } from 'react';
import { useMergedRef } from './useMergedRef';
import { wireOverlayChild, type OverlayChildMode } from './mergeOverlayChild';
import type { OverlayTriggerProps } from './types';
import type { OverlayRoot } from './useOverlayRoot';

export type OverlayTriggerPartProps = OverlayTriggerProps & {
  /** The family's `useOverlayRoot()` result. */
  root: Pick<OverlayRoot, 'setTriggerEl'>;
  /**
   * `press` for click-to-open overlays (Dialog, Popover, Menu, Drawer), `focusable` for Tooltip,
   * `none` for HoverCard (its own hover handlers). @default press
   */
  mode?: OverlayChildMode;
};

/**
 * The one trigger part. Renders no element: merges the trigger props onto its single child,
 * registers the child with react-aria when it is a host element, and reports the element to the
 * root. The root observes the child's pointer, key, hover and focus events itself, so the part
 * does not wrap or stash anything.
 */
export function OverlayTrigger({
  children,
  className,
  ref,
  root,
  mode = 'press',
  ...props
}: OverlayTriggerPartProps): JSX.Element {
  const child = Children.only(children);
  const setRef = useMergedRef<HTMLElement>(ref, root.setTriggerEl);
  return wireOverlayChild(child, { ...props, className, ref: setRef }, mode);
}
