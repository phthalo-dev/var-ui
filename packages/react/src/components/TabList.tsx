import type { JSX, KeyboardEvent, ReactNode } from 'react';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import {
  iconNameList,
  tabList,
  type ControlSize,
  type IconName,
  type TabListVariantProps,
} from '@var-ui/core';
import { Icon } from '../icons';
import { Menu } from './Menu';
import { mergeProps } from './utils';

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
  onChange?: (value: string) => void;
  size: ControlSize;
  /** Value of the item that currently holds the roving `tabIndex={0}` slot. */
  focusValue?: string;
};

const TabListContext = createContext<TabListContextValue | null>(null);

const defaultContextValue: TabListContextValue = { size: 'md' };

function useTabListContext(): TabListContextValue {
  return useContext(TabListContext) ?? defaultContextValue;
}

export type TabListTabProps = {
  /** Identifies this tab; passed to `onChange` and compared against `TabList`'s `value`. */
  value: string;
  label: string;
  /** Renders as a link (with `aria-current` when selected) instead of a button. */
  href?: string;
  icon?: TabListIcon;
  endContent?: ReactNode;
  /** Hides the visible label, showing only the icon; `label` still provides the accessible name. @default false */
  isLabelHidden?: boolean;
  isDisabled?: boolean;
  className?: string;
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
  isLabelHidden = false,
  isDisabled = false,
  className,
}: TabListTabProps): JSX.Element {
  const ctx = useTabListContext();
  const s = tabList({ size: ctx.size });
  const isSelected = ctx.value === value;
  const iconNode = renderTabListIcon(icon);

  const content = (
    <>
      {iconNode}
      {!isLabelHidden ? <span>{label}</span> : null}
      {!isLabelHidden && endContent != null ? endContent : null}
      <span {...mergeProps(s.indicator)} aria-hidden="true" />
    </>
  );

  const sharedProps = {
    ...mergeProps(s.tab, className),
    'data-selected': isSelected ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
    'aria-label': isLabelHidden ? label : undefined,
    [FOCUSABLE_ATTR]: '',
    excludeFromTabOrder: ctx.focusValue !== value,
    isDisabled,
    onPress: () => {
      if (!isDisabled) ctx.onChange?.(value);
    },
  };

  return href ? (
    <AriaLink
      href={href}
      aria-current={isSelected ? ('page' as const) : undefined}
      {...sharedProps}
    >
      {content}
    </AriaLink>
  ) : (
    <AriaButton {...sharedProps}>{content}</AriaButton>
  );
}

export type TabListMenuOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

export type TabListMenuProps = {
  /** Accessible name + visible text for the overflow trigger (e.g. "More"). */
  label: string;
  options: TabListMenuOption[];
  className?: string;
};

/** Overflow "More" trigger — reuses `Menu.FromSections`; selecting an option calls `onChange`. */
export function TabListMenu({ label, options, className }: TabListMenuProps): JSX.Element {
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
    <div {...mergeProps(s.menu, className)}>
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
              disabled: option.isDisabled,
              onAction: () => ctx.onChange?.(option.value),
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

export type TabListProps = {
  /** Selected tab/menu-option value. */
  value?: string;
  onChange?: (value: string) => void;
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
  className?: string;
  /** Accessible name for the `nav` landmark. @default 'Tabs' */
  label?: string;
};

/**
 * Nav landmark tabs for switching between views/routes — no panels. A
 * deliberately separate family from the panel `Tabs` component (see
 * `specs/phase-5-navigation-p2.md` § TabList).
 *
 * Controlled `value`/`onChange`; hand-rolled roving tabindex with Arrow /
 * Home / End support (`Tab` key stops once, on the selected — or first —
 * item, matching the ARIA tablist pattern without adopting `role="tablist"`
 * semantics, since these render as plain links/buttons).
 *
 * ```tsx
 * <TabList value={tab} onChange={setTab} label="Sections">
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
  value,
  onChange,
  size = 'md',
  layout = 'hug',
  hasDivider = false,
  orientation = 'horizontal',
  children,
  className,
  label = 'Tabs',
}: TabListProps): JSX.Element {
  const s = tabList({ size });
  const rootRef = useRef<HTMLElement>(null);

  const knownValues = useMemo(() => collectTabListValues(children), [children]);
  const focusValue = value != null && knownValues.includes(value) ? value : knownValues[0];

  const contextValue = useMemo<TabListContextValue>(
    () => ({ value, onChange, size, focusValue }),
    [value, onChange, size, focusValue],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
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
    [orientation],
  );

  return (
    <TabListContext.Provider value={contextValue}>
      <nav
        ref={rootRef}
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
