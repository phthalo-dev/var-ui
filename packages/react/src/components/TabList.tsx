import type { ComponentPropsWithRef, JSX, KeyboardEvent, ReactNode, Ref } from 'react';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { iconNameList } from '@var-ui/core/icons/iconNames';
import { tabList } from '@var-ui/core/components/tabList';
import type { ControlSize, IconName, TabListVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { Menu } from './Menu';
import { mergeProps } from 'typestyles';

/** Registry name or a caller-supplied node — excludes bare `string` so it isn't redundant with `IconName`. */
export type TabListIcon = IconName | Exclude<ReactNode, string>;

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

function renderTabListIcon(icon: TabListIcon | undefined, size: 'sm' | 'md' = 'sm'): ReactNode {
  if (icon == null || icon === false) return null;
  return isIconName(icon) ? <Icon name={icon} size={size} /> : icon;
}

type TabListContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  size: ControlSize;
  /** Value of the item that currently holds the roving `tabIndex={0}` slot. */
  focusValue?: string;
};

const TabListContext = createContext<TabListContextValue | null>(null);

const defaultContextValue: TabListContextValue = { size: 'md' };

function useTabListContext(): TabListContextValue {
  return useContext(TabListContext) ?? defaultContextValue;
}

export type TabListTabProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'children' | 'ref' | 'onChange'
> & {
  /** Identifies this tab; passed to `onValueChange` and compared against `TabList`'s `value`. */
  value: string;
  label: string;
  /** Renders as a link (with `aria-current` when selected) instead of a button. */
  href?: string;
  icon?: TabListIcon;
  endContent?: ReactNode;
  /** Hides the visible label, showing only the icon; `label` still provides the accessible name. @default false */
  labelHidden?: boolean;
  /** @default false */
  disabled?: boolean;
  /** Ref to the underlying `<a>` (with `href`) or `<button>` element. */
  ref?: Ref<HTMLElement>;
};

/** `data-*` marker consumed by the roving-tabindex arrow-key handler on the `TabList` root. */
const FOCUSABLE_ATTR = 'data-var-ui-tab-list-item';

/** Link (`href`) or button row for `TabList`; selected styling + `aria-current` for links. */
export function TabListTab({
  value,
  label,
  href,
  icon,
  endContent,
  labelHidden = false,
  disabled = false,
  className,
  ref,
  ...rest
}: TabListTabProps): JSX.Element {
  const ctx = useTabListContext();
  const s = tabList({ size: ctx.size });
  const isSelected = ctx.value === value;
  const iconNode = renderTabListIcon(icon);

  const content = (
    <>
      {iconNode}
      {!labelHidden ? <span>{label}</span> : null}
      {!labelHidden && endContent != null ? endContent : null}
      <span {...mergeProps(s.indicator)} aria-hidden="true" />
    </>
  );

  const sharedProps = {
    ...(rest as object),
    ...mergeProps(s.tab, className),
    'data-selected': isSelected ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'aria-label': labelHidden ? label : undefined,
    [FOCUSABLE_ATTR]: '',
    excludeFromTabOrder: ctx.focusValue !== value,
    isDisabled: disabled,
    onPress: () => {
      if (!disabled) ctx.onValueChange?.(value);
    },
  };

  return href ? (
    <AriaLink
      href={href}
      aria-current={isSelected ? ('page' as const) : undefined}
      {...sharedProps}
      ref={ref as Ref<HTMLAnchorElement>}
    >
      {content}
    </AriaLink>
  ) : (
    <AriaButton {...sharedProps} ref={ref as Ref<HTMLButtonElement>}>
      {content}
    </AriaButton>
  );
}

export type TabListMenuOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TabListMenuProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** Accessible name + visible text for the overflow trigger (e.g. "More"). */
  label: string;
  options: TabListMenuOption[];
};

/** Overflow "More" trigger — reuses `Menu.FromSections`; selecting an option calls `onValueChange`. */
export function TabListMenu({
  label,
  options,
  className,
  ref,
  ...rest
}: TabListMenuProps): JSX.Element {
  const ctx = useTabListContext();
  const s = tabList({ size: ctx.size });
  const isSelected = options.some((option) => option.value === ctx.value);
  const isRovingTabbable =
    ctx.focusValue != null && options.some((option) => option.value === ctx.focusValue);

  const triggerProps = {
    ...mergeProps(s.menuTrigger),
    'data-selected': isSelected ? '' : undefined,
    [FOCUSABLE_ATTR]: '',
    excludeFromTabOrder: !isRovingTabbable,
  };

  return (
    <div {...rest} {...mergeProps(s.menu, className)} ref={ref}>
      <Menu.FromSections
        trigger={
          <AriaButton {...triggerProps}>
            <span>{label}</span>
            <Icon name="chevronDown" size="sm" />
          </AriaButton>
        }
        sections={[
          {
            items: options.map((option) => ({
              id: option.value,
              label: option.label,
              disabled: option.disabled,
              onAction: () => ctx.onValueChange?.(option.value),
            })),
          },
        ]}
      />
    </div>
  );
}

/** Scans `TabList` children for known values (tabs + menu options) without requiring registration effects. */
function collectTabListValues(children: ReactNode): string[] {
  const values: string[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === TabListTab) {
      const tabValue = (child.props as TabListTabProps).value;
      if (tabValue != null) values.push(tabValue);
    } else if (child.type === TabListMenu) {
      const options = (child.props as TabListMenuProps).options ?? [];
      for (const option of options) values.push(option.value);
    }
  });
  return values;
}

export type TabListProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'children' | 'onChange' | 'defaultValue' | 'ref'
> & {
  /** Controlled selected tab/menu-option value. */
  value?: string;
  /** Uncontrolled initial selected value. */
  defaultValue?: string;
  /** Fires with the value of the tab (or menu option) the user selected. */
  onValueChange?: (value: string) => void;
  /** @default 'md' */
  size?: NonNullable<TabListVariantProps['size']>;
  /** `hug` sizes tabs to content; `fill` stretches tabs/menu evenly across the width. @default 'hug' */
  layout?: 'hug' | 'fill';
  /** Border on the side opposite the indicator (bottom for horizontal, inline-end for vertical). @default false */
  hasDivider?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** `TabList.Tab` / `TabList.Menu` children. */
  children?: ReactNode;
  /** Accessible name for the `nav` landmark. @default 'Tabs' */
  label?: string;
  /** Ref to the underlying `<nav>` element. */
  ref?: Ref<HTMLElement>;
};

/**
 * Nav landmark tabs for switching between views/routes — no panels. A
 * deliberately separate family from the panel `Tabs` component (see
 * `specs/phase-5-navigation-p2.md` § TabList).
 *
 * `value` / `defaultValue` / `onValueChange`; hand-rolled roving tabindex with Arrow /
 * Home / End support (`Tab` key stops once, on the selected — or first —
 * item, matching the ARIA tablist pattern without adopting `role="tablist"`
 * semantics, since these render as plain links/buttons).
 *
 * ```tsx
 * <TabList value={tab} onValueChange={setTab} label="Sections">
 *   <TabList.Tab value="overview" label="Overview" href="/overview" />
 *   <TabList.Tab value="activity" label="Activity" endContent={<Badge>3</Badge>} />
 *   <TabList.Menu
 *     label="More"
 *     options={[{ value: 'settings', label: 'Settings' }]}
 *   />
 * </TabList>
 * ```
 */
export function TabList({
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  layout = 'hug',
  hasDivider = false,
  orientation = 'horizontal',
  children,
  className,
  label = 'Tabs',
  onKeyDown,
  ref,
  ...rest
}: TabListProps): JSX.Element {
  const s = tabList({ size });
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolledValue;
  const onChange = useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );
  const rootRef = useRef<HTMLElement>(null);
  const setRoot = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );

  const knownValues = useMemo(() => collectTabListValues(children), [children]);
  const focusValue = value != null && knownValues.includes(value) ? value : knownValues[0];

  const contextValue = useMemo<TabListContextValue>(
    () => ({ value, onValueChange: onChange, size, focusValue }),
    [value, onChange, size, focusValue],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const root = rootRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(`[${FOCUSABLE_ATTR}]:not([data-disabled])`),
      );
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const isHorizontal = orientation === 'horizontal';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const previousKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

      let nextIndex: number | undefined;
      if (event.key === nextKey) {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      } else if (event.key === previousKey) {
        nextIndex =
          currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      items[nextIndex]?.focus();
    },
    [orientation, onKeyDown],
  );

  return (
    <TabListContext.Provider value={contextValue}>
      <nav
        {...rest}
        ref={setRoot}
        aria-label={label}
        data-orientation={orientation}
        data-layout={layout}
        data-has-divider={hasDivider ? '' : undefined}
        onKeyDown={handleKeyDown}
        {...mergeProps(s.root, className)}
      >
        {children}
      </nav>
    </TabListContext.Provider>
  );
}

TabList.Tab = TabListTab;
TabList.Menu = TabListMenu;
