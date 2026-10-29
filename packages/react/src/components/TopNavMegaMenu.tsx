import type { JSX, KeyboardEvent, ReactNode, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { topNav } from '@var-ui/core/components/topNav';
import { Icon } from '../icons';
import { renderTopNavIcon, type TopNavIcon, type TopNavRichItem } from './TopNav';
import { Text } from './Typography';
import { mergeProps } from 'typestyles';

const OPEN_DELAY_DEFAULT = 150;
const CLOSE_DELAY_DEFAULT = 250;

const megaItemsColumnStyle = {
  display: 'grid',
  gap: '0.25rem',
  alignContent: 'start',
} as const;

const richItemBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  minWidth: 0,
} as const;

export type TopNavMegaMenuProps = {
  label: string;
  items?: TopNavRichItem[];
  /** Right-panel slot, usually a `TopNav.MegaMenu.FeaturedCard`. */
  featured?: ReactNode;
  /** Extra panel content rendered alongside `items` (e.g. hand-composed `TopNav.MegaMenu.Item`s). */
  children?: ReactNode;
  /** Controlled open state — omit to let the menu manage it internally. */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Delay before the panel opens on hover/focus, in milliseconds. @default 150 */
  openDelay?: number;
  /** Delay before the panel closes after the pointer/focus leaves, in milliseconds. @default 250 */
  closeDelay?: number;
  className?: string;
  /** Ref to the underlying root `<div>` element (a `display: contents` wrapper around the trigger and panel). */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Full-width panel below the bar, positioned relative to the nearest
 * positioned ancestor (the `TopNav` root) rather than the trigger, so it
 * spans the whole bar. Opens on hover (after `openDelay`) or keyboard focus,
 * closes after `closeDelay`, and dismisses on `Escape` or an outside click.
 */
export function TopNavMegaMenu({
  label,
  items,
  featured,
  children,
  isOpen: controlledOpen,
  onOpenChange,
  openDelay = OPEN_DELAY_DEFAULT,
  closeDelay = CLOSE_DELAY_DEFAULT,
  className,
  ref,
}: TopNavMegaMenuProps): JSX.Element {
  const s = topNav();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const setContainer = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== undefined) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [clearTimers, openDelay, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimers, closeDelay, setOpen]);

  const toggle = useCallback(() => {
    clearTimers();
    setOpen(!isOpen);
  }, [clearTimers, isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current?.contains(event.target as Node)) return;
      clearTimers();
      setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, clearTimers, setOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && isOpen) {
        event.stopPropagation();
        clearTimers();
        setOpen(false);
        triggerRef.current?.focus();
      }
    },
    [isOpen, clearTimers, setOpen],
  );

  const hasPanelContent =
    (items != null && items.length > 0) || children != null || featured != null;

  return (
    // `display: contents` keeps the trigger a direct flex item of the bar zone it's
    // rendered in, while the panel (position: absolute, positioned off the `nav` root)
    // is unaffected either way.
    <div ref={setContainer} onKeyDown={handleKeyDown} style={{ display: 'contents' }}>
      <AriaButton
        ref={triggerRef}
        {...mergeProps(s.menuTrigger, className)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onPress={toggle}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        <span>{label}</span>
        <Icon name="chevronDown" size="sm" />
      </AriaButton>
      {isOpen && hasPanelContent ? (
        <div {...mergeProps(s.megaPanel)} onMouseEnter={clearTimers} onMouseLeave={scheduleClose}>
          <div style={megaItemsColumnStyle}>
            {items?.map((item) => (
              <TopNavMegaMenuItem
                key={item.id}
                title={item.title}
                description={item.description}
                href={item.href}
                onPress={item.onPress}
                icon={item.icon}
                isDisabled={item.isDisabled}
              />
            ))}
            {children}
          </div>
          {featured}
        </div>
      ) : null}
    </div>
  );
}

export type TopNavMegaMenuItemProps = {
  title: string;
  description?: ReactNode;
  href?: string;
  onPress?: () => void;
  icon?: TopNavIcon;
  isDisabled?: boolean;
  className?: string;
  /** Ref to the underlying `<a>` (with `href`) or `<button>` element. */
  ref?: Ref<HTMLElement>;
};

/** Mega panel link/row: icon, title, optional description. */
export function TopNavMegaMenuItem({
  title,
  description,
  href,
  onPress,
  icon,
  isDisabled,
  className,
  ref,
}: TopNavMegaMenuItemProps): JSX.Element {
  const s = topNav();
  const iconNode = renderTopNavIcon(icon);

  const content = (
    <>
      {iconNode}
      <span style={richItemBodyStyle}>
        <span>{title}</span>
        {description != null ? (
          <Text as="span" size="sm" tone="secondary">
            {description}
          </Text>
        ) : null}
      </span>
    </>
  );

  const sharedProps = {
    ...mergeProps(s.megaItem, className),
    'data-disabled': isDisabled ? '' : undefined,
    isDisabled,
  };

  return href ? (
    <AriaLink href={href} {...sharedProps} ref={ref as Ref<HTMLAnchorElement>}>
      {content}
    </AriaLink>
  ) : (
    <AriaButton onPress={onPress} {...sharedProps} ref={ref as Ref<HTMLButtonElement>}>
      {content}
    </AriaButton>
  );
}

export type TopNavMegaMenuFeaturedCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  image?: ReactNode;
  action?: ReactNode;
  /** Full manual composition — overrides `title`/`description`/`image`/`action`. */
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<a>` (with `href`) or `<div>` element. */
  ref?: Ref<HTMLElement>;
};

const featuredCardLinkStyle = { textDecoration: 'none', color: 'inherit' } as const;

/** Featured content for the mega panel's right-hand slot. */
export function TopNavMegaMenuFeaturedCard({
  title,
  description,
  href,
  image,
  action,
  children,
  className,
  ref,
}: TopNavMegaMenuFeaturedCardProps): JSX.Element {
  const s = topNav();
  const body = children ?? (
    <>
      {image}
      {title != null ? <Text weight="semibold">{title}</Text> : null}
      {description != null ? (
        <Text size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
      {action}
    </>
  );

  return href ? (
    <AriaLink
      href={href}
      {...mergeProps(s.featuredCard, className)}
      style={featuredCardLinkStyle}
      ref={ref as Ref<HTMLAnchorElement>}
    >
      {body}
    </AriaLink>
  ) : (
    <div {...mergeProps(s.featuredCard, className)} ref={ref as Ref<HTMLDivElement>}>
      {body}
    </div>
  );
}

TopNavMegaMenu.Item = TopNavMegaMenuItem;
TopNavMegaMenu.FeaturedCard = TopNavMegaMenuFeaturedCard;
