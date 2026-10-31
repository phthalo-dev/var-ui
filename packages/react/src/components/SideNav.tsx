import type {
  AnchorHTMLAttributes,
  ComponentPropsWithRef,
  HTMLAttributes,
  JSX,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
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
import { Link as AriaLink } from 'react-aria-components';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import { sideNav, SIDE_NAV_COLLAPSED_WIDTH } from '@var-ui/core/components/sideNav';
import type { IconName } from '@var-ui/core';
import { useDirection } from '../DirectionProvider';
import { Icon } from '../icons';
import { useResizable, type ResizableConfig } from '../hooks';
import { IconButton } from './IconButton';
import { ResizeHandle } from './ResizeHandle';
import { Text } from './Typography';
import { Tooltip } from './Tooltip';
import { ScrollArea } from './ScrollArea';
import { mergeProps } from 'typestyles';
import { RacLinkOrButton } from '../internal/racDomProps';

export type SideNavCollapsibleConfig = {
  /** Initial collapsed state for uncontrolled usage. @default false */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state — omit to let `SideNav` manage it internally. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
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

export type SideNavProps = Omit<ComponentPropsWithRef<'nav'>, 'ref'> & {
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
  /** Accessible name for the `nav` landmark. @default 'Side navigation' */
  label?: string;
  /** Accessible name of the drag handle rendered by `resizable`. @default 'Resize side navigation' */
  resizeHandleLabel?: string;
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

export type SideNavCollapseButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** Overrides the accessible label for both expanded/collapsed states. */
  label?: string;
  /** Accessible label while the nav is collapsed. @default 'Expand navigation' */
  expandLabel?: string;
  /** Accessible label while the nav is expanded. @default 'Collapse navigation' */
  collapseLabel?: string;
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
  expandLabel = 'Expand navigation',
  collapseLabel = 'Collapse navigation',
  onClick,
  ref,
  ...rest
}: SideNavCollapseButtonProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed, toggle } = useSideNavContext();
  const { isRtl } = useDirection();
  const ariaLabel = label ?? (isCollapsed ? expandLabel : collapseLabel);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...rest}
      ref={ref}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
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

export type SideNavHeadingProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  heading: ReactNode;
  icon?: SideNavIcon;
  headingHref?: string;
  superheading?: ReactNode;
  subheading?: ReactNode;
  /** Popover or `Menu.FromSections` trigger rendered alongside the brand block (e.g. a team switcher). */
  menu?: ReactNode;
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
  ...rest
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
    <div {...rest} {...mergeProps(s.headingBar, className)} ref={ref}>
      {brand}
      {!isCollapsed && menu ? menu : null}
    </div>
  );
}

export type SideNavSectionProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  endContent?: ReactNode;
};

/** Groups `SideNav.Item`s under an optional title/subtitle/endContent header. */
export function SideNavSection({
  title,
  subtitle,
  endContent,
  children,
  className,
  ref,
  ...rest
}: SideNavSectionProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed } = useSideNavContext();
  const showHeader = !isCollapsed && (title != null || subtitle != null || endContent != null);

  return (
    <div {...rest} {...mergeProps(s.section, className)} ref={ref}>
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

export type SideNavItemProps = Omit<HTMLAttributes<HTMLElement>, 'children'> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'target' | 'rel' | 'download' | 'hrefLang' | 'referrerPolicy' | 'ping'
  > & {
    label: string;
    href?: string;
    icon?: SideNavIcon;
    /** Swapped in for `icon` while `selected`. */
    selectedIcon?: SideNavIcon;
    /** Marks the current page (`aria-current="page"`). @default false */
    selected?: boolean;
    /** @default false */
    disabled?: boolean;
    endContent?: ReactNode;
    /** Nested `SideNav.Item`s, indented under this item. */
    children?: ReactNode;
    /** Renders an expand/collapse chevron that shows/hides `children`. @default false */
    collapsible?: boolean;
    /** Accessible label of the chevron toggle while the children are collapsed. @default `Expand ${label}` */
    expandLabel?: string;
    /** Accessible label of the chevron toggle while the children are shown. @default `Collapse ${label}` */
    collapseLabel?: string;
    /** Accessible name of the nested group. @default `${label} submenu` */
    submenuLabel?: string;
    /** Ref to the `<a>` (with `href`) or `<button>` row element. */
    ref?: Ref<HTMLElement>;
  };

/**
 * Link (`href`) or button (`onClick`) row; nests further `SideNav.Item`s via
 * `collapsible`. A leaf item renders just the row element (same DOM as the Astro
 * peer); an item with children wraps the row, chevron toggle and nested group.
 */
export function SideNavItem({
  label,
  href,
  icon,
  selectedIcon,
  selected = false,
  disabled = false,
  endContent,
  children,
  collapsible = false,
  expandLabel,
  collapseLabel,
  submenuLabel,
  className,
  ref,
  ...rest
}: SideNavItemProps): JSX.Element {
  const s = sideNav();
  const { isCollapsed: navCollapsed } = useSideNavContext();
  const { isRtl } = useDirection();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children != null;
  const iconNode = renderSideNavIcon(selected && selectedIcon !== undefined ? selectedIcon : icon);

  const triggerContent = (
    <>
      {iconNode}
      <span {...mergeProps(s.itemLabel)}>{label}</span>
      {!navCollapsed && endContent != null ? endContent : null}
    </>
  );

  const trigger = (
    <RacLinkOrButton
      href={href}
      aria-current={selected ? 'page' : undefined}
      {...rest}
      {...mergeProps(s.item, className)}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      isDisabled={disabled}
      ref={ref}
    >
      {triggerContent}
    </RacLinkOrButton>
  );

  const wrappedTrigger = navCollapsed ? (
    <Tooltip.Root>
      <Tooltip.Trigger>{trigger}</Tooltip.Trigger>
      <Tooltip.Popup placement="end">{label}</Tooltip.Popup>
    </Tooltip.Root>
  ) : (
    trigger
  );

  if (!hasChildren || navCollapsed) return wrappedTrigger;

  const showToggle = collapsible;
  const showChildren = !collapsible || isExpanded;

  return (
    <div>
      <div {...mergeProps(s.itemRow)}>
        <div {...mergeProps(s.itemMain)}>{wrappedTrigger}</div>
        {showToggle ? (
          <IconButton
            icon={isExpanded ? 'chevronDown' : 'chevronRight'}
            aria-label={
              isExpanded
                ? (collapseLabel ?? `Collapse ${label}`)
                : (expandLabel ?? `Expand ${label}`)
            }
            tone="accent"
            appearance="ghost"
            size="sm"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            data-mirror={isRtl && !isExpanded ? true : undefined}
          />
        ) : null}
      </div>
      {showChildren ? (
        <div
          role="group"
          aria-label={submenuLabel ?? `${label} submenu`}
          {...mergeProps(s.nestedGroup)}
        >
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
 *     <SideNav.Item label="Dashboard" href="/" selected />
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
  style,
  label = 'Side navigation',
  resizeHandleLabel = 'Resize side navigation',
  ref,
  ...rest
}: SideNavProps): JSX.Element {
  const s = sideNav();

  const collapsibleEnabled = Boolean(collapsible);
  const collapsibleConfig = normalizeCollapsible(collapsible);
  const hasCollapseButton = collapsibleEnabled && (collapsibleConfig.hasButton ?? true);
  const isControlledCollapse = collapsibleConfig.collapsed !== undefined;

  const [internalCollapsed, setInternalCollapsed] = useState(
    collapsibleConfig.defaultCollapsed ?? false,
  );
  const isCollapsed = collapsibleEnabled
    ? isControlledCollapse
      ? (collapsibleConfig.collapsed as boolean)
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
        aria-label={label}
        {...rest}
        ref={ref}
        data-collapsed={isCollapsed ? '' : undefined}
        data-collapsible={collapsibleEnabled ? '' : undefined}
        data-resizable={resizableEnabled ? '' : undefined}
        style={navWidth != null ? { ...style, width: navWidth } : style}
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
            aria-label={resizeHandleLabel}
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
