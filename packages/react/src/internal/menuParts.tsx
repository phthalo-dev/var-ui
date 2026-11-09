import { useMemo, type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Separator,
  SubmenuTrigger as AriaSubmenuTrigger,
} from 'react-aria-components';
import type { IconName } from '@var-ui/core';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import { Icon } from '../icons';
import { menu } from '@var-ui/core/components/menu';
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

type MenuContextValue = {
  root: OverlayRoot;
};

const { Context: MenuContext, use: useMenuContext } =
  createOverlayContext<MenuContextValue>('Menu');

function MenuRoot({ children, open, defaultOpen, onOpenChange }: MenuRootProps): JSX.Element {
  const root = useOverlayRoot({ open, defaultOpen, onOpenChange });
  const context = useMemo<MenuContextValue>(() => ({ root }), [root]);

  return (
    <MenuContext.Provider value={context}>
      <AriaMenuTrigger isOpen={root.open} onOpenChange={root.onStateChange}>
        {children}
      </AriaMenuTrigger>
    </MenuContext.Provider>
  );
}

function MenuTrigger(props: MenuTriggerProps): JSX.Element {
  return <OverlayTrigger {...props} root={useMenuContext().root} />;
}

function MenuPopup({
  children,
  className,
  placement,
  offset,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: MenuPopupProps): JSX.Element {
  const { root } = useMenuContext();
  const m = menu();
  const setRef = useMergedRef<HTMLDivElement>(root.setPopupEl, ref);

  // The shell is the native `[popover]` element (top layer, anchored by CSS), mounted in place;
  // RAC's MenuTrigger owns open state, keyboard, typeahead and `aria-haspopup`/`aria-expanded`.
  return (
    <NativePopover
      {...rest}
      {...mergeProps(m.popover, className)}
      ref={setRef}
      placement={placement}
      offset={offset}
    >
      <AriaMenu
        {...mergeProps(m.menu)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        selectionMode="none"
      >
        {children}
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
        <AriaMenu {...mergeProps(m.menu)}>{children}</AriaMenu>
      </NativePopover>
    </AriaSubmenuTrigger>
  );
}

export { MenuRoot, MenuTrigger, MenuPopup, MenuItem, MenuSeparator, MenuSection, MenuSubmenu };
