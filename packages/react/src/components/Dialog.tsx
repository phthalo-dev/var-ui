import {
  Children,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type ReactNode,
} from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { dialog } from '@var-ui/core/components/dialog';
import type { DialogVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import {
  composeHandlers,
  createOverlayContext,
  OverlayCloseContext,
  OverlayTrigger,
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
  /** Called when the dialog requests to open or close. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Whether pressing outside the popup (on the backdrop) closes the dialog. Escape always closes. @default true */
  dismissable?: boolean;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root dialog props. */
export type DialogProps = DialogRootProps;

export type DialogTriggerProps = OverlayTriggerProps;

export type DialogBackdropProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
};

/**
 * Native props go to the modal `<div>`; `aria-label`, `aria-labelledby` and `aria-describedby`
 * go to the inner dialog element, which carries the role and the accessible name.
 */
export type DialogPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'role'> & {
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
  portalContainer?: Element;
  dismissable: boolean;
  /** Id of the mounted `Dialog.Description`, wired to the dialog's `aria-describedby`. */
  descriptionId: string | undefined;
  setDescriptionId: (id: string | undefined) => void;
};

const { Context: DialogContext, use: useDialogContext } =
  createOverlayContext<DialogContextValue>('Dialog');

function DialogRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  dismissable = true,
  portalContainer,
}: DialogRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);

  const context = useMemo<DialogContextValue>(
    () => ({ root, portalContainer, dismissable, descriptionId, setDescriptionId }),
    [root, portalContainer, dismissable, descriptionId],
  );

  return (
    <DialogContext.Provider value={context}>
      <AriaDialogTrigger {...root.rac}>{children}</AriaDialogTrigger>
    </DialogContext.Provider>
  );
}

function DialogTrigger(props: DialogTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={useDialogContext().root} />;
}

function DialogBackdrop({
  children,
  className,
  style,
  ref,
  ...rest
}: DialogBackdropProps): JSX.Element {
  const ctx = useDialogContext();
  const { style: layerStyle } = useLayer();
  const d = dialog();
  const setRef = useMergedRef<HTMLDivElement>(ctx.root.setBackdropEl, ref);
  return (
    <ModalOverlay
      {...rest}
      {...mergeProps(d.overlay, className)}
      {...ctx.root.presenceAttrs}
      {...ctx.root.rac}
      ref={setRef}
      style={{ ...layerStyle, ...style }}
      isDismissable={ctx.dismissable}
      UNSTABLE_portalContainer={ctx.portalContainer}
    >
      {children}
    </ModalOverlay>
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
  const d = dialog();
  const setRef = useMergedRef<HTMLDivElement>(ctx.root.setPopupEl, ref);
  return (
    <Modal {...rest} {...mergeProps(d.modal, className)} {...ctx.root.presenceAttrs} ref={setRef}>
      <AriaDialog
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy ?? ctx.descriptionId}
      >
        <OverlayCloseContext.Provider value={ctx.root.close}>
          <div {...mergeProps(d.content)}>{children}</div>
        </OverlayCloseContext.Provider>
      </AriaDialog>
    </Modal>
  );
}

function DialogHeader({ className, ...rest }: DialogHeaderProps): JSX.Element {
  const d = dialog();
  return <div {...rest} {...mergeProps(d.header, className)} />;
}

function DialogTitle({ className, children, ...rest }: DialogTitleProps): JSX.Element {
  const d = dialog();
  return (
    <Heading {...rest} slot="title" {...mergeProps(d.heading, className)}>
      {children}
    </Heading>
  );
}

function DialogDescription({
  className,
  id: idProp,
  ...rest
}: DialogDescriptionProps): JSX.Element {
  const ctx = useDialogContext();
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const { setDescriptionId } = ctx;
  const d = dialog();
  useEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);
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
        ref,
        className,
      },
      'press',
      requestClose,
    );
  }

  return (
    <AriaButton
      {...(rest as AriaButtonProps)}
      {...mergeProps(d.closeButton, className)}
      ref={ref}
      aria-label={ariaLabel ?? 'Close'}
      onPress={composeHandlers((rest as AriaButtonProps).onPress, () => requestClose())}
    >
      <Icon name="close" size="sm" />
    </AriaButton>
  );
}

/**
 * Compound modal dialog. `Dialog` is Root; compose Trigger, Backdrop, Popup, and chrome parts.
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>
 *     <Button>Open</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Backdrop>
 *     <Dialog.Popup>
 *       <Dialog.Title>Title</Dialog.Title>
 *     </Dialog.Popup>
 *   </Dialog.Backdrop>
 * </Dialog.Root>
 * ```
 */
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Close: DialogClose,
});
