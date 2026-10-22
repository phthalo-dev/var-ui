import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
  type ModalOverlayProps,
} from 'react-aria-components';
import { drawer, type DrawerVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { useScrollLock } from '../hooks';
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
import { mergeProps } from 'typestyles';

const dialogContentStyle: CSSProperties = { display: 'contents' };

export type DrawerProps = Omit<ModalOverlayProps, 'children' | 'onOpenChange'> &
  DrawerVariantProps & {
    /** Panel title rendered in the header when `title` is set. */
    title?: ReactNode;
    /** Drawer body content. */
    children: ReactNode;
    /** Edge the panel slides in from. @default 'end' */
    placement?: 'start' | 'end' | 'bottom';
    /** Custom panel width in px (overrides size width for start/end). */
    width?: number;
    /** Custom panel height in px (overrides size height for bottom). */
    height?: number;
    /** Label for the close button. @default 'Close' */
    closeLabel?: string;
    /** Accessible name when `title` is omitted. @default 'Drawer' */
    label?: string;
    className?: string;
    /**
     * Element the drawer portals into instead of `document.body`. Needed when a subtree renders
     * under a different theme than the page ambient.
     */
    portalContainer?: Element;
    onOpenChange?: OverlayOpenChangeHandler;
  };

export type DrawerRootProps = DrawerVariantProps & {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  isDismissable?: boolean;
  portalContainer?: Element;
  'aria-label'?: string;
};

export type DrawerBackdropProps = Omit<
  ModalOverlayProps,
  'children' | 'isOpen' | 'onOpenChange' | 'UNSTABLE_portalContainer'
> & {
  children: ReactNode;
  className?: string;
};

export type DrawerPanelProps = {
  children: ReactNode;
  placement?: 'start' | 'end' | 'bottom';
  width?: number;
  height?: number;
  className?: string;
};

export type DrawerHeaderProps = {
  children: ReactNode;
  className?: string;
};

export type DrawerTitleProps = {
  children: ReactNode;
  className?: string;
};

export type DrawerCloseProps = {
  children?: ReactElement;
  'aria-label'?: string;
  className?: string;
};

export type DrawerBodyProps = {
  children: ReactNode;
  className?: string;
};

type DrawerContextValue = {
  presence: UseOverlayPresenceResult;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
  panelRef: MutableRefObject<HTMLDivElement | null>;
  portalContainer?: Element;
  isDismissable: boolean;
  size: DrawerVariantProps['size'];
  ariaLabel?: string;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('Drawer compound components must be rendered inside <Drawer.Root>.');
  }
  return ctx;
}

function DrawerRoot({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  isDismissable = true,
  portalContainer,
  size = 'md',
  'aria-label': ariaLabel,
}: DrawerRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = isOpen ?? uncontrolledOpen;
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [backdropRef.current, panelRef.current],
  });
  useScrollLock(presence.mounted);

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

  const context = useMemo<DrawerContextValue>(
    () => ({
      presence,
      backdropRef,
      panelRef,
      portalContainer,
      isDismissable,
      size,
      ariaLabel,
      lastEventRef,
      handleOpenChange,
    }),
    [ariaLabel, handleOpenChange, isDismissable, portalContainer, presence, size],
  );

  return (
    <DrawerContext.Provider value={context}>
      <div
        style={{ display: 'contents' }}
        onKeyDownCapture={(event) => {
          lastEventRef.current = event.nativeEvent;
        }}
      >
        {children}
      </div>
    </DrawerContext.Provider>
  );
}

function DrawerBackdrop({
  children,
  className,
  isDismissable,
  onPointerDown,
  ...props
}: DrawerBackdropProps): JSX.Element {
  const ctx = useDrawerContext();
  const styles = drawer({ size: ctx.size });
  const { style: layerStyle } = useLayer();

  return (
    <ModalOverlay
      {...props}
      {...mergeProps(styles.overlay, className)}
      {...ctx.presence.attrs}
      ref={ctx.backdropRef as Ref<HTMLDivElement>}
      style={layerStyle}
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

function DrawerPanel({
  children,
  placement = 'end',
  width,
  height,
  className,
}: DrawerPanelProps): JSX.Element {
  const ctx = useDrawerContext();
  const styles = drawer({ size: ctx.size });
  const panelStyle = {
    ...(width != null ? ({ '--var-ui-drawer-panelwidth': `${width}px` } as CSSProperties) : {}),
    ...(height != null ? ({ '--var-ui-drawer-panelheight': `${height}px` } as CSSProperties) : {}),
  };

  return (
    <Modal
      {...mergeProps(styles.panel, className)}
      {...ctx.presence.attrs}
      ref={ctx.panelRef as Ref<HTMLDivElement>}
      data-placement={placement}
      style={panelStyle}
    >
      <AriaDialog aria-label={ctx.ariaLabel} style={dialogContentStyle}>
        {({ close }) => (
          <OverlayCloseContext.Provider value={close}>{children}</OverlayCloseContext.Provider>
        )}
      </AriaDialog>
    </Modal>
  );
}

function DrawerHeader({ children, className }: DrawerHeaderProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...mergeProps(styles.header, className)}>{children}</div>;
}

function DrawerTitle({ children, className }: DrawerTitleProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return (
    <Heading slot="title" {...mergeProps(styles.title, className)}>
      {children}
    </Heading>
  );
}

function DrawerClose({
  children,
  className,
  'aria-label': ariaLabel = 'Close',
}: DrawerCloseProps): JSX.Element {
  const close = useOverlayClose();
  const { size } = useDrawerContext();
  const styles = drawer({ size });

  if (children) {
    const child = Children.only(children);
    const merged = mergeOverlayChild(child, { onPress: close, onClick: close, className });
    if (typeof child.type === 'string') {
      return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
    }
    return merged;
  }

  return (
    <AriaButton
      {...mergeProps(styles.closeButton, className)}
      aria-label={ariaLabel}
      onPress={close}
    >
      <Icon name="close" size="sm" />
    </AriaButton>
  );
}

function DrawerBody({ children, className }: DrawerBodyProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...mergeProps(styles.body, className)}>{children}</div>;
}

/**
 * General-purpose slide-in panel built on RAC Modal — focus trap, Escape, and
 * backdrop dismissal included.
 *
 * ```tsx
 * <Drawer isOpen={open} onOpenChange={setOpen} title="Settings">
 *   <p>Drawer content</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  title,
  children,
  placement = 'end',
  size = 'md',
  width,
  height,
  closeLabel = 'Close',
  label = 'Drawer',
  className,
  portalContainer,
  isOpen = false,
  onOpenChange,
  ...props
}: DrawerProps): JSX.Element {
  return (
    <DrawerRoot
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      portalContainer={portalContainer}
      size={size}
      aria-label={title ? undefined : label}
    >
      <DrawerBackdrop {...props} isDismissable>
        <DrawerPanel placement={placement} width={width} height={height} className={className}>
          {title ? (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerClose aria-label={closeLabel} />
            </DrawerHeader>
          ) : null}
          <DrawerBody>{children}</DrawerBody>
        </DrawerPanel>
      </DrawerBackdrop>
    </DrawerRoot>
  );
}

Drawer.Root = DrawerRoot;
Drawer.Backdrop = DrawerBackdrop;
Drawer.Panel = DrawerPanel;
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Close = DrawerClose;
Drawer.Body = DrawerBody;
