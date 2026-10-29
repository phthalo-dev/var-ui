import { MenuContent } from '../internal/menuContent';
import { MenuContextMenu, MenuFromSections, MenuOverflow } from '../internal/menuPresets';
import {
  MenuItem,
  MenuPopup,
  MenuRoot,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '../internal/menuParts';

export type {
  MenuItemProps,
  MenuPopupProps,
  MenuProps,
  MenuRootProps,
  MenuSectionProps,
  MenuSeparatorProps,
  MenuTriggerProps,
} from '../internal/menuParts';
export type {
  MenuContentProps,
  MenuItemDefinition,
  MenuSectionDefinition,
} from '../internal/menuContent';
export type {
  MenuContextMenuProps,
  MenuFromSectionsProps,
  MenuOverflowProps,
} from '../internal/menuPresets';

/**
 * Action menu namespace. Compose parts for full control, or use presets for common cases.
 *
 * ```tsx
 * // Compound
 * <Menu>
 *   <Menu.Trigger><Button>Song</Button></Menu.Trigger>
 *   <Menu.Popup>
 *     <Menu.Item id="lib" onAction={fn}>Add to Library</Menu.Item>
 *   </Menu.Popup>
 * </Menu>
 *
 * // Data preset
 * <Menu.FromSections trigger={<Button>Actions</Button>} sections={[...]} />
 *
 * // Right-click
 * <Menu.ContextMenu sections={[...]}><div>Right-click me</div></Menu.ContextMenu>
 *
 * // Overflow
 * <Menu.Overflow sections={[...]} />
 * ```
 */
export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Section: MenuSection,
  Content: MenuContent,
  FromSections: MenuFromSections,
  ContextMenu: MenuContextMenu,
  Overflow: MenuOverflow,
});
