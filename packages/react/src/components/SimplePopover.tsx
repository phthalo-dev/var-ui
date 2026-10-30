import type { JSX, ReactElement, ReactNode } from 'react';
import type { Placement } from 'react-aria-components';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Popover } from './Popover';

export type SimplePopoverProps = {
  /** Single focusable trigger element. */
  trigger: ReactElement;
  /** Optional heading shown at the top of the popover. */
  title?: ReactNode;
  /** Popover body content. */
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
  /**
   * Element the popover portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
};

/**
 * Assembled popover — previous default `Popover` export. Prefer compound `Popover` parts for custom chrome.
 */
export function SimplePopover({
  trigger,
  title,
  children,
  placement = 'bottom',
  portalContainer,
  open,
  defaultOpen,
  onOpenChange,
}: SimplePopoverProps): JSX.Element {
  return (
    <Popover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      portalContainer={portalContainer}
    >
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Popup placement={placement} portalContainer={portalContainer}>
        {title ? <Popover.Title>{title}</Popover.Title> : null}
        <Popover.Content>{children}</Popover.Content>
      </Popover.Popup>
    </Popover.Root>
  );
}
