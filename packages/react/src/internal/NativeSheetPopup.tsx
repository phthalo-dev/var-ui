import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { OverlayCloseContext, useDialogElement, useMergedRef, type OverlayRoot } from '../overlays';
import { NativeDialogContext } from './nativeDialogShim';

export type NativeSheetPopupProps = Omit<ComponentPropsWithRef<'dialog'>, 'children' | 'open'> & {
  children: ReactNode;
  root: OverlayRoot;
  /** Whether a backdrop press requests a close. @default true */
  dismissable?: boolean;
};

/**
 * Shared internals of the slide-in sheets (`Drawer.Popup`, `MobileNav`, the `LayoutPanel` overlay):
 * a native modal `<dialog>` driven by an overlay root. The caller supplies the recipe class
 * (`className`) and the placement attribute (`data-placement` / `data-side`). Children render only
 * while the dialog is open or animating out.
 */
export function NativeSheetPopup({
  children,
  root,
  dismissable = true,
  ref,
  ...rest
}: NativeSheetPopupProps): JSX.Element {
  const native = useDialogElement(root, { dismissable });
  const setRef = useMergedRef<HTMLDialogElement>(native.ref, ref);
  return (
    <dialog
      {...rest}
      data-open={root.open ? '' : undefined}
      data-closed={root.open ? undefined : ''}
      ref={setRef}
    >
      {native.mounted ? (
        <NativeDialogContext.Provider value={native.element}>
          <OverlayCloseContext.Provider value={root.close}>{children}</OverlayCloseContext.Provider>
        </NativeDialogContext.Provider>
      ) : null}
    </dialog>
  );
}
