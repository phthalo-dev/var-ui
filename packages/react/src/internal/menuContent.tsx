import type { JSX } from 'react';
import {
  Header,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  Separator,
} from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { MenuSubmenu } from './menuParts';
import { combine, mergeProps } from 'typestyles';

export type MenuItemDefinition = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onAction?: () => void;
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
   * @default 'list'
   */
  layout?: 'list' | 'row';
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

  sections.forEach((section, sectionIndex) => {
    const row = section.layout === 'row';
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
          {...sectionProps}
          data-layout={row ? 'row' : undefined}
        >
          {section.label && !row ? (
            <Header {...mergeProps(m.sectionHeader)}>{section.label}</Header>
          ) : null}
          {section.items.map((item) => renderItem(item, m, row))}
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
          {...sectionProps}
          data-layout="row"
        >
          {section.items.map((item) => renderItem(item, m, row))}
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
      section.items.forEach((item) => nodes.push(renderItem(item, m)));
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
            <span {...mergeProps(m.itemCheck)}>
              {isSelected ? <Icon name="check" size="sm" /> : null}
            </span>
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
