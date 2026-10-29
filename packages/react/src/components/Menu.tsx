import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Pressable,
  Separator,
} from 'react-aria-components';
import { menu } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  useOverlayPresence,
  usePositionerVars,
  type OverlayOpenChangeHandler,
  type UseOverlayPresenceResult,
} from '../overlays';
import { MenuContent } from './menuContent';
import { MenuContextMenu, MenuFromSections, MenuOverflow } from './menuPresets';
import { mergeProps } from 'typestyles';

export type { MenuContentProps, MenuItemDefinition, MenuSectionDefinition } from './menuContent';
export type { MenuContextMenuProps, MenuFromSectionsProps, MenuOverflowProps } from './menuPresets';

export type MenuRootProps = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Element the menu portals into instead of `document.body`. Needed when a subtree renders
   * under a different theme than the page ambient.
   */
  portalContainer?: Element;
};

/** Alias for docs and consumers referring to the root menu props. */
export type MenuProps = MenuRootProps;

export type MenuTriggerProps = {
  children: ReactElement;
  className?: string;
  /** Ref to the trigger element. */
  ref?: Ref<HTMLElement>;
};

export type MenuPopupProps = {
  children: ReactNode;
  className?: string;
  portalContainer?: Element;
  /** Ref to the underlying popover `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type MenuItemProps = {
  children: ReactNode;
  id: string;
  onAction?: () => void;
  className?: string;
  isDisabled?: boolean;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type MenuSeparatorProps = {
  className?: string;
  /** Ref to the underlying separator element. */
  ref?: Ref<HTMLElement>;
};

export type MenuSectionProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  /** Ref to the underlying `<section>` element. */
  ref?: Ref<HTMLElement>;
};

type MenuContextValue = {
  presence: UseOverlayPresenceResult;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  triggerRef: MutableRefObject<HTMLElement | null>;
  setPopupEl: (element: HTMLDivElement | null) => void;
  setTriggerEl: (element: HTMLElement | null) => void;
  portalContainer?: Element;
  lastEventRef: MutableRefObject<Event | null>;
  handleOpenChange: (next: boolean) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('Menu compound components must be rendered inside <Menu>.');
  }
  return ctx;
}

function composeHandler(existing: unknown, ours: (...args: unknown[]) => void) {
  if (typeof existing !== 'function') {
    return ours;
  }
  return (...args: unknown[]) => {
    existing(...args);
    ours(...args);
  };
}

function MenuRoot({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: MenuRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = isOpen ?? uncontrolledOpen;
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setPopupEl] = useState<HTMLDivElement | null>(null);
  const [, setTriggerEl] = useState<HTMLElement | null>(null);
  const lastEventRef = useRef<Event | null>(null);

  const presence = useOverlayPresence({
    isOpen: requestedOpen,
    getAnimatedElements: () => [popupRef.current],
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      const details = createOverlayChangeDetails({
        reason: inferOverlayCloseReason(lastEventRef.current),
        event: lastEventRef.current,
      });
      onOpenChange?.(next, details);
      lastEventRef.current = null;
      if (details.isCanceled) return;
      if (isOpen === undefined) setRequestedOpen(next);
    },
    [isOpen, onOpenChange],
  );

  useEffect(() => {
    if (!presence.mounted) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        lastEventRef.current = event;
        return;
      }
      if (popupRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      lastEventRef.current = event;
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [presence.mounted]);

  const context = useMemo<MenuContextValue>(
    () => ({
      presence,
      popupRef,
      triggerRef,
      setPopupEl,
      setTriggerEl,
      portalContainer,
      lastEventRef,
      handleOpenChange,
    }),
    [handleOpenChange, portalContainer, presence],
  );

  return (
    <MenuContext.Provider value={context}>
      {/*
        RAC MenuTrigger has no DOM node. Root captures the last keydown here so
        inferOverlayCloseReason can map Escape. Document pointerdown (outside popup
        and trigger) is outside-press; Trigger stashes press/click (trigger-press).
        cancel() only blocks uncontrolled requestedOpen updates after onOpenChange.
      */}
      <div
        style={{ display: 'contents' }}
        onKeyDownCapture={(event) => {
          lastEventRef.current = event.nativeEvent;
        }}
      >
        <AriaMenuTrigger isOpen={presence.mounted} onOpenChange={handleOpenChange}>
          {children}
        </AriaMenuTrigger>
      </div>
    </MenuContext.Provider>
  );
}

function MenuTrigger({ children, className, ref, ...props }: MenuTriggerProps): JSX.Element {
  const ctx = useMenuContext();
  const child = Children.only(children);
  const stashTriggerPress = (...args: unknown[]) => {
    const event = args[0] as { nativeEvent?: Event } | Event | undefined;
    if (event instanceof Event) {
      ctx.lastEventRef.current = event;
      return;
    }
    if (event?.nativeEvent instanceof Event) {
      ctx.lastEventRef.current = event.nativeEvent;
      return;
    }
    ctx.lastEventRef.current = new Event('press');
  };
  const assignTriggerEl = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    ctx.setTriggerEl(node);
  };
  const triggerProps = props as Record<string, unknown>;
  const racTriggerProps: Record<string, unknown> = {
    ...triggerProps,
    className,
    ref: (node: HTMLElement | null) => {
      assignTriggerEl(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onClick: composeHandler(triggerProps.onClick, stashTriggerPress),
    onPress: composeHandler(triggerProps.onPress, stashTriggerPress),
    onPointerDown: composeHandler(triggerProps.onPointerDown, () => {
      ctx.lastEventRef.current = new Event('press');
    }),
  };
  const merged = mergeOverlayChild(child, racTriggerProps);
  if (typeof child.type === 'string') {
    return <Pressable>{merged as ReactElement<{ className?: string }, string>}</Pressable>;
  }
  return merged;
}

function MenuPopup({ children, className, portalContainer, ref }: MenuPopupProps): JSX.Element {
  const ctx = useMenuContext();
  const m = menu();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement: 'bottom',
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });

  return (
    <AriaPopover
      {...mergeProps(m.popover, className)}
      {...ctx.presence.attrs}
      ref={(node: HTMLDivElement | null) => {
        ctx.popupRef.current = node;
        ctx.setPopupEl(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      style={{ ...layerStyle, ...positioner.style }}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      <AriaMenu {...mergeProps(m.menu)} selectionMode="none">
        {children}
      </AriaMenu>
    </AriaPopover>
  );
}

function MenuItem({
  children,
  id,
  onAction,
  className,
  isDisabled,
  ref,
}: MenuItemProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuItem
      id={id}
      onAction={onAction}
      isDisabled={isDisabled}
      {...mergeProps(m.item, className)}
      ref={ref}
    >
      {children}
    </AriaMenuItem>
  );
}

function MenuSeparator({ className, ref }: MenuSeparatorProps): JSX.Element {
  const m = menu();
  return <Separator {...mergeProps(m.separator, className)} ref={ref} />;
}

function MenuSection({ children, title, className, ref }: MenuSectionProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuSection {...mergeProps(m.section, className)} ref={ref}>
      {title ? <Header {...mergeProps(m.sectionHeader)}>{title}</Header> : null}
      {children}
    </AriaMenuSection>
  );
}

/**
 * Action menu namespace. Compose parts for full control, or use presets for common cases.
 *
 * ```tsx
 * // Compound
 * <Menu>
 *   <Menu.Trigger><Button>Song</Button></Menu.Trigger>
 *   <Menu.Popup>
 *     <Menu.Item id="lib" onAction={fn}>Add to Library</Menu.Item>
 *   </Menu.Popup>
 * </Menu>
 *
 * // Data preset
 * <Menu.FromSections trigger={<Button>Actions</Button>} sections={[...]} />
 *
 * // Right-click
 * <Menu.ContextMenu sections={[...]}><div>Right-click me</div></Menu.ContextMenu>
 *
 * // Overflow
 * <Menu.Overflow sections={[...]} />
 * ```
 */
export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Section: MenuSection,
  Content: MenuContent,
  FromSections: MenuFromSections,
  ContextMenu: MenuContextMenu,
  Overflow: MenuOverflow,
});
