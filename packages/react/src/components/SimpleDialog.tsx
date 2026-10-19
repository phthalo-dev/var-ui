import type { JSX, ReactNode } from 'react';
import { Button } from './Button';
import { Dialog } from './Dialog';

export type SimpleDialogProps = {
  /** Label on the button that opens the modal. */
  triggerLabel: string;
  /** Dialog heading shown in the modal header. */
  title: string;
  /** Supporting copy below the heading. */
  description: ReactNode;
  /** Label for the close button and footer action. @default Close */
  closeLabel?: string;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

/**
 * Assembled dialog — previous default `Dialog` export. Prefer compound `Dialog` parts for custom chrome.
 */
export function SimpleDialog({
  triggerLabel,
  title,
  description,
  closeLabel = 'Close',
  portalContainer,
}: SimpleDialogProps): JSX.Element {
  return (
    <Dialog.Root portalContainer={portalContainer}>
      <Dialog.Trigger>
        <Button>{triggerLabel}</Button>
      </Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close aria-label={closeLabel} />
          </Dialog.Header>
          <Dialog.Description>{description}</Dialog.Description>
          <Dialog.Actions>
            <Dialog.Close>
              <Button>{closeLabel}</Button>
            </Dialog.Close>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}
