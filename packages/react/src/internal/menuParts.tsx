import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Pressable,
  Separator,
  type Placement,
} from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
import { useLayer } from '../layers/LayerProvider';
import { toRacProps } from './racProps';
import {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  mergeOverlayChild,
  useMergedRef,
  useOverlayPresence,
  usePositionerVars,
  type OverlayOpenChangeHandler,
  type OverlayTriggerProps,
  type UseOverlayPresenceResult,
} from '../overlays';
import { mergeProps } from 'typestyles';

export type MenuRootProps = {
  children: ReactNode;
  open?: boolean;
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

export type MenuTriggerProps = OverlayTriggerProps;

/**
 * Native props go to the popover `<div>`; `aria-label` and `aria-labelledby` go to the inner
 * `role="menu"` element, which is the accessible name target.
 */
export type MenuPopupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /** Preferred placement relative to the trigger. @default bottom */
  placement?: Placement;
  portalContainer?: Element;
};

export type MenuItemProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'id'> & {
  children: ReactNode;
  id: string;
  onAction?: () => void;
  /** Prevents the item from being focused or activated. */
  disabled?: boolean;
  /** Plain-text value used for typeahead when `children` is not a string. */
  textValue?: string;
};

export type MenuSeparatorProps = Omit<ComponentPropsWithRef<'hr'>, 'children'>;

export type MenuSectionProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & {
  children: ReactNode;
  /** Section heading rendered above the items. */
  title?: string;
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
  open,
  defaultOpen = false,
  onOpenChange,
  portalContainer,
}: MenuRootProps): JSX.Element {
  const [uncontrolledOpen, setRequestedOpen] = useState(defaultOpen);
  const requestedOpen = open ?? uncontrolledOpen;
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
      if (open === undefined) setRequestedOpen(next);
    },
    [open, onOpenChange],
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

function MenuPopup({
  children,
  className,
  style,
  placement = 'bottom',
  portalContainer,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: MenuPopupProps): JSX.Element {
  const ctx = useMenuContext();
  const m = menu();
  const { style: layerStyle } = useLayer();
  const positioner = usePositionerVars({
    placement,
    popupRef: ctx.popupRef,
    triggerRef: ctx.triggerRef,
  });
  const setRef = useMergedRef(ctx.popupRef, ref, ctx.setPopupEl);

  return (
    <AriaPopover
      {...rest}
      {...mergeProps(m.popover, className)}
      {...ctx.presence.attrs}
      ref={setRef}
      placement={placement}
      style={{ ...layerStyle, ...positioner.style, ...style }}
      UNSTABLE_portalContainer={portalContainer ?? ctx.portalContainer}
    >
      <AriaMenu
        {...mergeProps(m.menu)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        selectionMode="none"
      >
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
  disabled,
  textValue,
  ref,
  ...rest
}: MenuItemProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuItem
      {...(rest as AriaMenuItemProps)}
      id={id}
      onAction={onAction}
      {...toRacProps({ disabled })}
      textValue={textValue}
      {...mergeProps(m.item, className)}
      ref={ref}
    >
      {children}
    </AriaMenuItem>
  );
}

function MenuSeparator({ className, ...rest }: MenuSeparatorProps): JSX.Element {
  const m = menu();
  return <Separator {...rest} {...mergeProps(m.separator, className)} />;
}

function MenuSection({ children, title, className, ...rest }: MenuSectionProps): JSX.Element {
  const m = menu();
  return (
    <AriaMenuSection {...rest} {...mergeProps(m.section, className)}>
      {title ? <Header {...mergeProps(m.sectionHeader)}>{title}</Header> : null}
      {children}
    </AriaMenuSection>
  );
}

export { MenuRoot, MenuTrigger, MenuPopup, MenuItem, MenuSeparator, MenuSection };
