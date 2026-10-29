import type {
  AnchorHTMLAttributes,
  ComponentPropsWithRef,
  HTMLAttributes,
  JSX,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import { topNav } from '@var-ui/core/components/topNav';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { HoverCard } from './HoverCard';
import { TopNavMegaMenu } from './TopNavMegaMenu';
import { Text } from './Typography';
import { mergeProps } from 'typestyles';
import { RacLinkOrButton } from '../internal/racDomProps';

/** Registry name or a caller-supplied node — excludes bare `string` so it isn't redundant with `IconName`. */
export type TopNavIcon = IconName | Exclude<ReactNode, string>;

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

/** Resolves an `icon?: TopNavIcon` prop through the icon registry, or passes a custom node through. */
export function renderTopNavIcon(
  icon: TopNavIcon | undefined,
  size: 'sm' | 'md' = 'sm',
): ReactNode {
  if (icon == null || icon === false) return null;
  return isIconName(icon) ? <Icon name={icon} size={size} /> : icon;
}

/** Shared shape for `TopNav.Menu` and `TopNav.MegaMenu` rich item lists. */
export type TopNavRichItem = {
  id: string;
  title: string;
  description?: ReactNode;
  href?: string;
  onPress?: () => void;
  icon?: TopNavIcon;
  isDisabled?: boolean;
};

export type TopNavProps = ComponentPropsWithRef<'nav'> & {
  /** Brand block, usually a `TopNav.Heading`. */
  heading?: ReactNode;
  /** Content that begins the bar (nav items, `TopNav.Menu` / `TopNav.MegaMenu`). Alias for `startContent`. */
  children?: ReactNode;
  startContent?: ReactNode;
  /** Centered content — switches the root to a 3-column grid layout when set. */
  centerContent?: ReactNode;
  endContent?: ReactNode;
  /** Accessible name for the `nav` landmark. @default 'Top navigation' */
  label?: string;
};

/**
 * Top navigation bar chrome: heading, start/center/end zones, and optional
 * mega menu. Renders a flex bar, or a 3-column grid when `centerContent` is set.
 *
 * ```tsx
 * <TopNav heading={<TopNav.Heading heading="Acme" />} endContent={<Avatar />}>
 *   <TopNav.Item label="Home" href="/" isSelected />
 *   <TopNav.Menu label="Products" items={[…]} />
 *   <TopNav.MegaMenu label="Solutions" items={[…]} featured={<TopNav.MegaMenu.FeaturedCard … />} />
 * </TopNav>
 * ```
 */
export function TopNav({
  heading,
  children,
  startContent,
  centerContent,
  endContent,
  className,
  label = 'Top navigation',
  ref,
  ...rest
}: TopNavProps): JSX.Element {
  const s = topNav();
  const start = startContent ?? children;
  const hasCenter = centerContent != null;

  return (
    <nav
      aria-label={label}
      {...rest}
      ref={ref}
      data-var-ui-top-nav
      data-layout={hasCenter ? 'grid' : undefined}
      {...mergeProps(s.root, className)}
    >
      {heading != null ? (
        <div data-var-ui-top-nav-heading {...mergeProps(s.heading)}>
          {heading}
        </div>
      ) : null}
      {start != null ? (
        <div data-var-ui-top-nav-start {...mergeProps(s.start)}>
          {start}
        </div>
      ) : null}
      {hasCenter ? (
        <div data-var-ui-top-nav-center {...mergeProps(s.center)}>
          {centerContent}
        </div>
      ) : null}
      {endContent != null ? (
        <div data-var-ui-top-nav-end {...mergeProps(s.end)}>
          {endContent}
        </div>
      ) : null}
    </nav>
  );
}

export type TopNavHeadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
    heading: ReactNode;
    icon?: TopNavIcon;
    headingHref?: string;
    /** Ref to the underlying `<a>` (with `headingHref`) or `<span>` element. */
    ref?: Ref<HTMLElement>;
  };

/** Brand block for the `heading` slot: icon + heading text, optionally linked. */
export function TopNavHeading({
  heading,
  icon,
  headingHref,
  className,
  ref,
  ...rest
}: TopNavHeadingProps): JSX.Element {
  const s = topNav();
  const iconNode = renderTopNavIcon(icon);
  const content = (
    <>
      {iconNode}
      <span>{heading}</span>
    </>
  );

  return headingHref ? (
    <RacLinkOrButton href={headingHref} {...rest} {...mergeProps(s.brand, className)} ref={ref}>
      {content}
    </RacLinkOrButton>
  ) : (
    <span {...rest} {...mergeProps(s.brand, className)} ref={ref}>
      {content}
    </span>
  );
}

export type TopNavItemProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onClick'> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'target' | 'rel' | 'download' | 'hrefLang' | 'referrerPolicy' | 'ping'
  > & {
    label: string;
    href?: string;
    onPress?: () => void;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    icon?: TopNavIcon;
    isSelected?: boolean;
    isDisabled?: boolean;
    /** Hides the visible label, showing only the icon; `label` still provides the accessible name. @default false */
    isIconOnly?: boolean;
    endContent?: ReactNode;
    /** Ref to the underlying `<a>` (with `href`) or `<button>` element. */
    ref?: Ref<HTMLElement>;
  };

/** Link (`href`) or button (`onPress`) bar item; `isSelected` sets `aria-current="page"`. */
export function TopNavItem({
  label,
  href,
  onPress,
  icon,
  isSelected = false,
  isDisabled = false,
  isIconOnly = false,
  endContent,
  className,
  ref,
  ...rest
}: TopNavItemProps): JSX.Element {
  const s = topNav();
  const iconNode = renderTopNavIcon(icon);

  const content = (
    <>
      {iconNode}
      {!isIconOnly ? <span>{label}</span> : null}
      {!isIconOnly && endContent != null ? endContent : null}
    </>
  );

  return (
    <RacLinkOrButton
      href={href}
      onPress={onPress}
      aria-current={isSelected ? 'page' : undefined}
      aria-label={isIconOnly ? label : undefined}
      {...rest}
      {...mergeProps(s.item, className)}
      data-selected={isSelected ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      isDisabled={isDisabled}
      ref={ref}
    >
      {content}
    </RacLinkOrButton>
  );
}

export type TopNavMenuProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string;
  items: TopNavRichItem[];
  /** Delay before the menu opens on hover/focus, in milliseconds. @default 150 */
  openDelay?: number;
  /** Delay before the menu closes after the pointer/focus leaves, in milliseconds. @default 200 */
  closeDelay?: number;
};

/**
 * Hover/focus popover of rich items — built on `HoverCard`. Opens on hover
 * (after `openDelay`) or keyboard focus; documented in tests as hover-driven.
 */
export function TopNavMenu({
  label,
  items,
  openDelay = 150,
  closeDelay = 200,
  className,
  ref,
  ...rest
}: TopNavMenuProps): JSX.Element {
  const s = topNav();

  return (
    <HoverCard
      trigger={
        <RacLinkOrButton {...rest} {...mergeProps(s.menuTrigger, className)} ref={ref}>
          <span>{label}</span>
          <Icon name="chevronDown" size="sm" />
        </RacLinkOrButton>
      }
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <div {...mergeProps(s.menuList)}>
        {items.map((item) => {
          const itemContent = (
            <>
              {renderTopNavIcon(item.icon)}
              <span {...mergeProps(s.richBody)}>
                <span>{item.title}</span>
                {item.description != null ? (
                  <Text as="span" size="sm" tone="secondary">
                    {item.description}
                  </Text>
                ) : null}
              </span>
            </>
          );
          return (
            <RacLinkOrButton
              key={item.id}
              href={item.href}
              onPress={item.onPress}
              {...mergeProps(s.megaItem)}
              data-disabled={item.isDisabled ? '' : undefined}
              isDisabled={item.isDisabled}
            >
              {itemContent}
            </RacLinkOrButton>
          );
        })}
      </div>
    </HoverCard>
  );
}

TopNav.Heading = TopNavHeading;
TopNav.Item = TopNavItem;
TopNav.Menu = TopNavMenu;
TopNav.MegaMenu = TopNavMegaMenu;
