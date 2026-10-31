import type { JSX } from 'react';
import {
  Dialog,
  type DialogActionsProps,
  type DialogCloseProps,
  type DialogDescriptionProps,
  type DialogHeaderProps,
  type DialogPopupProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from './Dialog';

export type AlertDialogRootProps = DialogRootProps;
/** Alias for docs and consumers referring to the root props. */
export type AlertDialogProps = AlertDialogRootProps;
export type AlertDialogTriggerProps = DialogTriggerProps;
export type AlertDialogPopupProps = Omit<DialogPopupProps, 'role'>;
export type AlertDialogHeaderProps = DialogHeaderProps;
export type AlertDialogTitleProps = DialogTitleProps;
export type AlertDialogDescriptionProps = DialogDescriptionProps;
export type AlertDialogActionsProps = DialogActionsProps;
export type AlertDialogCloseProps = DialogCloseProps;

/**
 * Dialog root that requires an explicit choice: pressing the backdrop does not dismiss unless
 * `dismissable` is set.
 */
function AlertDialogRoot({ dismissable = false, ...props }: AlertDialogRootProps): JSX.Element {
  return <Dialog.Root {...props} dismissable={dismissable} />;
}

/** `Dialog.Popup` with `role="alertdialog"`. */
function AlertDialogPopup(props: AlertDialogPopupProps): JSX.Element {
  return <Dialog.Popup {...props} role="alertdialog" />;
}

/**
 * Confirmation dialog: `Dialog` with `role="alertdialog"` and backdrop dismissal off. `AlertDialog`
 * is Root. The old assembled preset is a recipe (see the AlertDialog docs): it was a fixed
 * arrangement of these parts and could not express async confirm, custom copy or extra actions.
 *
 * Put `autoFocus` on the Cancel button of a destructive confirmation so the safe choice has focus
 * when it opens.
 *
 * ```tsx
 * <AlertDialog>
 *   <AlertDialog.Trigger><Button>Delete</Button></AlertDialog.Trigger>
 *   <AlertDialog.Popup>
 *     <AlertDialog.Header><AlertDialog.Title>Delete item?</AlertDialog.Title></AlertDialog.Header>
 *     <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
 *     <AlertDialog.Actions>
 *       <AlertDialog.Close><Button autoFocus>Cancel</Button></AlertDialog.Close>
 *       <AlertDialog.Close><Button tone="danger" appearance="filled" onClick={remove}>Delete</Button></AlertDialog.Close>
 *     </AlertDialog.Actions>
 *   </AlertDialog.Popup>
 * </AlertDialog>
 * ```
 */
export const AlertDialog = Object.assign(AlertDialogRoot, {
  Root: AlertDialogRoot,
  Trigger: Dialog.Trigger,
  Popup: AlertDialogPopup,
  Header: Dialog.Header,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Actions: Dialog.Actions,
  Close: Dialog.Close,
});
