import type {
  ComponentPropsWithRef,
  ContextType,
  CSSProperties,
  FocusEvent,
  JSX,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RootMenuTriggerStateContext } from 'react-aria-components';
import { menubar } from '@var-ui/core/components/menubar';
import type { ControlSize } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { useControlSize } from '../internal/controlSizeContext';
import { mergeRefs } from '../internal/mergeRefs';
import { MenuPopup, MenuRoot, MenuTrigger } from '../internal/menuParts';
import {
  arrowDelta,
  getRovingItems,
  isRtl,
  stepRovingItem,
  useRovingFocus,
} from '../internal/useRovingFocus';
import type { AnchorPlacement, OverlayChangeEventDetails } from '../overlays';

export type MenubarProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'role'
> & {
  /** The `Menubar.Menu`s. */
  children?: ReactNode;
  /** Control density. Falls back to the surrounding control size, then `md`. */
  size?: ControlSize;
  className?: string;
  style?: CSSProperties;
  /** Ref to the `role="menubar"` element. Name it with `aria-label` or `aria-labelledby`. */
  ref?: Ref<HTMLDivElement>;
};

export type MenubarMenuProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'type' | 'role' | 'className' | 'style' | 'ref' | 'onChange'
> & {
  /** The trigger's content: the menu's name (`File`, `Edit`...). */
  label: ReactNode;
  /** The menu's `Menu.Item`, `Menu.Section`, `Menu.Separator` and `Menu.Submenu` children. */
  children: ReactNode;
  /** Disables this menu's trigger: it is skipped by arrow-key navigation. */
  disabled?: boolean;
  /** Preferred placement of the popup relative to the trigger. @default bottom start */
  placement?: AnchorPlacement;
  /** Gap between trigger and popup: a number is px, a string any CSS length. */
  offset?: number | string;
  /**
   * Called when the menu requests to open or close. `details.reason` is `trigger-press`,
   * `escape-key`, `outside-press`, `focus`, `hover` (switched to by hovering another top-level
   * item) or `imperative` (switched to with the arrow keys); `details.cancel()` vetoes it.
   */
  onOpenChange?: (open: boolean, details: OverlayChangeEventDetails) => void;
  /** Class names for the trigger button. */
  className?: string;
  style?: CSSProperties;
  /** Ref to the trigger `<button>`. */
  ref?: Ref<HTMLButtonElement>;
};

type OpenChangeHandler = NonNullable<MenubarMenuProps['onOpenChange']>;
type RootMenuTriggerState = NonNullable<ContextType<typeof RootMenuTriggerStateContext>>;

type Entry = {
  triggerEl: HTMLElement | null;
  popupRef: RefObject<HTMLElement | null>;
  state: RootMenuTriggerState | null;
};

type MenubarContextValue = {
  trigger: ReturnType<typeof menubar>['trigger'];
  active: string | null;
  entries: Map<string, Entry>;
  handleChange: (
    id: string,
    open: boolean,
    details: OverlayChangeEventDetails,
    userHandler?: OpenChangeHandler,
  ) => void;
  /** Hover-switch (on real pointer movement): opens `id` (and closes the open menu) while a menu is open. */
  hoverSwitch: (id: string) => void;
};

const MenubarContext = createContext<MenubarContextValue | null>(null);

const TRIGGER_ATTR = 'data-menubar-trigger';
const TRIGGER_SELECTOR = `[${TRIGGER_ATTR}]`;
const ROOT_SELECTOR = '[role="menubar"][data-menubar]';

/**
 * A horizontal bar of menus, like a desktop application menu (File, Edit, View...).
 *
 * ```tsx
 * <Menubar aria-label="Application">
 *   <Menubar.Menu label="File">
 *     <Menu.Item id="new" onAction={newFile}>New</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item id="quit" onAction={quit}>Quit</Menu.Item>
 *   </Menubar.Menu>
 *   <Menubar.Menu label="Edit">...</Menubar.Menu>
 * </Menubar>
 * ```
 *
 * Accessibility: the APG menubar pattern. `role="menubar"` of `role="menuitem"` buttons with
 * `aria-haspopup="menu"` and `aria-expanded`; one Tab stop for the bar, Left/Right (mirrored in
 * RTL, wrapping), Home and End move between the top-level items; Down, Up, Enter and Space open a
 * menu. While a menu is open Left/Right switch to the adjacent menu, and so does hovering
 * another top-level item. The popups are the same native popovers as `Menu`.
 */
export function Menubar(props: MenubarProps): JSX.Element {
  const { size, className, children, ref, onKeyDown, onKeyDownCapture, onFocus, ...rest } = props;

  const contextSize = useControlSize();
  const m = menubar({ size: size ?? contextSize ?? 'md' });
  const rootRef = useRef<HTMLDivElement>(null);
  const setRoot = useMemo(() => mergeRefs(rootRef, ref), [ref]);

  // One open menu at a time. The ref is the synchronous truth (several changes can be requested
  // in one event, before React re-renders); the state re-renders the menus.
  const [active, setActiveState] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const entries = useRef(new Map<string, Entry>()).current;
  const switching = useRef<{ reason: OverlayChangeEventDetails['reason'] } | null>(null);

  const handleChange = useCallback<MenubarContextValue['handleChange']>(
    (id, open, details, userHandler) => {
      if (switching.current) details.reason = switching.current.reason;
      userHandler?.(open, details);
      if (details.isCanceled) return;
      if (open) activeRef.current = id;
      else if (activeRef.current === id) activeRef.current = null;
      setActiveState(activeRef.current);
    },
    [],
  );

  /**
   * Moves the open menu to `id`. The new trigger is focused first so the old popup closes on
   * blur and the new popup remembers its trigger (not an item of the old menu) as the place to
   * return focus to; then the new menu opens through react-aria's own state, which focuses
   * the first item for `'first'`.
   */
  const switchTo = useCallback(
    (id: string, strategy: 'first' | null, reason: OverlayChangeEventDetails['reason']): void => {
      const entry = entries.get(id);
      if (!entry?.triggerEl || !entry.state) return;
      switching.current = { reason };
      try {
        entry.triggerEl.focus({ preventScroll: true });
        const previous = activeRef.current;
        if (previous && previous !== id) entries.get(previous)?.state?.close();
        if (activeRef.current && activeRef.current !== id) return; // closing was vetoed
        entry.state.open(strategy);
        // react-aria focuses the first item when the menu mounts. A menu reopened while its exit
        // animation still runs stays mounted and focuses nothing (the popup shell takes focus),
        // so make sure focus reached an item.
        if (strategy === 'first') {
          requestAnimationFrame(() => {
            const popup = entry.popupRef.current;
            if (activeRef.current !== id || !popup?.isConnected) return;
            if (
              document.activeElement?.closest('[role="menuitem"]')?.closest('[popover]') === popup
            )
              return;
            popup
              .querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
              ?.focus();
          });
        }
      } finally {
        switching.current = null;
      }
    },
    [entries],
  );

  const idOf = (el: HTMLElement | undefined) =>
    el ? [...entries].find(([, entry]) => entry.triggerEl === el)?.[0] : undefined;

  const hoverSwitch = useCallback(
    (id: string) => {
      if (activeRef.current && activeRef.current !== id) switchTo(id, null, 'hover');
    },
    [switchTo],
  );

  const roving = useRovingFocus(rootRef, {
    itemSelector: TRIGGER_SELECTOR,
    scopeSelector: ROOT_SELECTOR,
    wrap: true,
    // With a menu open, moving along the bar moves the open menu too (focus on the first item).
    onNavigate: (target) => {
      if (!activeRef.current) return false;
      const id = idOf(target);
      if (!id) return false;
      switchTo(id, 'first', 'imperative');
      return true;
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    roving.onKeyDown(event);
  };

  // Left/Right inside an open menu: the adjacent menu opens with its first item focused. Capture
  // phase, so react-aria's menu does not also handle the key.
  const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCapture?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const root = event.currentTarget;
    const target = event.target as HTMLElement;
    const shell = target.closest('[popover]');
    if (!shell || !root.contains(shell)) return;
    const delta = arrowDelta(event.key, 'horizontal', isRtl(root));
    // Submenus (their shell sits inside the parent shell): the key that closes one, and the key
    // that opens one on a submenu trigger item, are react-aria's. Anything else moves the bar.
    if (delta === -1 && shell.parentElement?.closest('[popover]')) return;
    if (delta === 1 && target.closest('[role="menuitem"]')?.hasAttribute('aria-haspopup')) return;
    const from = activeRef.current ? entries.get(activeRef.current)?.triggerEl : null;
    if (!from || delta === 0) return;
    event.preventDefault();
    event.stopPropagation();
    const items = getRovingItems(root, TRIGGER_SELECTOR, ROOT_SELECTOR);
    const next = stepRovingItem(items, from, delta, true);
    const id = idOf(next);
    if (id && id !== activeRef.current) switchTo(id, 'first', 'imperative');
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    roving.onFocus(event);
  };

  const context = useMemo<MenubarContextValue>(
    () => ({ trigger: m.trigger, active, entries, handleChange, hoverSwitch }),
    [m.trigger, active, entries, handleChange, hoverSwitch],
  );

  return (
    <MenubarContext.Provider value={context}>
      <div
        {...rest}
        role="menubar"
        data-menubar=""
        {...mergeProps(m.root, className)}
        ref={setRoot}
        onKeyDown={handleKeyDown}
        onKeyDownCapture={handleKeyDownCapture}
        onFocus={handleFocus}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

function MenubarMenu({ onOpenChange, ...props }: MenubarMenuProps): JSX.Element {
  const bar = useContext(MenubarContext);
  if (!bar) throw new Error('Menubar.Menu must be rendered inside a Menubar');
  const id = useId();
  return (
    <MenuRoot
      open={bar.active === id}
      onOpenChange={(open, details) => bar.handleChange(id, open, details, onOpenChange)}
    >
      <MenubarMenuBody {...props} menuId={id} bar={bar} />
    </MenuRoot>
  );
}

function MenubarMenuBody({
  menuId,
  bar,
  label,
  children,
  disabled,
  placement,
  offset,
  className,
  onPointerMove,
  ref,
  ...rest
}: Omit<MenubarMenuProps, 'onOpenChange'> & { menuId: string; bar: MenubarContextValue }) {
  const state = useContext(RootMenuTriggerStateContext);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const setTrigger = useMemo(() => mergeRefs(triggerRef, ref), [ref]);

  // Registers this menu with the bar so it can open/close it (react-aria's state) by id.
  useLayoutEffect(() => {
    bar.entries.set(menuId, { triggerEl: triggerRef.current, popupRef, state });
    return () => {
      bar.entries.delete(menuId);
    };
  }, [bar.entries, menuId, state]);

  const open = bar.active === menuId;
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== 'touch' && !disabled) bar.hoverSwitch(menuId);
  };

  const button = (
    <button
      {...rest}
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      {...{ [TRIGGER_ATTR]: '' }}
      data-open={open ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      {...mergeProps(bar.trigger, className)}
      onPointerMove={handlePointerMove}
      ref={setTrigger}
    >
      {label}
    </button>
  );

  // A disabled menu is a plain disabled button: react-aria's trigger would need a focusable child.
  if (disabled) return button;
  return (
    <>
      <MenuTrigger>{button}</MenuTrigger>
      <MenuPopup placement={placement} offset={offset} ref={popupRef}>
        {children}
      </MenuPopup>
    </>
  );
}

Menubar.Menu = MenubarMenu;
