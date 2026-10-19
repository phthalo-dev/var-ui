import type { CSSProperties, JSX, ReactElement, ReactNode } from 'react';
import { createContext, isValidElement, useCallback, useContext, useMemo, useState } from 'react';
import { Dialog as AriaDialog, Modal, ModalOverlay } from 'react-aria-components';
import {
  layout,
  layoutBreakpointQueries,
  layoutContent,
  layoutContentWidthAssignment,
  layoutFooter,
  layoutHeader,
  layoutPanel,
  layoutShellPaddingAssignments,
  type LayoutBreakpoint,
  type LayoutContentVariantProps,
  type LayoutPadding,
  type LayoutVariantProps,
} from '@var-ui/core';
import type { UseResizableResult } from '../hooks';
import { useMediaQuery, useScrollLock } from '../hooks';
import { useLayer } from '../layers/LayerProvider';
import { mergeProps } from './utils';

const dialogContentStyle: CSSProperties = { display: 'contents' };

/** `layoutContent()`/`layoutPanel()` only support seamless (`inherit`, the default) or `0`. */
function toZonePaddingVariant(
  padding: LayoutPadding | undefined,
): NonNullable<LayoutContentVariantProps['padding']> {
  return padding === 0 ? '0' : 'inherit';
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/** Reads `hasDivider` off a not-yet-rendered child element, without executing it. */
function elementHasDivider(node: ReactNode, fallback: boolean): boolean {
  if (isValidElement(node)) {
    const props = (node as ReactElement<{ hasDivider?: boolean }>).props;
    if (props.hasDivider != null) return props.hasDivider;
  }
  return fallback;
}

type LayoutArea = 'header' | 'footer' | 'start' | 'end' | 'content';

const LayoutAreaContext = createContext<LayoutArea | null>(null);

type LayoutSlotsContextValue = {
  hasHeader: boolean;
  hasFooter: boolean;
  hasStart: boolean;
  hasEnd: boolean;
  defaultHasDividers: boolean;
};

const LayoutSlotsContext = createContext<LayoutSlotsContextValue>({
  hasHeader: false,
  hasFooter: false,
  hasStart: false,
  hasEnd: false,
  defaultHasDividers: false,
});

/** Slot presence and divider defaults from the nearest `Layout` root. */
export function useLayoutSlots(): LayoutSlotsContextValue {
  return useContext(LayoutSlotsContext);
}

/** Which zone of the nearest `Layout` rendered this subtree, if any. */
export function useLayoutArea(): LayoutArea | null {
  return useContext(LayoutAreaContext);
}

/** Inherited divider default consumed by `LayoutHeader`/`LayoutFooter` when `hasDivider` is unset. */
const LayoutDividerContext = createContext<boolean>(false);

export type LayoutProps = {
  /** Top chrome band, usually a `LayoutHeader`. */
  header?: ReactNode;
  /** Left/start rail, usually a `LayoutPanel`. */
  start?: ReactNode;
  /** Main zone; wins over `children` when both are set. */
  content?: ReactNode;
  /** Main zone shorthand — used when `content` is omitted. */
  children?: ReactNode;
  /** Right/end rail, usually a `LayoutPanel`. */
  end?: ReactNode;
  /** Bottom chrome band, usually a `LayoutFooter`. */
  footer?: ReactNode;
  /** @default 'fill' */
  height?: NonNullable<LayoutVariantProps['height']>;
  /** Constrains header/content/footer inner wrappers via `margin-inline: auto`. */
  contentWidth?: number;
  /** Outer/inner spacing step for all zones — sets shell CSS vars on the root. Omit for recipe default (`space[4]`). */
  padding?: LayoutPadding;
  /** Divider default inherited by `LayoutHeader`/`LayoutFooter` when they don't set `hasDivider`. @default false */
  defaultHasDividers?: boolean;
  className?: string;
};

/**
 * Multi-pane page shell: header/footer bands and a horizontal middle row for
 * start/content/end zones. Pairs with `LayoutHeader`, `LayoutFooter`,
 * `LayoutContent`, and `LayoutPanel` for edge-aware padding and dividers.
 *
 * ```tsx
 * <Layout
 *   header={<LayoutHeader>Toolbar</LayoutHeader>}
 *   content={<LayoutContent padding={0}><Table /></LayoutContent>}
 *   end={<LayoutPanel hasDivider padding={0}>Inspector</LayoutPanel>}
 * />
 * ```
 */
export function Layout({
  header,
  start,
  content,
  children,
  end,
  footer,
  height = 'fill',
  contentWidth,
  padding,
  defaultHasDividers = false,
  className,
}: LayoutProps): JSX.Element {
  const l = layout({ height });
  const contentNode = content ?? children;

  const hasHeader = header != null;
  const hasFooter = footer != null;
  const hasStart = start != null;
  const hasEnd = end != null;

  const slots = useMemo<LayoutSlotsContextValue>(
    () => ({ hasHeader, hasFooter, hasStart, hasEnd, defaultHasDividers }),
    [hasHeader, hasFooter, hasStart, hasEnd, defaultHasDividers],
  );

  const rootStyle = useMemo((): CSSProperties | undefined => {
    const style = {
      ...(padding != null ? layoutShellPaddingAssignments(padding) : {}),
      ...(contentWidth != null ? layoutContentWidthAssignment(contentWidth) : {}),
    };
    return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined;
  }, [padding, contentWidth]);

  const headerHasDivider = elementHasDivider(header, defaultHasDividers);
  const footerHasDivider = elementHasDivider(footer, defaultHasDividers);

  return (
    <LayoutSlotsContext.Provider value={slots}>
      <LayoutDividerContext.Provider value={defaultHasDividers}>
        <div
          {...mergeProps(l.root, className)}
          style={rootStyle}
          data-has-header={hasHeader ? '' : undefined}
          data-has-footer={hasFooter ? '' : undefined}
          data-has-start={hasStart ? '' : undefined}
          data-has-end={hasEnd ? '' : undefined}
          data-divider-header={headerHasDivider ? '' : undefined}
          data-divider-footer={footerHasDivider ? '' : undefined}
        >
          <div {...mergeProps(l.outer)}>
            <div {...mergeProps(l.inner)}>
              {hasHeader ? (
                <LayoutAreaContext.Provider value="header">{header}</LayoutAreaContext.Provider>
              ) : null}
              <div {...mergeProps(l.middle)}>
                {hasStart ? (
                  <LayoutAreaContext.Provider value="start">{start}</LayoutAreaContext.Provider>
                ) : null}
                <LayoutAreaContext.Provider value="content">
                  {contentNode}
                </LayoutAreaContext.Provider>
                {hasEnd ? (
                  <LayoutAreaContext.Provider value="end">{end}</LayoutAreaContext.Provider>
                ) : null}
              </div>
              {hasFooter ? (
                <LayoutAreaContext.Provider value="footer">{footer}</LayoutAreaContext.Provider>
              ) : null}
            </div>
          </div>
        </div>
      </LayoutDividerContext.Provider>
    </LayoutSlotsContext.Provider>
  );
}

/** Scoped override of the layout padding CSS vars consumed by zone recipes. */
function zoneOverrideStyle(
  height: number | string | undefined,
  padding: LayoutPadding | undefined,
): CSSProperties | undefined {
  const heightValue = toCssSize(height);
  if (heightValue == null && padding == null) return undefined;
  const paddingVars = padding == null ? undefined : layoutShellPaddingAssignments(padding);
  return {
    ...(heightValue != null ? { height: heightValue } : {}),
    ...paddingVars,
  } as CSSProperties;
}

export type LayoutHeaderProps = {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
  className?: string;
  children?: ReactNode;
};

/**
 * Top chrome band for `Layout`. Divider defaults from `LayoutDividerContext`
 * (set by `Layout.defaultHasDividers`) unless `hasDivider` is set explicitly.
 */
export function LayoutHeader({
  hasDivider,
  height,
  padding,
  className,
  children,
}: LayoutHeaderProps): JSX.Element {
  const s = layoutHeader();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const style = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="header">
      <div
        {...mergeProps(s.header, className)}
        style={style}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...mergeProps(s.headerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutFooterProps = {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
  className?: string;
  children?: ReactNode;
};

/**
 * Bottom chrome band for `Layout`. Divider defaults from `LayoutDividerContext`
 * (set by `Layout.defaultHasDividers`) unless `hasDivider` is set explicitly.
 */
export function LayoutFooter({
  hasDivider,
  height,
  padding,
  className,
  children,
}: LayoutFooterProps): JSX.Element {
  const s = layoutFooter();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const style = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="footer">
      <div
        {...mergeProps(s.footer, className)}
        style={style}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...mergeProps(s.footerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutContentProps = {
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /** @default true */
  isScrollable?: boolean;
  role?: string;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
  className?: string;
  children?: ReactNode;
};

/** Flex-1 main column for `Layout`. Edge-aware padding reads `data-has-*` from the `Layout` root. */
export function LayoutContent({
  padding,
  isScrollable = true,
  role,
  label,
  className,
  children,
}: LayoutContentProps): JSX.Element {
  const s = layoutContent({ isScrollable, padding: toZonePaddingVariant(padding) });
  const resolvedRole = role ?? (label != null ? 'region' : undefined);

  return (
    <LayoutAreaContext.Provider value="content">
      <div {...mergeProps(s.content, className)} role={resolvedRole} aria-label={label}>
        {children}
      </div>
    </LayoutAreaContext.Provider>
  );
}

/** `LayoutPanel.responsive` — collapses a side panel below a breakpoint. */
export type LayoutPanelResponsive = {
  /** Breakpoint below which `mode` takes over from the normal inline panel. */
  below: LayoutBreakpoint;
  /**
   * `'overlay'` renders an RAC `Modal`/`ModalOverlay` drawer when open, nothing when closed.
   * `'hidden'` renders the plain inline panel when open, nothing when closed (no backdrop/trap).
   */
  mode: 'overlay' | 'hidden';
};

export type LayoutPanelProps = {
  /** Ignored when `resizable` is provided — `resizable.width` wins. */
  width?: number | string;
  /** @default false */
  hasDivider?: boolean;
  /** @default true */
  isScrollable?: boolean;
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /**
   * Binds `useResizable()`'s result — reads `width` and ignores the `width` prop.
   * When `isCollapsed` is true the panel unmounts (pair with `ResizeHandle` to expand).
   */
  resizable?: UseResizableResult;
  /** Collapses the panel to `overlay` or `hidden` below a breakpoint. Inert above it. */
  responsive?: LayoutPanelResponsive;
  /** Controlled open state for `responsive` modes — omit to let the panel manage it internally. */
  isOpen?: boolean;
  /** Initial open state for uncontrolled `responsive` usage. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  role?: string;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Fixed-width side panel for `Layout` start/end slots. `data-side` is read
 * from the nearest `LayoutAreaContext` set by `Layout` and also drives the
 * slide edge of the `responsive="overlay"` drawer.
 *
 * Above `responsive.below` (or when `responsive` is omitted), always renders
 * the plain inline panel — `isOpen`/`defaultOpen`/`onOpenChange` are inert.
 * Below it, `'hidden'` mounts/unmounts the inline panel with `isOpen`, and
 * `'overlay'` swaps it for an RAC `Modal`/`ModalOverlay` drawer (focus trap,
 * Escape, backdrop dismissal, `useScrollLock` — same primitives as `MobileNav`).
 */
export function LayoutPanel({
  width,
  hasDivider = false,
  isScrollable = true,
  padding,
  resizable,
  responsive,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  role,
  label,
  className,
  children,
}: LayoutPanelProps): JSX.Element | null {
  const area = useContext(LayoutAreaContext);
  const dataSide = area === 'start' || area === 'end' ? area : undefined;
  const s = layoutPanel({ isScrollable, hasDivider, padding: toZonePaddingVariant(padding) });
  const resolvedRole = role ?? (label != null ? 'region' : undefined);

  const effectiveWidth = resizable?.width ?? width;
  const style: CSSProperties | undefined =
    effectiveWidth != null ? { width: toCssSize(effectiveWidth) } : undefined;

  const isBelowBreakpoint = useMediaQuery(
    responsive ? layoutBreakpointQueries[responsive.below] : 'not all',
  );
  const isResponsiveActive = responsive != null && isBelowBreakpoint;
  const isOverlayMode = isResponsiveActive && responsive?.mode === 'overlay';

  const isControlled = isOpenProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? (isOpenProp as boolean) : internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const isOverlayVisible = isOverlayMode && isOpen;
  useScrollLock(isOverlayVisible);
  const { style: layerStyle } = useLayer();

  if (resizable?.isCollapsed) {
    return null;
  }

  if (isResponsiveActive && responsive?.mode === 'hidden' && !isOpen) {
    return null;
  }

  const panelBody = (
    <div
      {...mergeProps(s.panel, className)}
      data-side={dataSide}
      style={style}
      role={isOverlayMode ? undefined : resolvedRole}
      aria-label={isOverlayMode ? undefined : label}
    >
      {children}
    </div>
  );

  if (isOverlayMode) {
    return (
      <ModalOverlay
        isOpen={isOpen}
        onOpenChange={setOpen}
        isDismissable
        {...mergeProps(s.overlayBackdrop)}
        data-open={isOpen ? '' : undefined}
        style={layerStyle}
      >
        <Modal {...mergeProps(s.overlay)} data-side={dataSide} data-open={isOpen ? '' : undefined}>
          <AriaDialog aria-label={label ?? 'Panel'} style={dialogContentStyle}>
            {panelBody}
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    );
  }

  return panelBody;
}
