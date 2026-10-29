import type { CSSProperties, JSX, ReactNode, Ref } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  Button as AriaButton,
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
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  onOpenChange: (open: boolean) => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export type MobileNavProviderProps = {
  children: ReactNode;
  /** Controlled open state — omit to let the provider manage it internally. */
  isOpen?: boolean;
  /** Initial open state for uncontrolled usage. @default false */
  defaultIsOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Shares open state between a `MobileNav` and one or more `MobileNav.Toggle`s
 * that aren't directly wired together with explicit `isOpen`/`onOpenChange`.
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
  isOpen: isOpenProp,
  defaultIsOpen = false,
  onOpenChange,
}: MobileNavProviderProps): JSX.Element {
  const isControlled = isOpenProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultIsOpen);
  const isOpen = isControlled ? (isOpenProp as boolean) : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo<MobileNavContextValue>(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(!isOpen),
      onOpenChange: setOpen,
    }),
    [isOpen, setOpen],
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

/** Nearest `MobileNavProvider`'s open state, or `null` outside one. */
export function useMobileNav(): MobileNavContextValue | null {
  return useContext(MobileNavContext);
}

export type MobileNavToggleProps = {
  /** Accessible label for the hamburger button. @default 'Open navigation' */
  label?: string;
  /**
   * Explicit press handler — required when there's no `MobileNavProvider` ancestor.
   * Takes priority over context when both are present.
   */
  onPress?: () => void;
  /** Drives `aria-expanded` when there's no `MobileNavProvider` ancestor. */
  isOpen?: boolean;
  className?: string;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/** Hamburger trigger for `MobileNav`. Reads a `MobileNavProvider` when present. */
export function MobileNavToggle({
  label = 'Open navigation',
  onPress,
  isOpen: isOpenProp,
  className,
  ref,
}: MobileNavToggleProps): JSX.Element {
  const context = useMobileNav();
  const isOpen = isOpenProp ?? context?.isOpen ?? false;
  const s = mobileNav();

  return (
    <AriaButton
      {...mergeProps(s.toggle, className)}
      ref={ref}
      aria-label={label}
      aria-expanded={isOpen}
      onPress={() => {
        if (onPress) onPress();
        else context?.toggle();
      }}
    >
      <Icon name="menu" />
    </AriaButton>
  );
}

export type MobileNavProps = {
  /** Controlled open state — falls back to a `MobileNavProvider` ancestor when omitted. */
  isOpen?: boolean;
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
  className?: string;
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
  /** Ref to the underlying overlay `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Slide-out mobile navigation drawer built on RAC `Modal`/`ModalOverlay` — focus
 * trap, Escape, and backdrop dismissal come for free. Fully controlled via
 * `isOpen`/`onOpenChange`, or pair with a `MobileNav.Toggle` under a shared
 * `MobileNavProvider` (what `AppShell` does at the mobile breakpoint).
 *
 * ```tsx
 * <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Menu">
 *   <SideNav.Section title="Main">
 *     <SideNav.Item label="Dashboard" href="/" isSelected />
 *   </SideNav.Section>
 * </MobileNav>
 * ```
 */
export function MobileNav({
  isOpen: isOpenProp,
  onOpenChange: onOpenChangeProp,
  header,
  width = 320,
  side = 'auto',
  children,
  className,
  closeLabel = 'Close navigation',
  label = 'Navigation',
  portalContainer,
  ref,
}: MobileNavProps): JSX.Element {
  const context = useMobileNav();
  const isOpen = isOpenProp ?? context?.isOpen ?? false;
  const onOpenChange = onOpenChangeProp ?? context?.onOpenChange;
  const resolvedSide = side === 'auto' ? 'start' : side;
  const s = mobileNav();
  const { style: layerStyle } = useLayer();
  useScrollLock(isOpen);

  const panelStyle = useMemo(() => styleVars([[mobileNavVars.panelWidth, `${width}px`]]), [width]);

  return (
    <ModalOverlay
      ref={ref}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      {...mergeProps(s.overlay)}
      data-open={isOpen ? '' : undefined}
      style={layerStyle}
      UNSTABLE_portalContainer={portalContainer}
    >
      <Modal
        {...mergeProps(s.panel, className)}
        data-side={resolvedSide}
        data-open={isOpen ? '' : undefined}
        style={panelStyle}
      >
        <AriaDialog aria-label={label} style={dialogContentStyle}>
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
