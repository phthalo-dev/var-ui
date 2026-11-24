import { useContext, type JSX } from 'react';
import {
  Header,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  Separator,
} from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { MenuCheckContext, MenuSubmenu } from './menuParts';
import { combine, mergeProps } from 'typestyles';

export type MenuItemDefinition = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onAction?: () => void;
  /** Renders the item as a link that navigates natively (React Aria routes it through `RouterProvider`). */
  href?: string;
  /** With `href`: open the link in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). */
  external?: boolean;
  /** Leading icon from the icon registry. In a `layout: 'row'` section, the item shows only it. */
  icon?: IconName;
  /** Leading color swatch (e.g. theme pickers). Any CSS color value. */
  swatch?: string;
  /**
   * Child items: the item opens them as a submenu (`Menu.Submenu`) instead of acting. `shortcut`,
   * `danger` and `onAction` are ignored on such an item.
   */
  items?: MenuItemDefinition[];
};

export type MenuSectionDefinition = {
  label?: string;
  items: MenuItemDefinition[];
  /**
   * Initially checked item id of this section. Passing it (even `null`) makes the section its
   * own single-choice group, independent of other sections (e.g. "Mode" and "Theme" groups in
   * one preferences menu). Same as the Astro `Menu` section `defaultValue`.
   */
  defaultValue?: string | null;
  /**
   * `row` lays the items out side by side as compact icon buttons (give each an `icon`; the
   * `label` becomes its accessible name and tooltip), e.g. a Light / Dark / System switch.
   * ArrowLeft / ArrowRight move (and wrap) within the row; ArrowUp / ArrowDown treat it as one
   * stop. Choosing a row item keeps the menu open: it is a setting beside the rest of the menu.
   * @default 'list'
   */
  layout?: 'list' | 'row';
  /**
   * Whether choosing an item in this section closes the menu. Set `false` for settings the user
   * may try in turn (e.g. a "Theme" list beside a Mode row), so the menu stays open on a pick.
   * @default true (`false` for `layout: 'row'`)
   */
  closeOnSelect?: boolean;
};

export type MenuContentProps = {
  sections: MenuSectionDefinition[];
  /**
   * Checked id per section index for sections with a `defaultValue`. The popup unmounts when it
   * closes, so a component that stays mounted (e.g. `Menu.FromSections`) holds the state.
   */
  sectionValues?: Record<number, string | null>;
  onSectionValueChange?: (sectionIndex: number, value: string | null) => void;
};

/**
 * Renders `sections` of items (headers, items, separators) as children of `Menu.Popup`, which
 * already provides the single `role="menu"` element.
 *
 * ```tsx
 * <Menu.Popup>
 *   <Menu.Content sections={sections} />
 * </Menu.Popup>
 * ```
 */
export function MenuContent({
  sections,
  sectionValues,
  onSectionValueChange,
}: MenuContentProps): JSX.Element {
  const m = menu();
  const nodes: JSX.Element[] = [];
  // The check column is for choices only: a single-choice menu (`Menu.Root value`) or a section
  // with `defaultValue`. Plain action menus get no empty column (same as `Menu.Item` and Astro).
  const menuCheckable = useContext(MenuCheckContext);

  sections.forEach((section, sectionIndex) => {
    const row = section.layout === 'row';
    const keepOpen = !(section.closeOnSelect ?? !row);
    const sectionProps = row ? combine(m.section, m.sectionRow) : mergeProps(m.section);
    if (section.defaultValue !== undefined) {
      const checked =
        sectionValues && sectionIndex in sectionValues
          ? sectionValues[sectionIndex]
          : section.defaultValue;
      nodes.push(
        <AriaMenuSection
          key={`section-${sectionIndex}`}
          aria-label={section.label}
          selectionMode="single"
          disallowEmptySelection={checked !== null}
          selectedKeys={checked === null ? [] : [checked]}
          onSelectionChange={(keys) => {
            const next = keys === 'all' ? null : ([...keys][0] ?? null);
            onSectionValueChange?.(sectionIndex, next === null ? null : String(next));
          }}
          shouldCloseOnSelect={keepOpen ? false : undefined}
          {...sectionProps}
          data-layout={row ? 'row' : undefined}
        >
          {section.label && !row ? (
            <Header {...mergeProps(m.sectionHeader)}>{section.label}</Header>
          ) : null}
          {section.items.map((item) => renderItem(item, m, row, true))}
        </AriaMenuSection>,
      );
      if (row && section.label) {
        // A row lays its children out horizontally: the label goes above the section.
        nodes.splice(
          nodes.length - 1,
          0,
          <Header key={`header-${sectionIndex}`} {...mergeProps(m.sectionHeader)}>
            {section.label}
          </Header>,
        );
      }
    } else if (row) {
      if (section.label) {
        nodes.push(
          <Header key={`header-${sectionIndex}`} {...mergeProps(m.sectionHeader)}>
            {section.label}
          </Header>,
        );
      }
      nodes.push(
        <AriaMenuSection
          key={`section-${sectionIndex}`}
          aria-label={section.label}
          shouldCloseOnSelect={keepOpen ? false : undefined}
          {...sectionProps}
          data-layout="row"
        >
          {section.items.map((item) => renderItem(item, m, row, menuCheckable))}
        </AriaMenuSection>,
      );
    } else {
      if (section.label) {
        nodes.push(
          <Header key={`header-${sectionIndex}`} {...mergeProps(m.sectionHeader)}>
            {section.label}
          </Header>,
        );
      }
      if (keepOpen) {
        nodes.push(
          <AriaMenuSection
            key={`section-${sectionIndex}`}
            aria-label={section.label}
            shouldCloseOnSelect={false}
            {...sectionProps}
          >
            {section.items.map((item) => renderItem(item, m, false, menuCheckable))}
          </AriaMenuSection>,
        );
      } else {
        section.items.forEach((item) => nodes.push(renderItem(item, m, false, menuCheckable)));
      }
    }
    if (sectionIndex < sections.length - 1) {
      nodes.push(<Separator key={`sep-${sectionIndex}`} {...mergeProps(m.separator)} />);
    }
  });

  return <>{nodes}</>;
}

function renderItem(
  item: MenuItemDefinition,
  m: ReturnType<typeof menu>,
  row = false,
  checkable = false,
): JSX.Element {
  if (item.items?.length) {
    return (
      <MenuSubmenu key={item.id} id={item.id} label={item.label} disabled={item.disabled}>
        {item.items.map((child) => renderItem(child, m))}
      </MenuSubmenu>
    );
  }
  return (
    <AriaMenuItem
      key={item.id}
      id={item.id}
      textValue={item.label}
      isDisabled={item.disabled}
      onAction={item.onAction}
      href={item.href}
      target={item.href && item.external ? '_blank' : undefined}
      rel={item.href && item.external ? 'noopener noreferrer' : undefined}
      aria-label={row ? item.label : undefined}
      {...combine(m.item, item.danger && m.itemDanger)}
    >
      {({ isSelected }) =>
        row ? (
          <span {...mergeProps(m.itemIcon)} title={item.label}>
            {item.icon ? (
              <Icon name={item.icon} size="sm" />
            ) : (
              <span {...mergeProps(m.itemLabel)}>{item.label}</span>
            )}
          </span>
        ) : (
          <>
            {checkable ? (
              <span {...mergeProps(m.itemCheck)} aria-hidden="true">
                {isSelected ? <Icon name="check" size="sm" /> : null}
              </span>
            ) : null}
            {item.icon ? (
              <span {...mergeProps(m.itemIcon)} aria-hidden="true">
                <Icon name={item.icon} size="sm" />
              </span>
            ) : null}
            {item.swatch ? (
              <span
                {...mergeProps(m.itemSwatch)}
                style={{ backgroundColor: item.swatch }}
                aria-hidden="true"
              />
            ) : null}
            <span {...mergeProps(m.itemLabel)}>{item.label}</span>
            {item.shortcut ? <span {...mergeProps(m.itemShortcut)}>{item.shortcut}</span> : null}
          </>
        )
      }
    </AriaMenuItem>
  );
}
