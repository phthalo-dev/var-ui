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
import { drawer } from '@var-ui/core/components/drawer';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import type { DrawerVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { NativeSheetPopup } from '../internal/NativeSheetPopup';
import {
  composeHandlers,
  createOverlayContext,
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

const drawerVars = recipeVars(drawer);

export type DrawerRootProps = DrawerVariantProps & {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the drawer requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Whether pressing the backdrop closes the drawer. Escape is native and always reported. @default true */
  dismissable?: boolean;
  /** Accessible name for the dialog; `Drawer.Popup`'s own `aria-label` wins. */
  'aria-label'?: string;
};

/** Alias for docs and consumers referring to the root drawer props. */
export type DrawerProps = DrawerRootProps;

/** The single child must be a button (or a component that renders one): it receives `onClick`. */
export type DrawerTriggerProps = OverlayTriggerProps;

/**
 * Props of the native `<dialog>` element (the popup *is* the dialog): `ref`, `className`, `style`,
 * handlers and `data-*`/`aria-*` attributes all land on it. When `Drawer.Title` is rendered and no
 * label is given, the title names the dialog.
 */
export type DrawerPopupProps = Omit<ComponentPropsWithRef<'dialog'>, 'children' | 'open'> & {
  children: ReactNode;
  /** Edge the popup slides in from; `start` and `end` follow the writing direction. @default 'end' */
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
  dismissable: boolean;
  size: DrawerVariantProps['size'];
  ariaLabel?: string;
  titleId: string | undefined;
  setTitleId: (id: string | undefined) => void;
};

const { Context: DrawerContext, use: useDrawerContext } =
  createOverlayContext<DrawerContextValue>('Drawer');

function DrawerRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  dismissable = true,
  size = 'md',
  'aria-label': ariaLabel,
}: DrawerRootProps): JSX.Element {
  const root = useOverlayRoot({ native: true, open, defaultOpen, onOpenChange });
  const [titleId, setTitleId] = useState<string | undefined>(undefined);

  const context = useMemo<DrawerContextValue>(
    () => ({ root, dismissable, size, ariaLabel, titleId, setTitleId }),
    [root, dismissable, size, ariaLabel, titleId],
  );

  return <DrawerContext.Provider value={context}>{children}</DrawerContext.Provider>;
}

function DrawerTrigger({
  children,
  className,
  onClick,
  ref,
  ...props
}: DrawerTriggerProps): JSX.Element {
  const { root } = useDrawerContext();
  const setRef = useMergedRef<HTMLElement>(ref, root.setTriggerEl);
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
  const styles = drawer({ size: ctx.size });
  const popupStyle = styleVars([
    [drawerVars.panelWidth, width != null ? `${width}px` : null],
    [drawerVars.panelHeight, height != null ? `${height}px` : null],
  ]);
  const name = ariaLabel ?? (ariaLabelledBy ? undefined : ctx.ariaLabel);

  return (
    <NativeSheetPopup
      {...rest}
      {...mergeProps(styles.popup, className)}
      root={ctx.root}
      dismissable={ctx.dismissable}
      data-placement={placement}
      aria-label={name}
      aria-labelledby={ariaLabelledBy ?? (name ? undefined : ctx.titleId)}
      style={{ ...popupStyle, ...style }}
      ref={ref}
    >
      {children}
    </NativeSheetPopup>
  );
}

function DrawerHeader({ className, ...rest }: DrawerHeaderProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...rest} {...mergeProps(styles.header, className)} />;
}

function DrawerTitle({ className, id: idProp, ...rest }: DrawerTitleProps): JSX.Element {
  const { size, setTitleId } = useDrawerContext();
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const styles = drawer({ size });
  useEffect(() => {
    setTitleId(id);
    return () => setTitleId(undefined);
  }, [id, setTitleId]);
  return <h2 {...rest} id={id} {...mergeProps(styles.title, className)} />;
}

function DrawerClose({
  children,
  className,
  ref,
  'aria-label': ariaLabel,
  onClick,
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
      {...mergeProps(styles.closeButton, className)}
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

function DrawerBody({ className, ...rest }: DrawerBodyProps): JSX.Element {
  const { size } = useDrawerContext();
  const styles = drawer({ size });
  return <div {...rest} {...mergeProps(styles.body, className)} />;
}

/**
 * Compound slide-in drawer on the native `<dialog>`. `Drawer` is Root; `Popup` is the `<dialog>`
 * itself (its `::backdrop` is the overlay, so there is no Backdrop part and no portal). Trigger
 * merges `onClick` onto its single child, which must be a button.
 *
 * ```tsx
 * <Drawer>
 *   <Drawer.Trigger>
 *     <Button>Settings</Button>
 *   </Drawer.Trigger>
 *   <Drawer.Popup placement="end" aria-label="Settings">
 *     <Drawer.Header>
 *       <Drawer.Title>Settings</Drawer.Title>
 *       <Drawer.Close />
 *     </Drawer.Header>
 *     <Drawer.Body>Drawer content</Drawer.Body>
 *   </Drawer.Popup>
 * </Drawer>
 * ```
 */
export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Popup: DrawerPopup,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Close: DrawerClose,
  Body: DrawerBody,
});
