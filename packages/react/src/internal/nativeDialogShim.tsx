/**
 * INTERIM SHIM (P6 PR A): delete in PR B.
 *
 * Popups that are still react-aria `Popover`s render into a portal on `document.body`. That is
 * not hit-testable while a native modal `<dialog>` is open (everything outside it is inert), so
 * a Select inside a Dialog would be dead. `Dialog.Popup` provides its open `<dialog>` through
 * `NativeDialogContext`; every still-RAC popup renders into it instead (react-aria's
 * `UNSTABLE_portalContainer`). A `<dialog>` is in the top layer and a containing block for its
 * absolutely positioned descendants, so the popup stacks above the dialog content.
 *
 * PR B replaces these popups with native `popover` elements (also top layer, in place), then
 * this file, `NativeDialogContext` and its provider in `Dialog.Popup` go away.
 */
import { createContext, useContext, type RefAttributes } from 'react';
import { Popover as AriaPopover, type PopoverProps } from 'react-aria-components';

export const NativeDialogContext = createContext<HTMLElement | null>(null);

/** The open native `<dialog>` the calling popup is inside of, or `undefined` outside one. */
export function useNativeDialogContainer(): HTMLElement | undefined {
  return useContext(NativeDialogContext) ?? undefined;
}

/** react-aria `Popover` that portals into the surrounding native dialog (when there is one). */
export function Popover(props: PopoverProps & RefAttributes<HTMLElement>) {
  const container = useNativeDialogContainer();
  return (
    <AriaPopover
      {...props}
      UNSTABLE_portalContainer={props.UNSTABLE_portalContainer ?? container}
    />
  );
}
