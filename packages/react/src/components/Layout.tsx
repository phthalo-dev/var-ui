import type { ComponentPropsWithRef, CSSProperties, JSX, ReactElement, ReactNode } from 'react';
import { createContext, isValidElement, useContext, useMemo } from 'react';
import {
  layout,
  layoutContent,
  layoutFooter,
  layoutHeader,
  layoutPanel,
} from '@var-ui/core/components/layout';
import { layoutBreakpointQueries } from '@var-ui/core/components/breakpoints';
import {
  layoutContentWidthAssignment,
  layoutShellPaddingAssignments,
} from '@var-ui/core/components/layoutShellVars';
import type {
  LayoutBreakpoint,
  LayoutContentVariantProps,
  LayoutPadding,
  LayoutVariantProps,
} from '@var-ui/core';
import type { UseResizableResult } from '../hooks';
import { useMediaQuery } from '../hooks';
import { NativeSheetPopup } from '../internal/NativeSheetPopup';
import { useOverlayRoot, type OverlayOpenChangeHandler } from '../overlays';
import { mergeProps } from 'typestyles';
import { useDirection } from '../DirectionProvider';
import { ResizeHandle } from './ResizeHandle';

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

export type LayoutProps = Omit<ComponentPropsWithRef<'div'>, 'content'> & {
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
  style,
  ref,
  ...rest
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
    const vars = {
      ...(padding != null ? layoutShellPaddingAssignments(padding) : {}),
      ...(contentWidth != null ? layoutContentWidthAssignment(contentWidth) : {}),
    };
    return Object.keys(vars).length > 0 ? vars : undefined;
  }, [padding, contentWidth]);

  const headerHasDivider = elementHasDivider(header, defaultHasDividers);
  const footerHasDivider = elementHasDivider(footer, defaultHasDividers);

  return (
    <LayoutSlotsContext.Provider value={slots}>
      <LayoutDividerContext.Provider value={defaultHasDividers}>
        <div
          {...rest}
          {...mergeProps(l.root, className)}
          ref={ref}
          style={rootStyle || style ? { ...rootStyle, ...style } : undefined}
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
  };
}

export type LayoutHeaderProps = ComponentPropsWithRef<'div'> & {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
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
  style: styleProp,
  children,
  ref,
  ...rest
}: LayoutHeaderProps): JSX.Element {
  const s = layoutHeader();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const zoneStyle = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="header">
      <div
        {...rest}
        {...mergeProps(s.header, className)}
        ref={ref}
        style={zoneStyle || styleProp ? { ...zoneStyle, ...styleProp } : undefined}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...mergeProps(s.headerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutFooterProps = ComponentPropsWithRef<'div'> & {
  /** Overrides the inherited `LayoutDividerContext` default. */
  hasDivider?: boolean;
  /** Raw CSS height override (number treated as px). */
  height?: number | string;
  /** Overrides the inherited outer/inner padding CSS vars for this zone only. */
  padding?: LayoutPadding;
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
  style: styleProp,
  children,
  ref,
  ...rest
}: LayoutFooterProps): JSX.Element {
  const s = layoutFooter();
  const inheritedDivider = useContext(LayoutDividerContext);
  const effectiveHasDivider = hasDivider ?? inheritedDivider;
  const zoneStyle = zoneOverrideStyle(height, padding);

  return (
    <LayoutAreaContext.Provider value="footer">
      <div
        {...rest}
        {...mergeProps(s.footer, className)}
        ref={ref}
        style={zoneStyle || styleProp ? { ...zoneStyle, ...styleProp } : undefined}
        data-divider={effectiveHasDivider ? '' : undefined}
      >
        <div {...mergeProps(s.footerInner)}>{children}</div>
      </div>
    </LayoutAreaContext.Provider>
  );
}

export type LayoutContentProps = ComponentPropsWithRef<'div'> & {
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /** @default true */
  scrollable?: boolean;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
};

/** Flex-1 main column for `Layout`. Edge-aware padding reads `data-has-*` from the `Layout` root. */
export function LayoutContent({
  padding,
  scrollable = true,
  role,
  label,
  className,
  children,
  ref,
  ...rest
}: LayoutContentProps): JSX.Element {
  const s = layoutContent({ scrollable, padding: toZonePaddingVariant(padding) });
  const resolvedRole = role ?? (label != null ? 'region' : undefined);

  return (
    <LayoutAreaContext.Provider value="content">
      <div
        aria-label={label}
        {...rest}
        {...mergeProps(s.content, className)}
        ref={ref}
        role={resolvedRole}
      >
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
   * `'overlay'` renders a native modal `<dialog>` drawer; the panel stays out of the page while closed.
   * `'hidden'` renders the plain inline panel when open, nothing when closed (no backdrop/trap).
   */
  mode: 'overlay' | 'hidden';
};

export type LayoutPanelProps = ComponentPropsWithRef<'div'> & {
  /** Ignored when `resizable` is provided — `resizable.width` wins. */
  width?: number | string;
  /**
   * Draws a border on the edge facing the content. Replaced by the resize line
   * when `hasResizeHandle` is set. @default false
   */
  hasDivider?: boolean;
  /** @default true */
  scrollable?: boolean;
  /** Only `0` (seamless) is distinct from the inherited default. */
  padding?: LayoutPadding;
  /**
   * Binds `useResizable()`'s result — reads `width` and ignores the `width` prop.
   * When `isCollapsed` is true the panel unmounts (pair with `ResizeHandle` to expand).
   */
  resizable?: UseResizableResult;
  /**
   * With `resizable`, renders a `ResizeHandle` on the edge facing the content
   * (after a start panel, before an end panel) in place of the divider, with
   * the drag direction flipped for end panels. Skipped below a `responsive`
   * breakpoint. @default false
   */
  hasResizeHandle?: boolean;
  /** Accessible name for the handle rendered by `hasResizeHandle`. @default 'Resize panel' */
  resizeHandleLabel?: string;
  /** Collapses the panel to `overlay` or `hidden` below a breakpoint. Inert above it. */
  responsive?: LayoutPanelResponsive;
  /** Controlled open state for `responsive` modes — omit to let the panel manage it internally. */
  open?: boolean;
  /** Initial open state for uncontrolled `responsive` usage. @default false */
  defaultOpen?: boolean;
  /** Called when the overlay or hidden panel requests to open or close. `details.cancel()` vetoes it. */
  onOpenChange?: OverlayOpenChangeHandler;
  /** Accessible name; paired with `role="region"` by default when set. */
  label?: string;
};

/**
 * Fixed-width side panel for `Layout` start/end slots. `data-side` is read
 * from the nearest `LayoutAreaContext` set by `Layout` and also drives the
 * slide edge of the `responsive="overlay"` drawer.
 *
 * Above `responsive.below` (or when `responsive` is omitted), always renders
 * the plain inline panel — `open`/`defaultOpen`/`onOpenChange` are inert.
 * Below it, `'hidden'` mounts/unmounts the inline panel with `open`, and
 * `'overlay'` swaps it for a native modal `<dialog>` drawer (focus trap,
 * Escape, backdrop dismissal and scroll lock are native, as in `MobileNav`).
 */
export function LayoutPanel({
  width,
  hasDivider = false,
  scrollable = true,
  padding,
  resizable,
  hasResizeHandle = false,
  resizeHandleLabel = 'Resize panel',
  responsive,
  open: openProp,
  defaultOpen,
  onOpenChange,
  role,
  label,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  style: styleProp,
  children,
  ref,
  ...rest
}: LayoutPanelProps): JSX.Element | null {
  const area = useContext(LayoutAreaContext);
  const dataSide = area === 'start' || area === 'end' ? area : undefined;
  const { isRtl } = useDirection();
  const resolvedRole = role ?? (label != null ? 'region' : undefined);
  const accessibleName = label ?? ariaLabel;

  const effectiveWidth = resizable?.width ?? width;
  const widthStyle: CSSProperties | undefined =
    effectiveWidth != null ? { width: toCssSize(effectiveWidth) } : undefined;
  const style = widthStyle || styleProp ? { ...widthStyle, ...styleProp } : undefined;

  const isBelowBreakpoint = useMediaQuery(
    responsive ? layoutBreakpointQueries[responsive.below] : 'not all',
  );
  const isResponsiveActive = responsive != null && isBelowBreakpoint;
  const showResizeHandle = hasResizeHandle && resizable != null && !isResponsiveActive;
  const s = layoutPanel({
    scrollable,
    hasDivider: showResizeHandle ? false : hasDivider,
    hasResizeHandle: showResizeHandle,
    padding: toZonePaddingVariant(padding),
  });
  const isOverlayMode = isResponsiveActive && responsive?.mode === 'overlay';

  const root = useOverlayRoot({ native: true, open: openProp, defaultOpen, onOpenChange });
  const { open } = root;

  if (resizable?.isCollapsed) {
    return null;
  }

  if (isResponsiveActive && responsive?.mode === 'hidden' && !open) {
    return null;
  }

  const panelBody = (
    <div
      aria-label={isOverlayMode ? undefined : accessibleName}
      aria-labelledby={isOverlayMode ? undefined : ariaLabelledBy}
      {...rest}
      {...mergeProps(s.panel, className)}
      ref={ref}
      data-side={dataSide}
      style={style}
      role={isOverlayMode ? undefined : resolvedRole}
    >
      {children}
    </div>
  );

  if (isOverlayMode) {
    return (
      <NativeSheetPopup
        {...mergeProps(s.popup)}
        root={root}
        data-side={dataSide}
        aria-label={ariaLabelledBy ? undefined : (accessibleName ?? 'Panel')}
        aria-labelledby={ariaLabelledBy}
      >
        <div {...mergeProps(s.body)}>{panelBody}</div>
      </NativeSheetPopup>
    );
  }

  if (showResizeHandle && resizable != null) {
    const handle = (
      <ResizeHandle
        {...resizable.handleProps}
        reversed={(dataSide === 'end') !== isRtl}
        aria-label={resizeHandleLabel}
      />
    );
    return dataSide === 'end' ? (
      <>
        {handle}
        {panelBody}
      </>
    ) : (
      <>
        {panelBody}
        {handle}
      </>
    );
  }

  return panelBody;
}
