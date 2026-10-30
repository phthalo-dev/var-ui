import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
} from 'react-aria-components';
import { drawer } from '@var-ui/core/components/drawer';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import type { DrawerVariantProps } from '@var-ui/core';

const drawerVars = recipeVars(drawer);
import { Icon } from '../icons';
import { useScrollLock } from '../hooks';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  OverlayCloseContext,
  useMergedRef,
  useOverlayClose,
  useOverlayPresence,
  type OverlayCloseProps,
  type OverlayOpenChangeHandler,
  type UseOverlayPresenceResult,
} from '../overlays';
import { mergeProps } from 'typestyles';

const dialogContentStyle: CSSProperties = { display: 'contents' };

export type DrawerProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'title' | 'style' | 'className' | 'ref'
> &
  DrawerVariantProps & {
    /** Controlled open state. */
    open?: boolean;
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Whether clicking outside or pressing Escape closes the drawer. @default true */
    dismissable?: boolean;
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
    style?: CSSProperties;
    /**
     * Element the drawer portals into instead of `document.body`. Needed when a subtree renders
     * under a different theme than the page ambient.
     */
    portalContainer?: Element;
    onOpenChange?: OverlayOpenChangeHandler;
    /** Ref to the underlying overlay `<div>` element. */
    ref?: Ref<HTMLDivElement>;
  };

export type DrawerRootProps = DrawerVariantProps & {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the drawer requests to open or close. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Whether clicking outside or pressing Escape closes the drawer. @default true */
  dismissable?: boolean;
  portalContainer?: Element;
  'aria-label'?: string;
  /** Ref to the underlying wrapper `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type DrawerBackdropProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Overrides the root's `dismissable` for this backdrop. */
  dismissable?: boolean;
};

/**
 * Native props go to the modal `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * dialog element and take precedence over the `aria-label` set on `Drawer.Root`. When
 * `Drawer.Title` is rendered and no label is given, the title names the dialog.
 */
export type DrawerPanelProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  placement?: 'start' | 'end' | 'bottom';
  width?: number;
  height?: number;
};

export type DrawerHeaderProps = ComponentPropsWithRef<'div'>;

export type DrawerTitleProps = ComponentPropsWithRef<'h2'>;

export type DrawerCloseProps = OverlayCloseProps;

export type DrawerBodyProps = ComponentPropsWithRef<'div'>;

type DrawerContextValue = {
  presence: UseOverlayPresenceResult;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
  panelRef: MutableRefObject<HTMLDivElement | null>;
  portalContainer?: Element;
  dismissable: boolean;
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
  open,
  defaultOpen = false,
  onOpenChange,
  dismissable = true,
  portalContainer,
  size = 'md',
  'aria-label': ariaLabel,
  ref,
}: DrawerRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = open ?? uncontrolledOpen;
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
      if (open === undefined) setRequestedOpen(next);
    },
    [open, onOpenChange],
  );

  const context = useMemo<DrawerContextValue>(
    () => ({
      presence,
      backdropRef,
      panelRef,
      portalContainer,
      dismissable,
      size,
      ariaLabel,
      lastEventRef,
      handleOpenChange,
    }),
    [ariaLabel, handleOpenChange, dismissable, portalContainer, presence, size],
  );

  return (
    <DrawerContext.Provider value={context}>
      <div
        ref={ref}
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
  style,
  dismissable,
  onPointerDown,
  ref,
  ...rest
}: DrawerBackdropProps): JSX.Element {
  const ctx = useDrawerContext();
  const setRef = useMergedRef(ctx.backdropRef, ref);
  const styles = drawer({ size: ctx.size });
  const { style: layerStyle } = useLayer();

  return (
    <ModalOverlay
      {...rest}
      {...mergeProps(styles.overlay, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      style={{ ...layerStyle, ...style }}
      isOpen={ctx.presence.mounted}
      onOpenChange={ctx.handleOpenChange}
      isDismissable={dismissable ?? ctx.dismissable}
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
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: DrawerPanelProps): JSX.Element {
  const ctx = useDrawerContext();
  const setRef = useMergedRef(ctx.panelRef, ref);
  const styles = drawer({ size: ctx.size });
  const panelStyle = styleVars([
    [drawerVars.panelWidth, width != null ? `${width}px` : null],
    [drawerVars.panelHeight, height != null ? `${height}px` : null],
  ]);

  return (
    <Modal
      {...rest}
      {...mergeProps(styles.panel, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      data-placement={placement}
      style={{ ...panelStyle, ...style }}
    >
      <AriaDialog
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : ctx.ariaLabel)}
        aria-labelledby={ariaLabelledBy}
        style={dialogContentStyle}
      >
        {({ close }) => (
          <OverlayCloseContext.Provider value={close}>{children}</OverlayCloseContext.Provider>
        )}
      </AriaDialog>
    </Modal>
  );
}

function DrawerHeader({ className, ...rest }: DrawerHeaderProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...rest} {...mergeProps(styles.header, className)} />;
}

function DrawerTitle({ className, children, ...rest }: DrawerTitleProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return (
    <Heading {...rest} slot="title" {...mergeProps(styles.title, className)}>
      {children}
    </Heading>
  );
}

function DrawerClose({
  children,
  className,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: DrawerCloseProps): JSX.Element {
  const close = useOverlayClose();
  const { size } = useDrawerContext();
  const styles = drawer({ size });

  if (children) {
    const child = Children.only(children);
    const merged = mergeOverlayChild(child, {
      ...rest,
      ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : null),
      ref,
      onPress: close,
      onClick: (...args: unknown[]) => {
        if (typeof rest.onClick === 'function')
          (rest.onClick as (...a: unknown[]) => void)(...args);
        close();
      },
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
      {...mergeProps(styles.closeButton, className)}
      aria-label={ariaLabel ?? 'Close'}
      onPress={close}
      ref={ref}
    >
      <Icon name="close" size="sm" />
    </AriaButton>
  );
}

function DrawerBody({ className, ...rest }: DrawerBodyProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...rest} {...mergeProps(styles.body, className)} />;
}

/**
 * General-purpose slide-in panel built on RAC Modal — focus trap, Escape, and
 * backdrop dismissal included.
 *
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} title="Settings">
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
  open,
  defaultOpen,
  dismissable = true,
  onOpenChange,
  ...props
}: DrawerProps): JSX.Element {
  return (
    <DrawerRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      portalContainer={portalContainer}
      size={size}
      aria-label={title ? undefined : label}
    >
      <DrawerBackdrop
        {...(props as Omit<DrawerBackdropProps, 'children'>)}
        dismissable={dismissable}
      >
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
