import { Children, type JSX } from 'react';
import { useMergedRef } from './useMergedRef';
import { wireOverlayChild, type OverlayChildMode } from './mergeOverlayChild';
import type { OverlayTriggerProps } from './types';
import type { OverlayRoot } from './useOverlayRoot';

export type OverlayTriggerPartProps = OverlayTriggerProps & {
  /** The family's `useOverlayRoot()` result. */
  root: Pick<OverlayRoot, 'setTriggerEl'> & Partial<Pick<OverlayRoot, 'popupId' | 'open'>>;
  /**
   * Native popover relation (needs `root.popupId`, put on the popup by `usePopoverElement`):
   * - `popovertarget`: click-opened popovers; sets `popovertarget` + `popovertargetaction="toggle"`
   *   on the child (a native invoker: exempt from light dismiss, toggles correctly). The child must
   *   be a host `<button>` or a component that forwards these DOM props.
   * - `describedby` (Tooltip) / `details` (HoverCard): `aria-describedby` / `aria-details` pointing
   *   at the popup while it is open (its children only mount then); merged with the child's own.
   */
  relation?: 'popovertarget' | 'describedby' | 'details';
  /**
   * react-aria registration of host children: `press` (Dialog, Menu), `focusable`, `none`.
   * @default `press`, or `none` when a `relation` is given
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
  relation,
  mode = relation ? 'none' : 'press',
  ...props
}: OverlayTriggerPartProps): JSX.Element {
  const child = Children.only(children);
  const setRef = useMergedRef<HTMLElement>(ref, root.setTriggerEl);
  const wired: Record<string, unknown> = { ...props, className, ref: setRef };
  if (relation === 'popovertarget') {
    wired.popoverTarget = root.popupId;
    wired.popoverTargetAction = 'toggle';
  } else if (relation && root.open) {
    const attr = relation === 'details' ? 'aria-details' : 'aria-describedby';
    const own = (child.props as Record<string, unknown>)[attr];
    wired[attr] = [own, props[attr as keyof typeof props], root.popupId]
      .filter((id) => typeof id === 'string' && id)
      .join(' ');
  }
  return wireOverlayChild(child, wired, mode);
}
