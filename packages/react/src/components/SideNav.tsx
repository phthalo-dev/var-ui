import type { JSX, ReactNode, Ref } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { iconNameList, sideNav, SIDE_NAV_COLLAPSED_WIDTH, type IconName } from '@var-ui/core';
import { useDirection } from '../DirectionProvider';
import { Icon } from '../icons';
import { useResizable, type ResizableConfig } from '../hooks';
import { IconButton } from './IconButton';
import { ResizeHandle } from './ResizeHandle';
import { Text } from './Typography';
import { SimpleTooltip } from './SimpleTooltip';
import { ScrollArea } from './ScrollArea';
import { mergeProps } from 'typestyles';

export type SideNavCollapsibleConfig = {
  /** Initial collapsed state for uncontrolled usage. @default false */
  defaultIsCollapsed?: boolean;
  /** Controlled collapsed state — omit to let `SideNav` manage it internally. */
  isCollapsed?: boolean;
  onCollapsedChange?: (isCollapsed: boolean) => void;
  /** Renders the built-in `SideNav.CollapseButton` in the footer. @default true */
  hasButton?: boolean;
  /** Overrides the collapse button's accessible label for both states. */
  buttonLabel?: string;
};

export type SideNavCollapseHandle = {
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
};

export type SideNavProps = {
  /** Brand block, usually a `SideNav.Heading` — wrapped in the sticky header zone. */
  header?: ReactNode;
  /** Content pinned under `header` (e.g. a "New" button or search field). */
  topContent?: ReactNode;
  /** Content pinned to the sticky footer, left of `footerIcons`/the collapse button. */
  footer?: ReactNode;
  /** Icon-only actions pinned to the sticky footer. */
  footerIcons?: ReactNode;
  /** `SideNav.Section` / `SideNav.Item` tree rendered in the scrollable middle zone. */
  children?: ReactNode;
  collapsible?: boolean | SideNavCollapsibleConfig;
  resizable?: boolean | ResizableConfig;
  /** Imperative collapse/expand/toggle — pair with a `SideNav.CollapseButton` rendered elsewhere. */
  handleRef?: Ref<SideNavCollapseHandle>;
  className?: string;
  /** Accessible name for the `nav` landmark. @default 'Side navigation' */
  label?: string;
  /** Ref to the underlying `<nav>` element. */
  ref?: Ref<HTMLElement>;
};

type SideNavContextValue = {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
};

const SideNavContext = createContext<SideNavContextValue | null>(null);

const noop = () => {};

function useSideNavContext(): SideNavContextValue {
  const context = useContext(SideNavContext);
  return context ?? { isCollapsed: false, toggle: noop, collapse: noop, expand: noop };
}

/** Registry name or a caller-supplied node — excludes bare `string` so it isn't redundant with `IconName`. */
export type SideNavIcon = IconName | Exclude<ReactNode, string>;

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

/** Resolves an `icon?: SideNavIcon` prop through the icon registry, or passes a custom node through. */
function renderSideNavIcon(icon: SideNavIcon | undefined, size: 'sm' | 'md' = 'md'): ReactNode {
  if (icon == null || icon === false) return null;
  return isIconName(icon) ? <Icon name={icon} size={size} /> : icon;
}

function normalizeCollapsible(
  collapsible: boolean | SideNavCollapsibleConfig | undefined,
): SideNavCollapsibleConfig {
  return collapsible && typeof collapsible === 'object' ? collapsible : {};
}

export type SideNavCollapseButtonProps = {
  className?: string;
  /** Overrides the accessible label for both expanded/collapsed states. */
  label?: string;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Standalone collapse toggle driven by the nearest `SideNav`'s collapse context.
 * Auto-rendered in the footer when `collapsible.hasButton` is true (the default);
 * render it yourself elsewhere (e.g. in a `TopNav`) paired with `handleRef` for an
 * imperative fallback outside the provider tree.
 */
export function SideNavCollapseButton({
  className,
  label,
  ref,
}: SideNavCollapseButtonProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed, toggle } = useSideNavContext();
  const { isRtl } = useDirection();
  const ariaLabel = label ?? (isCollapsed ? 'Expand navigation' : 'Collapse navigation');
  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      {...mergeProps(s.collapseButton, className)}
    >
      <Icon
        name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
        size="sm"
        data-mirror={isRtl || undefined}
      />
    </button>
  );
}

export type SideNavHeadingProps = {
  heading: ReactNode;
  icon?: SideNavIcon;
  headingHref?: string;
  superheading?: ReactNode;
  subheading?: ReactNode;
  /** Popover or `Menu.FromSections` trigger rendered alongside the brand block (e.g. a team switcher). */
  menu?: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Brand block for the `header` zone: icon, heading text, optional super/sub lines, optional menu trigger. */
export function SideNavHeading({
  heading,
  icon,
  headingHref,
  superheading,
  subheading,
  menu,
  className,
  ref,
}: SideNavHeadingProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed } = useSideNavContext();
  const iconNode = renderSideNavIcon(icon);

  const textNode = isCollapsed ? null : (
    <span {...mergeProps(s.headingBrandText)}>
      {superheading != null ? (
        <span {...mergeProps(s.headingBrandMeta)}>{superheading}</span>
      ) : null}
      <span {...mergeProps(s.headingBrandTitle)}>{heading}</span>
      {subheading != null ? <span {...mergeProps(s.headingBrandMeta)}>{subheading}</span> : null}
    </span>
  );

  const brand = headingHref ? (
    <AriaLink href={headingHref} {...mergeProps(s.headingBrand)}>
      {iconNode}
      {textNode}
    </AriaLink>
  ) : (
    <span {...mergeProps(s.headingBrand)}>
      {iconNode}
      {textNode}
    </span>
  );

  return (
    <div {...mergeProps(s.headingBar, className)} ref={ref}>
      {brand}
      {!isCollapsed && menu ? menu : null}
    </div>
  );
}

export type SideNavSectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/** Groups `SideNav.Item`s under an optional title/subtitle/endContent header. */
export function SideNavSection({
  title,
  subtitle,
  endContent,
  children,
  className,
  ref,
}: SideNavSectionProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed } = useSideNavContext();
  const showHeader = !isCollapsed && (title != null || subtitle != null || endContent != null);

  return (
    <div {...mergeProps(s.section, className)} ref={ref}>
      {showHeader ? (
        <div {...mergeProps(s.sectionHeader)}>
          <div {...mergeProps(s.sectionTitles)}>
            {title != null ? <div {...mergeProps(s.sectionTitle)}>{title}</div> : null}
            {subtitle != null ? (
              <Text as="span" size="sm" tone="secondary">
                {subtitle}
              </Text>
            ) : null}
          </div>
          {endContent}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export type SideNavItemProps = {
  label: string;
  href?: string;
  onPress?: () => void;
  icon?: SideNavIcon;
  /** Swapped in for `icon` while `isSelected`. */
  selectedIcon?: SideNavIcon;
  isSelected?: boolean;
  isDisabled?: boolean;
  endContent?: ReactNode;
  /** Nested `SideNav.Item`s, indented under this item. */
  children?: ReactNode;
  /** Renders an expand/collapse chevron that shows/hides `children`. @default false */
  collapsible?: boolean;
  className?: string;
  /** Ref to the outer `<div>` element wrapping the row and any nested items. */
  ref?: Ref<HTMLDivElement>;
};

const itemRowStyle = { display: 'flex', alignItems: 'stretch', gap: '0.125rem' } as const;
const itemTriggerColumnStyle = { flex: '1 1 auto', minWidth: 0 } as const;
const nestedGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  paddingInlineStart: '1.5rem',
} as const;

/** Link (`href`) or button (`onPress`) row; nests further `SideNav.Item`s via `collapsible`. */
export function SideNavItem({
  label,
  href,
  onPress,
  icon,
  selectedIcon,
  isSelected = false,
  isDisabled = false,
  endContent,
  children,
  collapsible = false,
  className,
  ref,
}: SideNavItemProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed: navCollapsed } = useSideNavContext();
  const { isRtl } = useDirection();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children != null;
  const iconNode = renderSideNavIcon(
    isSelected && selectedIcon !== undefined ? selectedIcon : icon,
  );

  const triggerContent = (
    <>
      {iconNode}
      <span {...mergeProps(s.itemLabel)}>{label}</span>
      {!navCollapsed && endContent != null ? endContent : null}
    </>
  );

  const triggerProps = {
    ...mergeProps(s.item, className),
    'data-selected': isSelected ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
    'aria-current': isSelected ? ('page' as const) : undefined,
    isDisabled,
  };

  const trigger = href ? (
    <AriaLink href={href} {...triggerProps}>
      {triggerContent}
    </AriaLink>
  ) : (
    <AriaButton onPress={onPress} {...triggerProps}>
      {triggerContent}
    </AriaButton>
  );

  const wrappedTrigger = navCollapsed ? (
    <SimpleTooltip content={label} placement="right">
      {trigger}
    </SimpleTooltip>
  ) : (
    trigger
  );

  const showToggle = collapsible && hasChildren && !navCollapsed;
  const showChildren = hasChildren && !navCollapsed && (!collapsible || isExpanded);

  return (
    <div ref={ref}>
      <div style={itemRowStyle}>
        <div style={itemTriggerColumnStyle}>{wrappedTrigger}</div>
        {showToggle ? (
          <IconButton
            name={isExpanded ? 'chevronDown' : 'chevronRight'}
            aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
            tone="accent"
            appearance="ghost"
            size="sm"
            onPress={() => setIsExpanded((expanded) => !expanded)}
            data-mirror={isRtl && !isExpanded ? true : undefined}
          />
        ) : null}
      </div>
      {showChildren ? (
        <div role="group" aria-label={`${label} submenu`} style={nestedGroupStyle}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Persistent side navigation shell: sticky header/footer zones around a
 * scrollable section list, with optional icon-only collapse and drag-resize.
 *
 * ```tsx
 * <SideNav
 *   header={<SideNav.Heading heading="Acme" />}
 *   collapsible
 *   resizable
 * >
 *   <SideNav.Section title="Main">
 *     <SideNav.Item label="Dashboard" href="/" isSelected />
 *     <SideNav.Item label="Projects" collapsible>
 *       <SideNav.Item label="Alpha" href="/projects/alpha" />
 *     </SideNav.Item>
 *   </SideNav.Section>
 * </SideNav>
 * ```
 */
export function SideNav({
  header,
  topContent,
  footer,
  footerIcons,
  children,
  collapsible,
  resizable,
  handleRef,
  className,
  label = 'Side navigation',
  ref,
}: SideNavProps): JSX.Element {
  const s = sideNav();

  const collapsibleEnabled = Boolean(collapsible);
  const collapsibleConfig = normalizeCollapsible(collapsible);
  const hasCollapseButton = collapsibleEnabled && (collapsibleConfig.hasButton ?? true);
  const isControlledCollapse = collapsibleConfig.isCollapsed !== undefined;

  const [internalCollapsed, setInternalCollapsed] = useState(
    collapsibleConfig.defaultIsCollapsed ?? false,
  );
  const isCollapsed = collapsibleEnabled
    ? isControlledCollapse
      ? (collapsibleConfig.isCollapsed as boolean)
      : internalCollapsed
    : false;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isControlledCollapse) setInternalCollapsed(next);
      collapsibleConfig.onCollapsedChange?.(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isControlledCollapse, collapsibleConfig.onCollapsedChange],
  );
  const collapse = useCallback(() => setCollapsed(true), [setCollapsed]);
  const expand = useCallback(() => setCollapsed(false), [setCollapsed]);
  const toggle = useCallback(() => setCollapsed(!isCollapsed), [setCollapsed, isCollapsed]);

  useImperativeHandle(handleRef, () => ({ collapse, expand, toggle }), [collapse, expand, toggle]);

  const resizableEnabled = Boolean(resizable);
  const resizableHookConfig = useMemo(() => {
    if (!resizable) return undefined;
    const base = typeof resizable === 'object' ? resizable : {};
    return collapsibleEnabled ? { ...base, collapsible: base.collapsible ?? true } : base;
  }, [resizable, collapsibleEnabled]);
  const { width, isCollapsed: dragCollapsed, handleProps } = useResizable(resizableHookConfig);

  // Dragging the resize handle below its threshold flips the hook's own collapse
  // tracking; mirror that into the nav's collapse state (icon-only mode) once,
  // rather than every render, so controlled `onCollapsedChange` callers see one
  // transition instead of a redundant call per resize tick.
  const lastDragCollapsedRef = useRef(dragCollapsed);
  useEffect(() => {
    if (!resizableEnabled || !collapsibleEnabled) return;
    if (lastDragCollapsedRef.current === dragCollapsed) return;
    lastDragCollapsedRef.current = dragCollapsed;
    setCollapsed(dragCollapsed);
  }, [dragCollapsed, resizableEnabled, collapsibleEnabled, setCollapsed]);

  const contextValue = useMemo<SideNavContextValue>(
    () => ({ isCollapsed, toggle, collapse, expand }),
    [isCollapsed, toggle, collapse, expand],
  );

  const hasFooter = Boolean(footer || footerIcons || hasCollapseButton);
  const navWidth = isCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : resizableEnabled ? width : undefined;

  return (
    <SideNavContext.Provider value={contextValue}>
      <nav
        ref={ref}
        aria-label={label}
        data-collapsed={isCollapsed ? '' : undefined}
        style={navWidth != null ? { width: navWidth } : undefined}
        {...mergeProps(s.root, className)}
      >
        {header != null || topContent != null ? (
          <div {...mergeProps(s.stickyTop)}>
            {header != null ? <div {...mergeProps(s.heading)}>{header}</div> : null}
            {topContent != null ? <div {...mergeProps(s.topContent)}>{topContent}</div> : null}
          </div>
        ) : null}
        <ScrollArea
          fade={isCollapsed ? false : 'vertical'}
          orientation="vertical"
          className={mergeProps(s.scrollArea).className}
        >
          <div {...mergeProps(s.scrollable)}>{children}</div>
        </ScrollArea>
        {hasFooter ? (
          <div {...mergeProps(s.footer)}>
            {footerIcons != null ? <div {...mergeProps(s.footerIcons)}>{footerIcons}</div> : null}
            {footer}
            {hasCollapseButton ? (
              <SideNavCollapseButton label={collapsibleConfig.buttonLabel} />
            ) : null}
          </div>
        ) : null}
        {resizableEnabled && !isCollapsed ? (
          <ResizeHandle
            {...handleProps}
            onCollapse={collapsibleEnabled ? toggle : undefined}
            aria-label="Resize side navigation"
          />
        ) : null}
      </nav>
    </SideNavContext.Provider>
  );
}

SideNav.Section = SideNavSection;
SideNav.Item = SideNavItem;
SideNav.Heading = SideNavHeading;
SideNav.CollapseButton = SideNavCollapseButton;
