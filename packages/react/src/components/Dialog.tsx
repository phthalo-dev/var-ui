import {
  Children,
  useId,
  useMemo,
  type ComponentPropsWithRef,
  type JSX,
  type ReactNode,
} from 'react';
import { dialog } from '@var-ui/core/components/dialog';
import type { DialogVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { findPartId } from '../internal/findPartId';
import {
  composeHandlers,
  createOverlayContext,
  OverlayCloseContext,
  useDialogElement,
  useMergedRef,
  useOverlayClose,
  useOverlayRoot,
  wireOverlayChild,
  type OverlayCloseProps,
  type OverlayOpenChangeHandler,
  type OverlayRoot,
  type OverlayTriggerProps,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type DialogRootProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Whether pressing the backdrop closes the dialog. Escape is native and always reported. @default true */
  dismissable?: boolean;
};

/** Alias for docs and consumers referring to the root dialog props. */
export type DialogProps = DialogRootProps;

/** The single child must be a button (or a component that renders one): it receives `onClick`. */
export type DialogTriggerProps = OverlayTriggerProps;

/**
 * Props of the native `<dialog>` element (the popup *is* the dialog): `ref`, `className`, `style`,
 * handlers and `data-*`/`aria-*` attributes all land on it.
 */
export type DialogPopupProps = Omit<
  ComponentPropsWithRef<'dialog'>,
  'children' | 'role' | 'open'
> & {
  children: ReactNode;
  role?: NonNullable<DialogVariantProps['role']>;
};

export type DialogHeaderProps = ComponentPropsWithRef<'div'>;

export type DialogTitleProps = ComponentPropsWithRef<'h2'>;

export type DialogDescriptionProps = ComponentPropsWithRef<'p'>;

export type DialogActionsProps = ComponentPropsWithRef<'div'>;

export type DialogCloseProps = OverlayCloseProps;

type DialogContextValue = {
  root: OverlayRoot;
  dismissable: boolean;
  /** Ids shared with `Dialog.Title` / `Dialog.Description` in the same render as the `<dialog>`. */
  titleId: string;
  descriptionId: string;
};

const { Context: DialogContext, use: useDialogContext } =
  createOverlayContext<DialogContextValue>('Dialog');

function DialogRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  dismissable = true,
}: DialogRootProps): JSX.Element {
  const root = useOverlayRoot({ native: true, open, defaultOpen, onOpenChange });
  const titleId = useId();
  const descriptionId = useId();

  const context = useMemo<DialogContextValue>(
    () => ({ root, dismissable, titleId, descriptionId }),
    [root, dismissable, titleId, descriptionId],
  );

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
}

function DialogTrigger({
  children,
  className,
  onClick,
  ref,
  ...props
}: DialogTriggerProps): JSX.Element {
  const { root } = useDialogContext();
  const setRef = useMergedRef<HTMLElement>(ref, root.setTriggerEl);
  // `press` registers a host child (`<button>`) with react-aria's trigger contexts, so a
  // `Tooltip.Trigger` around `Dialog.Trigger` still finds its focusable.
  return wireOverlayChild(
    Children.only(children),
    {
      ...props,
      'aria-haspopup': 'dialog',
      'aria-expanded': root.open,
      className,
      ref: setRef,
      onClick: composeHandlers(onClick, root.triggerPress),
    },
    'press',
  );
}

function DialogPopup({
  children,
  className,
  role = 'dialog',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ref,
  ...rest
}: DialogPopupProps): JSX.Element {
  const ctx = useDialogContext();
  const { root } = ctx;
  const d = dialog({ role });
  const native = useDialogElement(root, { dismissable: ctx.dismissable });
  const setRef = useMergedRef<HTMLDialogElement>(native.ref, ref);
  return (
    <dialog
      {...rest}
      {...mergeProps(d.popup, className)}
      // `role="dialog"` is implicit; only `alertdialog` needs the attribute.
      role={role === 'alertdialog' ? role : undefined}
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (ariaLabel ? undefined : findPartId(children, DialogTitle, ctx.titleId))
      }
      aria-describedby={
        ariaDescribedBy ?? findPartId(children, DialogDescription, ctx.descriptionId)
      }
      data-open={root.open ? '' : undefined}
      data-closed={root.open ? undefined : ''}
      ref={setRef}
    >
      {native.mounted ? (
        <OverlayCloseContext.Provider value={root.close}>
          <div {...mergeProps(d.content)}>{children}</div>
        </OverlayCloseContext.Provider>
      ) : null}
    </dialog>
  );
}

function DialogHeader({ className, ...rest }: DialogHeaderProps): JSX.Element {
  const d = dialog();
  return <div {...rest} {...mergeProps(d.header, className)} />;
}

function DialogTitle({ className, id: idProp, ...rest }: DialogTitleProps): JSX.Element {
  const { titleId } = useDialogContext();
  const id = idProp ?? titleId;
  const d = dialog();
  return <h2 {...rest} id={id} {...mergeProps(d.heading, className)} />;
}

function DialogDescription({
  className,
  id: idProp,
  ...rest
}: DialogDescriptionProps): JSX.Element {
  const { descriptionId } = useDialogContext();
  const id = idProp ?? descriptionId;
  const d = dialog();
  return <p {...rest} id={id} {...mergeProps(d.description, className)} />;
}

function DialogActions({ className, ...rest }: DialogActionsProps): JSX.Element {
  const d = dialog();
  return <div {...rest} {...mergeProps(d.actions, className)} />;
}

function DialogClose({
  children,
  className,
  'aria-label': ariaLabel,
  onClick,
  ref,
  ...rest
}: DialogCloseProps): JSX.Element {
  const close = useOverlayClose();
  const d = dialog();
  const requestClose = (event: Event | null = null) => close({ reason: 'close-press', event });

  if (children) {
    return wireOverlayChild(
      Children.only(children),
      {
        ...rest,
        ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : null),
        ...(onClick ? { onClick } : null),
        ref,
        className,
      },
      'none',
      requestClose,
    );
  }

  return (
    <button
      type="button"
      {...rest}
      {...mergeProps(d.closeButton, className)}
      ref={ref}
      aria-label={ariaLabel ?? 'Close'}
      onClick={composeHandlers(onClick, (event: { nativeEvent: Event }) =>
        requestClose(event.nativeEvent),
      )}
    >
      <Icon name="close" size="sm" />
    </button>
  );
}

/**
 * Compound modal dialog on the native `<dialog>`. `Dialog` is Root; `Popup` is the `<dialog>`
 * element itself (its `::backdrop` is the overlay, so there is no Backdrop part and no portal).
 * Trigger merges `onClick` onto its single child, which must be a button.
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>
 *     <Button>Open</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Popup>
 *     <Dialog.Title>Title</Dialog.Title>
 *   </Dialog.Popup>
 * </Dialog.Root>
 * ```
 */
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Close: DialogClose,
});
