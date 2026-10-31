import type { ComponentPropsWithRef, JSX, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { mobileNav } from '@var-ui/core/components/mobileNav';
import { recipeVars, styleVars } from '@var-ui/core/components/styleVars';
import { Icon } from '../icons';
import { NativeSheetPopup } from '../internal/NativeSheetPopup';
import {
  useOverlayClose,
  useOverlayRoot,
  type OverlayOpenChangeHandler,
  type OverlayRequestOptions,
} from '../overlays';
import { mergeProps } from 'typestyles';

const mobileNavVars = recipeVars(mobileNav);

export type MobileNavContextValue = {
  open: boolean;
  show: () => void;
  close: () => void;
  toggle: (options?: OverlayRequestOptions) => void;
  /** Requests a change; `details` from a nested `MobileNav` can be passed straight through. */
  onOpenChange: (open: boolean, options?: OverlayRequestOptions) => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export type MobileNavProviderProps = {
  children: ReactNode;
  /** Controlled open state — omit to let the provider manage it internally. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  /** Called when the nav requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
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
  const root = useOverlayRoot({ open: openProp, defaultOpen, onOpenChange });
  const { open, setOpen } = root;

  const value = useMemo<MobileNavContextValue>(
    () => ({
      open,
      show: () => void setOpen(true),
      close: () => void setOpen(false),
      toggle: (options) => void setOpen(!open, options),
      onOpenChange: (next, options) => void setOpen(next, options),
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
    <button
      type="button"
      {...rest}
      {...mergeProps(s.toggle, className)}
      aria-label={label}
      aria-expanded={open}
      onClick={(event) => {
        if (onClick) onClick(event as MouseEvent<HTMLButtonElement>);
        else context?.toggle({ reason: 'trigger-press', event: event.nativeEvent });
      }}
    >
      <Icon name="menu" />
    </button>
  );
}

/**
 * Native props, `ref`, `className` and `style` go to the `<dialog>` (the sliding panel itself).
 * `aria-label` / `aria-labelledby` name it and take precedence over `label`.
 */
export type MobileNavProps = Omit<ComponentPropsWithRef<'dialog'>, 'children' | 'open'> & {
  /** Controlled open state; falls back to a `MobileNavProvider` ancestor when omitted. */
  open?: boolean;
  /** Initial open state when uncontrolled and there is no `MobileNavProvider`. @default false */
  defaultOpen?: boolean;
  /**
   * Called when the nav requests to open or close. `details.cancel()` vetoes the change.
   * Falls back to a `MobileNavProvider` ancestor's handler when omitted.
   */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Rendered in the sticky header row, left of the close button. */
  header?: ReactNode;
  /** Panel width in px; the recipe caps it at 85vw. @default 320 */
  width?: number;
  /** Edge the panel slides in from. `'auto'` resolves to `'start'`. @default 'auto' */
  side?: 'start' | 'end' | 'auto';
  /** Drawer content, typically a `SideNav.Section`/`SideNav.Item` tree. */
  children: ReactNode;
  /** Label for the close button. @default 'Close navigation' */
  closeLabel?: string;
  /** Accessible name for the dialog. @default 'Navigation' */
  label?: string;
  /** Whether pressing the backdrop closes the nav. @default true */
  dismissable?: boolean;
};

function MobileNavClose({ label }: { label: string }): JSX.Element {
  const close = useOverlayClose();
  const s = mobileNav();
  return (
    <button
      type="button"
      {...mergeProps(s.closeButton)}
      aria-label={label}
      onClick={(event) => close({ reason: 'close-press', event: event.nativeEvent })}
    >
      <Icon name="close" size="sm" />
    </button>
  );
}

/**
 * Slide-out mobile navigation on a native modal `<dialog>` (the same behavior as a start-edge
 * `Drawer`, with the `mobileNav` recipe): focus trap, Escape, backdrop dismissal and an exit
 * animation, all native. `open` / `defaultOpen` / `onOpenChange(open, details)` like every
 * overlay; or pair with a `MobileNav.Toggle` under a shared `MobileNavProvider` (what `AppShell`
 * does at the mobile breakpoint).
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
  defaultOpen,
  onOpenChange: onOpenChangeProp,
  header,
  width = 320,
  side = 'auto',
  children,
  className,
  closeLabel = 'Close navigation',
  label = 'Navigation',
  dismissable = true,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: MobileNavProps): JSX.Element {
  const context = useMobileNav();
  const root = useOverlayRoot({
    open: openProp ?? context?.open,
    defaultOpen,
    onOpenChange: onOpenChangeProp ?? context?.onOpenChange,
  });
  const resolvedSide = side === 'auto' ? 'start' : side;
  const s = mobileNav();
  const panelStyle = useMemo(() => styleVars([[mobileNavVars.panelWidth, `${width}px`]]), [width]);

  return (
    <NativeSheetPopup
      {...rest}
      {...mergeProps(s.popup, className)}
      root={root}
      dismissable={dismissable}
      data-side={resolvedSide}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : label)}
      aria-labelledby={ariaLabelledBy}
      style={{ ...panelStyle, ...style }}
      ref={ref}
    >
      <div {...mergeProps(s.header)}>
        <div style={{ minWidth: 0 }}>{header}</div>
        <MobileNavClose label={closeLabel} />
      </div>
      <div {...mergeProps(s.body)}>{children}</div>
    </NativeSheetPopup>
  );
}

MobileNav.Toggle = MobileNavToggle;
