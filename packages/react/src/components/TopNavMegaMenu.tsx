import type {
  AnchorHTMLAttributes,
  ComponentPropsWithRef,
  HTMLAttributes,
  FocusEvent,
  JSX,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { topNav } from '@var-ui/core/components/topNav';
import { Icon } from '../icons';
import { renderTopNavIcon, type TopNavIcon, type TopNavRichItem } from './TopNav';
import { Text } from './Typography';
import { mergeProps } from 'typestyles';
import { RacLinkOrButton } from '../internal/racDomProps';
import {
  useHoverIntent,
  useMergedRef,
  useOverlayRoot,
  type OverlayOpenChangeHandler,
} from '../overlays';

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
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the panel requests to open or close. `details.cancel()` vetoes the change. */
  onOpenChange?: OverlayOpenChangeHandler;
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
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  openDelay = OPEN_DELAY_DEFAULT,
  closeDelay = CLOSE_DELAY_DEFAULT,
  className,
  onClick,
  ref,
  ...rest
}: TopNavMegaMenuProps): JSX.Element {
  const s = topNav();
  const root = useOverlayRoot({ open: controlledOpen, defaultOpen, onOpenChange });
  const isOpen = root.open;
  const { setOpen, close } = root;

  const containerRef = useRef<HTMLDivElement>(null);
  const setTrigger = useMergedRef<HTMLElement>(root.setTriggerEl, ref as Ref<HTMLElement>);
  const { scheduleOpen, scheduleClose, cancel } = useHoverIntent(root, { openDelay, closeDelay });

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current?.contains(event.target as Node)) return;
      cancel();
      close({ reason: 'outside-press', event });
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, cancel, close]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && isOpen) {
        event.stopPropagation();
        cancel();
        close({ reason: 'escape-key', event: event.nativeEvent });
        root.triggerRef.current?.focus();
      }
    },
    [isOpen, cancel, close, root.triggerRef],
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
        onClick={(event: MouseEvent<HTMLElement>) => {
          (onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
          if (event.defaultPrevented) return;
          cancel();
          setOpen(!isOpen, { reason: 'trigger-press', event: event.nativeEvent });
        }}
        onMouseEnter={(event: MouseEvent<HTMLElement>) =>
          scheduleOpen({ event: event.nativeEvent, reason: 'hover' })
        }
        onMouseLeave={(event: MouseEvent<HTMLElement>) =>
          scheduleClose({ event: event.nativeEvent, reason: 'hover' })
        }
        onFocus={(event: FocusEvent<HTMLElement>) =>
          scheduleOpen({ event: event.nativeEvent, reason: 'focus' })
        }
        onBlur={(event: FocusEvent<HTMLElement>) =>
          scheduleClose({ event: event.nativeEvent, reason: 'focus' })
        }
      >
        <span>{label}</span>
        <Icon name="chevronDown" size="sm" />
      </RacLinkOrButton>
      {isOpen && hasPanelContent ? (
        <div
          {...mergeProps(s.megaPanel)}
          ref={root.setPopupEl}
          onMouseEnter={cancel}
          onMouseLeave={(event) => scheduleClose({ event: event.nativeEvent, reason: 'hover' })}
        >
          <div {...mergeProps(s.megaItems)}>
            {items?.map((item) => (
              <TopNavMegaMenuItem
                key={item.id}
                title={item.title}
                description={item.description}
                href={item.href}
                onClick={item.onClick}
                icon={item.icon}
                disabled={item.disabled}
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

export type TopNavMegaMenuItemProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> &
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'target' | 'rel' | 'download' | 'hrefLang' | 'referrerPolicy' | 'ping'
  > & {
    title: string;
    description?: ReactNode;
    href?: string;
    icon?: TopNavIcon;
    /** @default false */
    disabled?: boolean;
    /** Ref to the underlying `<a>` (with `href`) or `<button>` element. */
    ref?: Ref<HTMLElement>;
  };

/** Mega panel link/row: icon, title, optional description. */
export function TopNavMegaMenuItem({
  title,
  description,
  href,
  icon,
  disabled,
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
      {...rest}
      {...mergeProps(s.megaItem, className)}
      data-disabled={disabled ? '' : undefined}
      isDisabled={disabled}
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
