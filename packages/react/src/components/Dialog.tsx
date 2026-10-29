import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useId,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type MutableRefObject,
  type ReactElement,
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
  Pressable,
} from 'react-aria-components';
import { dialog } from '@var-ui/core/components/dialog';
import type { DialogVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  OverlayCloseContext,
  useOverlayClose,
  useMergedRef,
  useOverlayPresence,
  type OverlayCloseProps,
  type OverlayOpenChangeHandler,
  type OverlayTriggerProps,
  type UseOverlayPresenceResult,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type DialogRootProps = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /** RAC: isDismissable on the overlay. @default true */
  isDismissable?: boolean;
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
  isDismissable?: boolean;
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
  presence: UseOverlayPresenceResult;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  portalContainer?: Element;
  isDismissable: boolean;
  lastEventRef: MutableRefObject<Event | null>;
  /** Id of the mounted `Dialog.Description`, wired to the dialog's `aria-describedby`. */
  descriptionId: string | undefined;
  setDescriptionId: (id: string | undefined) => void;
  handleOpenChange: (next: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog compound components must be rendered inside <Dialog>.');
  }
  return ctx;
}

function DialogRoot({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  isDismissable = true,
  portalContainer,
}: DialogRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = isOpen ?? uncontrolledOpen;
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [backdropRef.current, popupRef.current],
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      const details = createOverlayChangeDetails({
        reason: inferOverlayCloseReason(lastEventRef.current),
        event: lastEventRef.current,
      });
      onOpenChange?.(next, details);
      lastEventRef.current = null;
      if (details.isCanceled) return;
      if (isOpen === undefined) setRequestedOpen(next);
    },
    [isOpen, onOpenChange],
  );

  const context = useMemo<DialogContextValue>(
    () => ({
      presence,
      backdropRef,
      popupRef,
      portalContainer,
      isDismissable,
      lastEventRef,
      descriptionId,
      setDescriptionId,
      handleOpenChange,
    }),
    [handleOpenChange, isDismissable, portalContainer, presence, descriptionId],
  );

  return (
    <DialogContext.Provider value={context}>
      {/*
        RAC DialogTrigger has no DOM node. Root captures the last keydown here so
        inferOverlayCloseReason can map Escape. Backdrop records overlay pointerdown
        (outside-press); Trigger stashes press/click (trigger-press). cancel() only
        blocks uncontrolled requestedOpen updates after onOpenChange.
      */}
      <div
        style={{ display: 'contents' }}
        onKeyDownCapture={(event) => {
          lastEventRef.current = event.nativeEvent;
        }}
      >
        <AriaDialogTrigger isOpen={presence.mounted} onOpenChange={handleOpenChange}>
          {children}
        </AriaDialogTrigger>
      </div>
    </DialogContext.Provider>
  );
}

function composeHandler(existing: unknown, ours: (...args: unknown[]) => void) {
  if (typeof existing !== 'function') {
    return ours;
  }
  return (...args: unknown[]) => {
    existing(...args);
    ours(...args);
  };
}

function DialogTrigger({ children, className, ref, ...props }: DialogTriggerProps): JSX.Element {
  const ctx = useDialogContext();
  const child = Children.only(children);
  const stashTriggerPress = (...args: unknown[]) => {
    const event = args[0] as { nativeEvent?: Event } | Event | undefined;
    if (event instanceof Event) {
      ctx.lastEventRef.current = event;
      return;
    }
    if (event?.nativeEvent instanceof Event) {
      ctx.lastEventRef.current = event.nativeEvent;
      return;
    }
    ctx.lastEventRef.current = new Event('press');
  };
  const triggerProps = props as Record<string, unknown>;
  const racTriggerProps: Record<string, unknown> = {
    ...triggerProps,
    className,
    ref,
    onClick: composeHandler(triggerProps.onClick, stashTriggerPress),
    onPress: composeHandler(triggerProps.onPress, stashTriggerPress),
    onPointerDown: composeHandler(triggerProps.onPointerDown, () => {
      ctx.lastEventRef.current = new Event('press');
    }),
  };
  const merged = mergeOverlayChild(child, racTriggerProps);
  // RAC DialogTrigger injects press via PressResponder context, not cloneElement.
  // Host nodes (e.g. <button>) need Pressable so they register; RAC Button already does.
  if (typeof child.type === 'string') {
    return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
  }
  return merged;
}

function DialogBackdrop({
  children,
  className,
  style,
  isDismissable,
  onPointerDown,
  ref,
  ...rest
}: DialogBackdropProps): JSX.Element {
  const ctx = useDialogContext();
  const { style: layerStyle } = useLayer();
  const d = dialog();
  const setRef = useMergedRef(ctx.backdropRef, ref);
  return (
    <ModalOverlay
      {...rest}
      {...mergeProps(d.overlay, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      style={{ ...layerStyle, ...style }}
      isOpen={ctx.presence.mounted}
      onOpenChange={ctx.handleOpenChange}
      isDismissable={isDismissable ?? ctx.isDismissable}
      UNSTABLE_portalContainer={ctx.portalContainer}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.target === event.currentTarget) {
          ctx.lastEventRef.current = event.nativeEvent;
        }
      }}
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
  const setRef = useMergedRef(ctx.popupRef, ref);
  return (
    <Modal {...rest} {...mergeProps(d.modal, className)} {...ctx.presence.attrs} ref={setRef}>
      <AriaDialog
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy ?? ctx.descriptionId}
      >
        {({ close }) => (
          <OverlayCloseContext.Provider value={close}>
            <div {...mergeProps(d.content)}>{children}</div>
          </OverlayCloseContext.Provider>
        )}
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

  if (children) {
    const child = Children.only(children);
    const merged = mergeOverlayChild(child, {
      ...rest,
      ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : null),
      ref,
      onPress: close,
      onClick: composeHandler(rest.onClick, close),
      className,
    });
    if (typeof child.type === 'string') {
      return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
    }
    return merged;
  }

  return (
    <AriaButton
      {...(rest as AriaButtonProps)}
      {...mergeProps(d.closeButton, className)}
      ref={ref}
      aria-label={ariaLabel ?? 'Close'}
      onPress={close}
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
