import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { overlayPresenceStyles } from './overlayPresence';
import { themeableVars } from './themeableVars';

/** Internal CSS variables for theme overrides (`vars` on theme `components`). */
export const menuVarDefinitions = {
  popoverBackground: {
    value: t.color.background.surface.var,
    syntax: '<color>' as const,
  },
  popoverBorder: {
    value: t.color.border.default.var,
    syntax: '<color>' as const,
  },
  itemForeground: {
    value: t.color.text.primary.var,
    syntax: '<color>' as const,
  },
  itemFocusedBackground: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
  itemDisabledForeground: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  sectionHeaderForeground: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  separatorColor: {
    value: t.color.border.default.var,
    syntax: '<color>' as const,
  },
  dangerForeground: {
    value: t.color.tone.danger.foreground.var,
    syntax: '<color>' as const,
  },
} as const;

const menuRecipe = typestyles.recipe(
  'menu',
  (c) => {
    const v = c.vars(menuVarDefinitions);
    return {
      vars: menuVarDefinitions,
      slots: [
        'popover',
        'menu',
        'section',
        'sectionHeader',
        'item',
        'itemDanger',
        'itemLabel',
        'itemShortcut',
        'itemCheck',
        'separator',
        'submenuChevron',
      ],
      popover: {
        ...overlayPresenceStyles({ scale: true }),
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.popoverBorder.var,
        borderRadius: t.radius.md.var,
        backgroundColor: v.popoverBackground.var,
        boxShadow: t.shadow.md.var,
        padding: t.space[1].var,
        minWidth: '12rem',
      },
      menu: {
        outline: 'none',
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1].var,
      },
      sectionHeader: {
        fontSize: t.fontSize.sm.var,
        fontWeight: t.fontWeight.semibold.var,
        color: v.sectionHeaderForeground.var,
        padding: `${t.space[1].var} ${t.space[3].var}`,
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[2].var,
        fontSize: t.fontSize.md.var,
        padding: `${t.space[2].var} ${t.space[3].var}`,
        borderRadius: t.radius.sm.var,
        cursor: 'pointer',
        color: v.itemForeground.var,
        outline: 'none',
        '&[data-focused]': {
          backgroundColor: v.itemFocusedBackground.var,
        },
        '&[data-disabled]': {
          color: v.itemDisabledForeground.var,
          cursor: 'not-allowed',
        },
      },
      itemDanger: {
        color: v.dangerForeground.var,
      },
      itemLabel: {
        flex: 1,
        minWidth: 0,
      },
      itemShortcut: {
        fontSize: t.fontSize.sm.var,
        color: v.sectionHeaderForeground.var,
      },
      itemCheck: {
        display: 'inline-flex',
        width: '1rem',
        flexShrink: 0,
      },
      separator: {
        height: '1px',
        margin: `${t.space[1].var} 0`,
        backgroundColor: v.separatorColor.var,
      },
      submenuChevron: {
        display: 'inline-flex',
        marginInlineStart: 'auto',
        color: v.sectionHeaderForeground.var,
      },
    };
  },
  { layer: 'components' },
);

export const menu = themeableVars(menuRecipe, menuVarDefinitions);
