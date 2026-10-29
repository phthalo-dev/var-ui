import type {
  AnchorHTMLAttributes,
  ComponentPropsWithRef,
  HTMLAttributes,
  JSX,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { topNav } from '@var-ui/core/components/topNav';
import { Icon } from '../icons';
import { renderTopNavIcon, type TopNavIcon, type TopNavRichItem } from './TopNav';
import { Text } from './Typography';
import { mergeProps } from 'typestyles';
import { RacLinkOrButton } from '../internal/racDomProps';

const OPEN_DELAY_DEFAULT = 150;
const CLOSE_DELAY_DEFAULT = 250;

export type TopNavMegaMenuProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
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
  ...rest
}: TopNavMegaMenuProps): JSX.Element {
  const s = topNav();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const setTrigger = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node as HTMLButtonElement | null;
      if (typeof ref === 'function') return ref(node as HTMLButtonElement | null);
      if (ref) ref.current = node as HTMLButtonElement | null;
    },
    [ref],
  );
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
    // The wrapper is `display: contents` (`megaRoot`), so the trigger stays a direct flex
    // item of the bar zone it's rendered in, while the panel (position: absolute,
    // positioned off the `nav` root) is unaffected either way. Props and `ref` go to
    // the trigger button.
    <div ref={containerRef} onKeyDown={handleKeyDown} {...mergeProps(s.megaRoot)}>
      <RacLinkOrButton
        {...rest}
        ref={setTrigger}
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
      </RacLinkOrButton>
      {isOpen && hasPanelContent ? (
        <div {...mergeProps(s.megaPanel)} onMouseEnter={clearTimers} onMouseLeave={scheduleClose}>
          <div {...mergeProps(s.megaItems)}>
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

export type TopNavMegaMenuItemProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'title' | 'onClick'
> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'target' | 'rel' | 'download' | 'hrefLang' | 'referrerPolicy' | 'ping'
  > & {
    title: string;
    description?: ReactNode;
    href?: string;
    onPress?: () => void;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    icon?: TopNavIcon;
    isDisabled?: boolean;
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
  ...rest
}: TopNavMegaMenuItemProps): JSX.Element {
  const s = topNav();
  const iconNode = renderTopNavIcon(icon);

  const content = (
    <>
      {iconNode}
      <span {...mergeProps(s.richBody)}>
        <span>{title}</span>
        {description != null ? (
          <Text as="span" size="sm" tone="secondary">
            {description}
          </Text>
        ) : null}
      </span>
    </>
  );

  return (
    <RacLinkOrButton
      href={href}
      onPress={onPress}
      {...rest}
      {...mergeProps(s.megaItem, className)}
      data-disabled={isDisabled ? '' : undefined}
      isDisabled={isDisabled}
      ref={ref}
    >
      {content}
    </RacLinkOrButton>
  );
}

export type TopNavMegaMenuFeaturedCardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  image?: ReactNode;
  action?: ReactNode;
  /** Full manual composition — overrides `title`/`description`/`image`/`action`. */
  children?: ReactNode;
  /** Ref to the underlying `<a>` (with `href`) or `<div>` element. */
  ref?: Ref<HTMLElement>;
};

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
  ...rest
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
    <RacLinkOrButton href={href} {...rest} {...mergeProps(s.featuredCard, className)} ref={ref}>
      {body}
    </RacLinkOrButton>
  ) : (
    <div {...rest} {...mergeProps(s.featuredCard, className)} ref={ref as Ref<HTMLDivElement>}>
      {body}
    </div>
  );
}

TopNavMegaMenu.Item = TopNavMegaMenuItem;
TopNavMegaMenu.FeaturedCard = TopNavMegaMenuFeaturedCard;
