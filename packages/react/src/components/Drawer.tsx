import {
  Children,
  useMemo,
  type ComponentPropsWithRef,
  type CSSProperties,
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
import { drawer } from '@var-ui/core/components/drawer';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import type { DrawerVariantProps } from '@var-ui/core';

const drawerVars = recipeVars(drawer);
import { Icon } from '../icons';
import { useScrollLock } from '../hooks';
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

const dialogContentStyle: CSSProperties = { display: 'contents' };

export type DrawerRootProps = DrawerVariantProps & {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the drawer requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Whether pressing the backdrop closes the drawer. Escape always closes. @default true */
  dismissable?: boolean;
  /**
   * Element the drawer portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
  /** Accessible name for the dialog; `Drawer.Popup`'s own `aria-label` wins. */
  'aria-label'?: string;
};

/** Alias for docs and consumers referring to the root drawer props. */
export type DrawerProps = DrawerRootProps;

export type DrawerTriggerProps = OverlayTriggerProps;

export type DrawerBackdropProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
};

/**
 * Native props go to the modal `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * dialog element and take precedence over the `aria-label` set on `Drawer`. When
 * `Drawer.Title` is rendered and no label is given, the title names the dialog.
 */
export type DrawerPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Edge the popup slides in from. @default 'end' */
  placement?: 'start' | 'end' | 'bottom';
  /** Custom width in px (overrides size width for start/end). */
  width?: number;
  /** Custom height in px (overrides size height for bottom). */
  height?: number;
};

export type DrawerHeaderProps = ComponentPropsWithRef<'div'>;

export type DrawerTitleProps = ComponentPropsWithRef<'h2'>;

export type DrawerCloseProps = OverlayCloseProps;

export type DrawerBodyProps = ComponentPropsWithRef<'div'>;

type DrawerContextValue = {
  root: OverlayRoot;
  portalContainer?: Element;
  dismissable: boolean;
  size: DrawerVariantProps['size'];
  ariaLabel?: string;
};

const { Context: DrawerContext, use: useDrawerContext } =
  createOverlayContext<DrawerContextValue>('Drawer');

function DrawerRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  dismissable = true,
  portalContainer,
  size = 'md',
  'aria-label': ariaLabel,
}: DrawerRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  useScrollLock(root.mounted);

  const context = useMemo<DrawerContextValue>(
    () => ({ root, portalContainer, dismissable, size, ariaLabel }),
    [root, portalContainer, dismissable, size, ariaLabel],
  );

  return (
    <DrawerContext.Provider value={context}>
      <AriaDialogTrigger {...root.rac}>{children}</AriaDialogTrigger>
    </DrawerContext.Provider>
  );
}

function DrawerTrigger(props: DrawerTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={useDrawerContext().root} />;
}

function DrawerBackdrop({
  children,
  className,
  style,
  ref,
  ...rest
}: DrawerBackdropProps): JSX.Element {
  const ctx = useDrawerContext();
  const setRef = useMergedRef<HTMLDivElement>(ctx.root.setBackdropEl, ref);
  const styles = drawer({ size: ctx.size });
  const { style: layerStyle } = useLayer();

  return (
    <ModalOverlay
      {...rest}
      {...mergeProps(styles.overlay, className)}
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

function DrawerPopup({
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
}: DrawerPopupProps): JSX.Element {
  const ctx = useDrawerContext();
  const setRef = useMergedRef<HTMLDivElement>(ctx.root.setPopupEl, ref);
  const styles = drawer({ size: ctx.size });
  const popupStyle = styleVars([
    [drawerVars.panelWidth, width != null ? `${width}px` : null],
    [drawerVars.panelHeight, height != null ? `${height}px` : null],
  ]);

  return (
    <Modal
      {...rest}
      {...mergeProps(styles.panel, className)}
      {...ctx.root.presenceAttrs}
      ref={setRef}
      data-placement={placement}
      style={{ ...popupStyle, ...style }}
    >
      <AriaDialog
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : ctx.ariaLabel)}
        aria-labelledby={ariaLabelledBy}
        style={dialogContentStyle}
      >
        <OverlayCloseContext.Provider value={ctx.root.close}>
          {children}
        </OverlayCloseContext.Provider>
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
      {...mergeProps(styles.closeButton, className)}
      aria-label={ariaLabel ?? 'Close'}
      onPress={composeHandlers((rest as AriaButtonProps).onPress, () => requestClose())}
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
 * Compound slide-in drawer. `Drawer` is Root; compose Trigger, Backdrop, Popup, and chrome parts.
 *
 * ```tsx
 * <Drawer>
 *   <Drawer.Trigger>
 *     <Button>Settings</Button>
 *   </Drawer.Trigger>
 *   <Drawer.Backdrop>
 *     <Drawer.Popup placement="end" aria-label="Settings">
 *       <Drawer.Header>
 *         <Drawer.Title>Settings</Drawer.Title>
 *         <Drawer.Close />
 *       </Drawer.Header>
 *       <Drawer.Body>Drawer content</Drawer.Body>
 *     </Drawer.Popup>
 *   </Drawer.Backdrop>
 * </Drawer>
 * ```
 */
export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Backdrop: DrawerBackdrop,
  Popup: DrawerPopup,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Close: DrawerClose,
  Body: DrawerBody,
});
