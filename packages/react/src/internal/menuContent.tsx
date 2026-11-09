import type { JSX } from 'react';
import { Header, MenuItem as AriaMenuItem, Separator } from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
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
  /**
   * Child items: the item opens them as a submenu (`Menu.Submenu`) instead of acting. `shortcut`,
   * `danger` and `onAction` are ignored on such an item.
   */
  items?: MenuItemDefinition[];
};

export type MenuSectionDefinition = {
  label?: string;
  items: MenuItemDefinition[];
};

export type MenuContentProps = {
  sections: MenuSectionDefinition[];
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
export function MenuContent({ sections }: MenuContentProps): JSX.Element {
  const m = menu();
  const nodes: JSX.Element[] = [];

  sections.forEach((section, sectionIndex) => {
    if (section.label) {
      nodes.push(
        <Header key={`header-${sectionIndex}`} {...mergeProps(m.sectionHeader)}>
          {section.label}
        </Header>,
      );
    }
    section.items.forEach((item) => nodes.push(renderItem(item, m)));
    if (sectionIndex < sections.length - 1) {
      nodes.push(<Separator key={`sep-${sectionIndex}`} {...mergeProps(m.separator)} />);
    }
  });

  return <>{nodes}</>;
}

function renderItem(item: MenuItemDefinition, m: ReturnType<typeof menu>): JSX.Element {
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
      {...combine(m.item, item.danger && m.itemDanger)}
    >
      {({ isSelected }) => (
        <>
          <span {...mergeProps(m.itemCheck)}>
            {isSelected ? <Icon name="check" size="sm" /> : null}
          </span>
          <span {...mergeProps(m.itemLabel)}>{item.label}</span>
          {item.shortcut ? <span {...mergeProps(m.itemShortcut)}>{item.shortcut}</span> : null}
        </>
      )}
    </AriaMenuItem>
  );
}
