import type { JSX } from 'react';
import { Header, MenuItem as AriaMenuItem, Separator } from 'react-aria-components';
import { menu } from '@var-ui/core/components/menu';
import { Icon } from '../icons';
import { combine, mergeProps } from 'typestyles';

export type MenuItemDefinition = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onAction?: () => void;
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
    section.items.forEach((item) => {
      nodes.push(
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
        </AriaMenuItem>,
      );
    });
    if (sectionIndex < sections.length - 1) {
      nodes.push(<Separator key={`sep-${sectionIndex}`} {...mergeProps(m.separator)} />);
    }
  });

  return <>{nodes}</>;
}
