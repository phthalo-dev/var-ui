import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  MenuContext as AriaMenuContext,
  MenuSection as AriaMenuSection,
  OverlayTriggerStateContext,
  PopoverContext,
  Provider,
  RootMenuTriggerStateContext,
  Separator,
  SubmenuTrigger as AriaSubmenuTrigger,
  type Key,
} from 'react-aria-components';
import type { IconName } from '@var-ui/core';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import { Icon } from '../icons';
import { menu } from '@var-ui/core/components/menu';
import {
  isMenuArrowKey,
  MENU_ROW_SELECTOR,
  menuArrowTarget,
} from '@var-ui/core/shared/menuNavigation';
import { NativePopover } from './NativePopover';
import { toRacProps } from './racProps';
import {
  createOverlayContext,
  OverlayTrigger,
  useMergedRef,
  useOverlayRoot,
  type AnchorPlacement,
  type OverlayOpenChangeHandler,
  type OverlayRoot,
  type OverlayTriggerProps,
} from '../overlays';
import { combine, mergeProps } from 'typestyles';
import { useControllableState } from '../hooks/useControllableState';

export type MenuRootProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /**
   * Called when the menu requests to open or close. `details.reason` is `trigger-press`,
   * `escape-key`, `outside-press`, `focus` or `imperative`; `details.cancel()` vetoes the change.
   */
  onOpenChange?: OverlayOpenChangeHandler;
  /**
   * Checked item id (controlled). Passing `value`, `defaultValue` or `onValueChange` makes the menu
   * a single-choice menu: items become `menuitemradio` with a check mark, and choosing one checks it. `null` means
   * selectable with nothing checked. Applies to the top-level items, not to submenus.
   */
  value?: string | null;
  /** Initially checked item id when uncontrolled (see `value`). */
  defaultValue?: string | null;
  /** Called with the newly checked item id. */
  onValueChange?: (value: string | null) => void;
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
  /**
   * Preferred placement relative to the trigger: `top|bottom|start|end`, optionally with an
   * alignment (`bottom end`). The popup flips when it does not fit. @default bottom start
   */
  placement?: AnchorPlacement;
  /** Gap between trigger and popup: a number is px, a string any CSS length. */
  offset?: number | string;
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

export type MenuSubmenuProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'id'> & {
  /** The submenu's `Menu.Item`, `Menu.Section`, `Menu.Separator` and nested `Menu.Submenu` children. */
  children: ReactNode;
  /** Text of the trigger item. Also its typeahead text and the submenu's accessible name. */
  label: string;
  /** Item identity. Optional: the item only opens the submenu and is never an action. */
  id?: string;
  /** Leading icon of the trigger item: a registry name or a node. */
  icon?: IconName | Exclude<ReactNode, string>;
  /** Prevents the trigger item from being focused or opening the submenu. */
  disabled?: boolean;
};

type MenuSelection = {
  value: string | null;
  setValue: (value: string | null) => void;
};

type MenuContextValue = {
  root: OverlayRoot;
  /** Opens the menu with focus on its first or last item (keyboard), or on the menu itself. */
  openWith: (strategy: FocusStrategy | null) => void;
  close: () => void;
  /** Labels the menu (`aria-labelledby`). */
  triggerId: string;
  /** Set when the root has `value` / `defaultValue`: the menu is a single-choice menu. */
  selection: MenuSelection | null;
};

/** Whether items of the nearest menu list render the radio check (false inside submenus). */
export const MenuCheckContext = createContext(false);

const { Context: MenuContext, use: useMenuContext } =
  createOverlayContext<MenuContextValue>('Menu');

function MenuRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  value,
  defaultValue,
  onValueChange,
}: MenuRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const selectable =
    value !== undefined || defaultValue !== undefined || onValueChange !== undefined;
  const [checked, setChecked] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const selection = useMemo<MenuSelection | null>(
    () => (selectable ? { value: checked, setValue: setChecked } : null),
    [selectable, checked, setChecked],
  );
  const state = useRootMenuState(root);
  const triggerId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { open: openWithStrategy, close } = state;
  const context = useMemo<MenuContextValue>(
    () => ({ root, selection, openWith: openWithStrategy, close, triggerId }),
    [root, selection, openWithStrategy, close, triggerId],
  );

  // What react-aria's `MenuTrigger` provides, without its `PressResponder`: our popup is not a RAC
  // `Popover` (which would clear that responder), so nothing above the items may register presses.
  // The trigger's press and keyboard handling is our own (`MenuTrigger` below).
  return (
    <MenuContext.Provider value={context}>
      <Provider
        values={[
          [
            AriaMenuContext,
            {
              'aria-labelledby': triggerId,
              autoFocus: state.focusStrategy ?? true,
              onClose: state.close,
              ref: scrollRef,
            },
          ],
          [OverlayTriggerStateContext, state],
          [RootMenuTriggerStateContext, state],
          [
            PopoverContext,
            {
              trigger: 'MenuTrigger',
              triggerRef: root.triggerRef,
              scrollRef,
              placement: 'bottom start',
              'aria-labelledby': triggerId,
            },
          ],
        ]}
      >
        {children}
      </Provider>
    </MenuContext.Provider>
  );
}

type FocusStrategy = 'first' | 'last';
type RootMenuState = NonNullable<React.ContextType<typeof RootMenuTriggerStateContext>>;

/**
 * react-stately's root menu trigger state over our overlay root: open state, the focus strategy
 * the menu opens with, and the stack of open submenus (`SubmenuTrigger` reads it).
 */
function useRootMenuState(root: OverlayRoot): RootMenuState {
  const [focusStrategy, setFocusStrategy] = useState<FocusStrategy | null>(null);
  const [expandedKeysStack, setExpandedKeysStack] = useState<Key[]>([]);
  const { open: isOpen, onStateChange } = root;
  useEffect(() => {
    if (!isOpen) setExpandedKeysStack([]);
  }, [isOpen]);
  const open = useCallback(
    (strategy: FocusStrategy | null = null) => {
      setFocusStrategy(strategy);
      onStateChange(true);
    },
    [onStateChange],
  );
  const close = useCallback(() => {
    setExpandedKeysStack([]);
    onStateChange(false);
  }, [onStateChange]);
  return useMemo<RootMenuState>(
    () => ({
      isOpen,
      focusStrategy,
      setOpen: (next: boolean) => (next ? open() : close()),
      open,
      close,
      toggle: (strategy: FocusStrategy | null = null) => (isOpen ? close() : open(strategy)),
      expandedKeysStack,
      openSubmenu: (triggerKey: Key, level: number) =>
        setExpandedKeysStack((stack) =>
          level > stack.length ? stack : [...stack.slice(0, level), triggerKey],
        ),
      closeSubmenu: (triggerKey: Key, level: number) =>
        setExpandedKeysStack((stack) =>
          stack[level] === triggerKey ? stack.slice(0, level) : stack,
        ),
    }),
    [isOpen, focusStrategy, open, close, expandedKeysStack],
  );
}

/** Keys that open a closed menu from its trigger, and where focus lands. */
const OPEN_KEYS: Record<string, FocusStrategy> = {
  ArrowDown: 'first',
  Enter: 'first',
  ' ': 'first',
  ArrowUp: 'last',
};

function MenuTrigger({ onKeyDown, ...props }: MenuTriggerProps): JSX.Element {
  const { root, openWith, close, triggerId } = useMenuContext();
  return (
    <OverlayTrigger
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={root.open}
      {...props}
      root={root}
      mode="none"
      // A pointer opens the menu with focus on the menu itself; keys open it on a first/last item.
      onClick={() => (root.open ? close() : openWith(null))}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event as never);
        const strategy = OPEN_KEYS[event.key];
        if (!strategy || event.defaultPrevented || root.open) return;
        event.preventDefault();
        openWith(strategy);
      }}
    />
  );
}

/**
 * Arrow keys around `layout: 'row'` sections (shared model with the Astro Menu): Left/Right wrap
 * within the row, Up/Down treat the row as one stop. React Aria's list navigation is vertical
 * only, so these keys are taken before it sees them; menus without rows are left alone.
 */
function handleRowArrowKeys(event: KeyboardEvent<HTMLDivElement>): void {
  if (!isMenuArrowKey(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const menuEl = target.closest('[role="menu"]');
  if (!menuEl || !menuEl.querySelector(MENU_ROW_SELECTOR)) return;
  const items = Array.from(menuEl.querySelectorAll<HTMLElement>('[role^="menuitem"]')).filter(
    (item) => item.closest('[role="menu"]') === menuEl,
  );
  if (!items.includes(target)) return;
  const next = menuArrowTarget(items, target, event.key, {
    rtl: getComputedStyle(target).direction === 'rtl',
    rowsOnly: true,
  });
  if (!next) return;
  event.preventDefault();
  event.stopPropagation();
  next.focus();
}

function MenuPopup({
  children,
  className,
  placement,
  offset,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onKeyDownCapture,
  ref,
  ...rest
}: MenuPopupProps): JSX.Element | null {
  const { root, selection } = useMenuContext();
  const m = menu();
  const setRef = useMergedRef<HTMLDivElement>(root.setPopupEl, ref);
  // Mount the popover shell on first open, not with the trigger: a list of 60 rows with a menu
  // each would otherwise mount 60 hidden `[popover]` elements (#237). The trigger is not part of
  // the popup, so it stays mounted and focus returns to it on close. Once opened the shell stays
  // (the menu content inside still unmounts on close).
  const [opened, setOpened] = useState(root.open);
  if (root.open && !opened) setOpened(true);
  const selectionProps = selection
    ? {
        selectionMode: 'single' as const,
        disallowEmptySelection: true,
        selectedKeys: selection.value === null ? [] : [selection.value],
        onSelectionChange: (keys: 'all' | Set<Key>) => {
          if (keys === 'all') return;
          const [next] = keys;
          if (next !== undefined) selection.setValue(String(next));
        },
      }
    : { selectionMode: 'none' as const };

  if (!opened) return null;

  // The shell is the native `[popover]` element (top layer, anchored by CSS), mounted in place;
  // RAC's MenuTrigger owns open state, keyboard, typeahead and `aria-haspopup`/`aria-expanded`.
  return (
    <NativePopover
      {...rest}
      {...mergeProps(m.popover, className)}
      ref={setRef}
      placement={placement}
      offset={offset}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event);
        if (!event.defaultPrevented) handleRowArrowKeys(event);
      }}
    >
      <AriaMenu
        {...mergeProps(m.menu)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...selectionProps}
      >
        <MenuCheckContext.Provider value={selection !== null}>{children}</MenuCheckContext.Provider>
      </AriaMenu>
    </NativePopover>
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
  const checkable = useContext(MenuCheckContext);
  return (
    <AriaMenuItem
      {...(rest as AriaMenuItemProps)}
      id={id}
      onAction={onAction}
      {...toRacProps({ disabled })}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      {...mergeProps(m.item, className)}
      ref={ref}
    >
      {checkable ? (
        // Shown by the recipe when the item is `aria-checked="true"`; kept in layout otherwise
        // so checked and unchecked rows align (same markup as the Astro Menu).
        <span {...mergeProps(m.itemCheck)} data-var-ui-menu-item-check="" aria-hidden="true">
          <Icon name="check" size="sm" />
        </span>
      ) : null}
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

const isIconName = (value: unknown): value is IconName =>
  typeof value === 'string' && (iconNameList as readonly string[]).includes(value);

/**
 * A nested menu, opened from an item of `Menu.Popup` (or of another `Menu.Submenu`). Renders
 * react-aria's `SubmenuTrigger`: the trigger item (`aria-haspopup`, `aria-expanded`) and a native
 * popover shell for the child menu. The child menu opens beside the item, aligned to its top.
 * It opens on hover (after a short delay) and with ArrowRight/Enter/Space (ArrowLeft in RTL), and
 * closes with ArrowLeft/Escape (focus returns to the trigger item). Choosing an item closes the
 * whole chain.
 */
function MenuSubmenu({
  children,
  label,
  id,
  icon,
  disabled,
  className,
  ref,
  ...rest
}: MenuSubmenuProps): JSX.Element {
  const m = menu();
  const leading = isIconName(icon) ? <Icon name={icon} size="sm" /> : icon;
  return (
    <AriaSubmenuTrigger delay={150}>
      <AriaMenuItem
        {...(rest as AriaMenuItemProps)}
        id={id}
        textValue={label}
        {...toRacProps({ disabled })}
        {...mergeProps(m.item, className)}
        ref={ref}
      >
        {leading ? <span {...mergeProps(m.itemIcon)}>{leading}</span> : null}
        <span {...mergeProps(m.itemLabel)}>{label}</span>
        <span {...mergeProps(m.submenuChevron)}>
          <Icon name="chevronRight" size="sm" />
        </span>
      </AriaMenuItem>
      <NativePopover {...combine(m.popover, m.submenuPopover)} offset={0}>
        <AriaMenu {...mergeProps(m.menu)}>
          <MenuCheckContext.Provider value={false}>{children}</MenuCheckContext.Provider>
        </AriaMenu>
      </NativePopover>
    </AriaSubmenuTrigger>
  );
}

export { MenuRoot, MenuTrigger, MenuPopup, MenuItem, MenuSeparator, MenuSection, MenuSubmenu };
