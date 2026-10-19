import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
} from 'react-aria-components';
import { dialog, type DialogVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  OverlayCloseContext,
  useOverlayClose,
  useOverlayPresence,
  type OverlayOpenChangeHandler,
  type UseOverlayPresenceResult,
} from '../overlays';
import { mergeProps } from './utils';

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

export type DialogTriggerProps = {
  children: ReactElement;
  className?: string;
};

export type DialogBackdropProps = {
  children: ReactNode;
  className?: string;
  isDismissable?: boolean;
};

export type DialogPopupProps = {
  children: ReactNode;
  className?: string;
  role?: NonNullable<DialogVariantProps['role']>;
};

export type DialogHeaderProps = {
  children: ReactNode;
  className?: string;
};

export type DialogTitleProps = {
  children: ReactNode;
  className?: string;
};

export type DialogDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export type DialogActionsProps = {
  children: ReactNode;
  className?: string;
};

export type DialogCloseProps = {
  children?: ReactElement;
  'aria-label'?: string;
  className?: string;
};

type DialogContextValue = {
  presence: UseOverlayPresenceResult;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  portalContainer?: Element;
  isDismissable: boolean;
  lastEventRef: MutableRefObject<Event | null>;
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
      handleOpenChange,
    }),
    [handleOpenChange, isDismissable, portalContainer, presence],
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

const DialogTrigger = forwardRef(function DialogTrigger(
  { children, className, ...props }: DialogTriggerProps,
  ref: Ref<HTMLElement>,
) {
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
});

function DialogBackdrop({ children, className, isDismissable }: DialogBackdropProps): JSX.Element {
  const ctx = useDialogContext();
  const { style: layerStyle } = useLayer();
  const d = dialog();
  return (
    <ModalOverlay
      {...mergeProps(d.overlay, className)}
      {...ctx.presence.attrs}
      ref={ctx.backdropRef as Ref<HTMLDivElement>}
      style={layerStyle}
      isOpen={ctx.presence.mounted}
      onOpenChange={ctx.handleOpenChange}
      isDismissable={isDismissable ?? ctx.isDismissable}
      UNSTABLE_portalContainer={ctx.portalContainer}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          ctx.lastEventRef.current = event.nativeEvent;
        }
      }}
    >
      {children}
    </ModalOverlay>
  );
}

function DialogPopup({ children, className, role = 'dialog' }: DialogPopupProps): JSX.Element {
  const ctx = useDialogContext();
  const d = dialog();
  return (
    <Modal
      {...mergeProps(d.modal, className)}
      {...ctx.presence.attrs}
      ref={ctx.popupRef as Ref<HTMLDivElement>}
    >
      <AriaDialog role={role}>
        {({ close }) => (
          <OverlayCloseContext.Provider value={close}>
            <div {...mergeProps(d.content)}>{children}</div>
          </OverlayCloseContext.Provider>
        )}
      </AriaDialog>
    </Modal>
  );
}

function DialogHeader({ children, className }: DialogHeaderProps): JSX.Element {
  const d = dialog();
  return <div {...mergeProps(d.header, className)}>{children}</div>;
}

function DialogTitle({ children, className }: DialogTitleProps): JSX.Element {
  const d = dialog();
  return (
    <Heading slot="title" {...mergeProps(d.heading, className)}>
      {children}
    </Heading>
  );
}

function DialogDescription({ children, className }: DialogDescriptionProps): JSX.Element {
  const d = dialog();
  return <p {...mergeProps(d.description, className)}>{children}</p>;
}

function DialogActions({ children, className }: DialogActionsProps): JSX.Element {
  const d = dialog();
  return <div {...mergeProps(d.actions, className)}>{children}</div>;
}

function DialogClose({
  children,
  className,
  'aria-label': ariaLabel = 'Close',
}: DialogCloseProps): JSX.Element {
  const close = useOverlayClose();
  const d = dialog();

  if (children) {
    const child = Children.only(children);
    const merged = mergeOverlayChild(child, { onPress: close, onClick: close, className });
    if (typeof child.type === 'string') {
      return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
    }
    return merged;
  }

  return (
    <AriaButton {...mergeProps(d.closeButton, className)} aria-label={ariaLabel} onPress={close}>
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
