import type { JSX, ReactNode } from 'react';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import {
  Dialog,
  type DialogActionsProps,
  type DialogBackdropProps,
  type DialogPopupProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from './Dialog';

export type AlertDialogProps = {
  /** Dialog heading shown in the modal header. */
  title: string;
  /** Supporting copy below the heading. */
  description: ReactNode;
  /** Label for the dismiss action. @default Cancel */
  cancelLabel?: string;
  /** Label for the confirm action. @default Confirm */
  confirmLabel?: string;
  /** Renders the confirm action with `tone="danger"` and autofocuses Cancel. @default false */
  isDestructive?: boolean;
  /** Called when the confirm action is pressed. Never called on cancel or Escape dismissal. */
  onConfirm: () => void;
  /** Label on the button that opens the modal. If omitted, use `isOpen`/`onOpenChange` to control it. */
  triggerLabel?: string;
  /** Controls the open state. Required when `triggerLabel` is omitted. */
  isOpen?: boolean;
  /** Called when the open state changes (including Escape/cancel dismissal). */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

export type AlertDialogRootProps = DialogRootProps;
export type AlertDialogTriggerProps = DialogTriggerProps;
export type AlertDialogBackdropProps = DialogBackdropProps;
export type AlertDialogPopupProps = Omit<DialogPopupProps, 'role'>;
export type AlertDialogTitleProps = DialogTitleProps;
export type AlertDialogActionsProps = DialogActionsProps;

/** Dialog root that requires an explicit choice: backdrop clicks do not dismiss unless `isDismissable` is set. */
function AlertDialogRoot({ isDismissable = false, ...props }: AlertDialogRootProps): JSX.Element {
  return <Dialog.Root {...props} isDismissable={isDismissable} />;
}
const AlertDialogTrigger = Dialog.Trigger;
const AlertDialogBackdrop = Dialog.Backdrop;

function AlertDialogPopup(props: AlertDialogPopupProps): JSX.Element {
  return <Dialog.Popup {...props} role="alertdialog" />;
}

const AlertDialogTitle = Dialog.Title;
const AlertDialogActions = Dialog.Actions;

function AlertDialogPreset({
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  isDestructive = false,
  onConfirm,
  triggerLabel,
  isOpen,
  onOpenChange,
  portalContainer,
}: AlertDialogProps): JSX.Element {
  const popup = (
    <AlertDialogBackdrop>
      <AlertDialogPopup>
        <Dialog.Header>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </Dialog.Header>
        <Dialog.Description>{description}</Dialog.Description>
        <AlertDialogActions>
          <Dialog.Close>
            <Button autoFocus={isDestructive}>{cancelLabel}</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              tone={isDestructive ? 'danger' : 'accent'}
              appearance="filled"
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          </Dialog.Close>
        </AlertDialogActions>
      </AlertDialogPopup>
    </AlertDialogBackdrop>
  );

  return (
    <AlertDialogRoot isOpen={isOpen} onOpenChange={onOpenChange} portalContainer={portalContainer}>
      {triggerLabel ? (
        <AlertDialogTrigger>
          <Button>{triggerLabel}</Button>
        </AlertDialogTrigger>
      ) : null}
      {popup}
    </AlertDialogRoot>
  );
}

/**
 * Confirmation dialog preset with compound parts for custom compositions.
 * The default call signature remains title/onConfirm/triggerLabel based.
 */
export const AlertDialog = Object.assign(AlertDialogPreset, {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Backdrop: AlertDialogBackdrop,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Actions: AlertDialogActions,
});
