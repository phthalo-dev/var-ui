import type {
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { mobileNav } from '@var-ui/core/components/mobileNav';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';

const mobileNavVars = recipeVars(mobileNav);
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { useScrollLock } from '../hooks';
import { mergeProps } from 'typestyles';

const dialogContentStyle: CSSProperties = { display: 'contents' };

export type MobileNavContextValue = {
  open: boolean;
  show: () => void;
  close: () => void;
  toggle: () => void;
  onOpenChange: (open: boolean) => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export type MobileNavProviderProps = {
  children: ReactNode;
  /** Controlled open state — omit to let the provider manage it internally. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Shares open state between a `MobileNav` and one or more `MobileNav.Toggle`s
 * that aren't directly wired together with explicit `open`/`onOpenChange`.
 * `AppShell` wraps its slots in this same provider for the mobile breakpoint.
 *
 * ```tsx
 * <MobileNavProvider>
 *   <MobileNav.Toggle />
 *   <MobileNav>{navContent}</MobileNav>
 * </MobileNavProvider>
 * ```
 */
export function MobileNavProvider({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: MobileNavProviderProps): JSX.Element {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? (openProp as boolean) : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo<MobileNavContextValue>(
    () => ({
      open,
      show: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(!open),
      onOpenChange: setOpen,
    }),
    [open, setOpen],
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

/** Nearest `MobileNavProvider`'s open state, or `null` outside one. */
export function useMobileNav(): MobileNavContextValue | null {
  return useContext(MobileNavContext);
}

export type MobileNavToggleProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'children' | 'onClick'
> & {
  /** Accessible label for the hamburger button. @default 'Open navigation' */
  label?: string;
  /**
   * Explicit click handler — required when there's no `MobileNavProvider` ancestor.
   * Takes priority over context toggling when both are present.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Drives `aria-expanded` when there's no `MobileNavProvider` ancestor. */
  open?: boolean;
};

/** Hamburger trigger for `MobileNav`. Reads a `MobileNavProvider` when present. */
export function MobileNavToggle({
  label = 'Open navigation',
  onClick,
  open: openProp,
  className,
  ...rest
}: MobileNavToggleProps): JSX.Element {
  const context = useMobileNav();
  const open = openProp ?? context?.open ?? false;
  const s = mobileNav();

  return (
    <AriaButton
      {...(rest as AriaButtonProps)}
      {...mergeProps(s.toggle, className)}
      aria-label={label}
      aria-expanded={open}
      onClick={(event) => {
        if (onClick) onClick(event as MouseEvent<HTMLButtonElement>);
        else context?.toggle();
      }}
    >
      <Icon name="menu" />
    </AriaButton>
  );
}

/**
 * Native props and `ref` go to the overlay `<div>`; `className` is merged onto the sliding panel
 * (the visible surface). `aria-label` / `aria-labelledby` name the inner dialog and take
 * precedence over `label`.
 */
export type MobileNavProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** Controlled open state — falls back to a `MobileNavProvider` ancestor when omitted. */
  open?: boolean;
  /** Falls back to a `MobileNavProvider` ancestor when omitted. */
  onOpenChange?: (open: boolean) => void;
  /** Rendered in the sticky header row, left of the close button. */
  header?: ReactNode;
  /** Panel width in px; the recipe caps it at 85vw. @default 320 */
  width?: number;
  /** Edge the panel slides in from. `'auto'` resolves to `'start'`. @default 'auto' */
  side?: 'start' | 'end' | 'auto';
  /** Drawer content — typically a `SideNav.Section`/`SideNav.Item` tree. */
  children: ReactNode;
  /** Label for the close button. @default 'Close navigation' */
  closeLabel?: string;
  /** Accessible name for the dialog. @default 'Navigation' */
  label?: string;
  /**
   * Element the modal portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient (the theme's CSS custom properties only
   * cascade to descendants of the themed element).
   */
  portalContainer?: Element;
};

/**
 * Slide-out mobile navigation drawer built on RAC `Modal`/`ModalOverlay` — focus
 * trap, Escape, and backdrop dismissal come for free. Fully controlled via
 * `open`/`onOpenChange`, or pair with a `MobileNav.Toggle` under a shared
 * `MobileNavProvider` (what `AppShell` does at the mobile breakpoint).
 *
 * ```tsx
 * <MobileNav open={open} onOpenChange={setOpen} header="Menu">
 *   <SideNav.Section title="Main">
 *     <SideNav.Item label="Dashboard" href="/" selected />
 *   </SideNav.Section>
 * </MobileNav>
 * ```
 */
export function MobileNav({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  header,
  width = 320,
  side = 'auto',
  children,
  className,
  closeLabel = 'Close navigation',
  label = 'Navigation',
  portalContainer,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: MobileNavProps): JSX.Element {
  const context = useMobileNav();
  const open = openProp ?? context?.open ?? false;
  const onOpenChange = onOpenChangeProp ?? context?.onOpenChange;
  const resolvedSide = side === 'auto' ? 'start' : side;
  const s = mobileNav();
  const { style: layerStyle } = useLayer();
  useScrollLock(open);

  const panelStyle = useMemo(() => styleVars([[mobileNavVars.panelWidth, `${width}px`]]), [width]);

  return (
    <ModalOverlay
      {...rest}
      ref={ref}
      isOpen={open}
      onOpenChange={onOpenChange}
      isDismissable
      {...mergeProps(s.overlay)}
      data-open={open ? '' : undefined}
      style={{ ...layerStyle, ...style }}
      UNSTABLE_portalContainer={portalContainer}
    >
      <Modal
        {...mergeProps(s.panel, className)}
        data-side={resolvedSide}
        data-open={open ? '' : undefined}
        style={panelStyle}
      >
        <AriaDialog
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : label)}
          aria-labelledby={ariaLabelledBy}
          style={dialogContentStyle}
        >
          {({ close }) => (
            <>
              <div {...mergeProps(s.header)}>
                <div style={{ minWidth: 0 }}>{header}</div>
                <AriaButton {...mergeProps(s.closeButton)} aria-label={closeLabel} onPress={close}>
                  <Icon name="close" size="sm" />
                </AriaButton>
              </div>
              {children}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

MobileNav.Toggle = MobileNavToggle;
