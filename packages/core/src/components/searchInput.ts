import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { atDarkMode } from '../theme/conditions';
import { border } from '../internal/border';
import {
  controlSizeMetrics,
  controlSizeVariants,
  controlSurfaceSize,
} from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

/** `default` — inline search input; `command` — read-only command-palette trigger. */
const searchInputVariant = variant.enum(['default', 'command'], { default: 'default' });

/**
 * Width below which the `command` trigger (`data-variant="command"` on the root) collapses to a square icon button (label and shortcut
 * hidden). `none` never collapses. Pick it to fit the bar the trigger lives in.
 */
const collapseBelow = variant.enum(['none', 'sm', 'md', 'lg', 'xl'], { default: 'md' });

/** Height of the shortcut key cap inside the command trigger (see `kbd`). */
const shortcutHeight = '1.25rem';

/** Collapsed command trigger: a square icon button the size of the control. */
const collapsedCommand = (iconColorVar: string) =>
  ({
    root: {
      position: 'relative',
      minWidth: 0,
      width: 'auto',
      justifyContent: 'center',
      aspectRatio: '1 / 1',
      paddingInline: 0,
      flexShrink: 0,
      // Collapsed, it is an icon button: quiet like its neighbours until hovered.
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      '&:hover': {
        borderColor: 'transparent',
        backgroundColor: t.color.background.subtle.var,
        // Icon brightens like the bar's other icon buttons.
        [iconColorVar]: t.color.text.primary.var,
      },
    },
    trigger: { position: 'absolute', inset: 0 },
    triggerLabel: { display: 'none' },
    shortcut: { display: 'none' },
  }) as const;

function collapseAt(bp: 'sm' | 'md' | 'lg' | 'xl', iconColorVar: string) {
  const query = breakpoint(bp, 'max');
  const collapsed = collapsedCommand(iconColorVar);
  return {
    root: { '&[data-variant="command"]': { [query]: collapsed.root } },
    trigger: { [query]: collapsed.trigger },
    triggerLabel: { [query]: collapsed.triggerLabel },
    shortcut: { [query]: collapsed.shortcut },
  };
}

/**
 * Compact search field for toolbars and nav chrome.
 *
 * - `default` — a real `<input type="search">` for inline filtering.
 * - `command` — read-only trigger chrome with a shortcut hint; pair with
 *   `CommandPalette` via `data-command-palette` on the Astro component.
 */
export const searchInput = typestyles.recipe({
  name: 'search-input',
  layer: 'components',
  slots: ['root', 'icon', 'input', 'trigger', 'triggerLabel', 'shortcut'],
  variants: { variant: searchInputVariant, size: controlSize, collapseBelow },
  vars: {
    background: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    border: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    foreground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    placeholder: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    iconColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          [vars.background.name]: t.color.background.surface.var,
          [vars.border.name]: t.color.border.default.var,
          [vars.foreground.name]: t.color.text.primary.var,
          [vars.placeholder.name]: t.color.text.secondary.var,
          [vars.iconColor.name]: t.color.text.secondary.var,
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          minWidth: `min(${t.size.field.minWidth.var}, 100%)`,
          maxWidth: '100%',
          boxSizing: 'border-box',
          ...border(vars.border.var),
          borderRadius: t.radius.md.var,
          backgroundColor: vars.background.var,
          color: vars.foreground.var,
          transition: t.transition.controlSurface.var,
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          // One ring on the field: the inner input/trigger draws none of its own.
          '&:has(:focus-visible)': focusRing,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: vars.iconColor.var,
          lineHeight: 0,
        },
        input: {
          flex: 1,
          minWidth: 0,
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          fontSize: 'inherit',
          fontFamily: t.fontFamily.body.var,
          color: vars.foreground.var,
          outline: 'none',
          '&:focus-visible': { outline: 'none' },
          '&::placeholder': {
            color: vars.placeholder.var,
          },
          '&::-webkit-search-cancel-button': {
            display: 'none',
          },
        },
        trigger: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent',
          font: 'inherit',
          color: 'inherit',
          textAlign: 'start',
          cursor: 'pointer',
          outline: 'none',
          '&:focus-visible': { outline: 'none' },
        },
        triggerLabel: {
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: vars.placeholder.var,
        },
        shortcut: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          // Sits in the trigger's hit area; clicks fall through to the field.
          pointerEvents: 'none',
          // The key cap sits one step above the (filled) field in both modes, hovered or not.
          '& kbd': {
            backgroundColor: t.color.background.surface.var,
            borderColor: t.color.border.default.var,
            ...atDarkMode({
              backgroundColor: t.color.background.elevated.var,
            }),
          },
        },
      },
      variants: {
        variant: {
          default: {},
          // Filled tray + hairline, the same chrome as a SegmentedControl track, so a search
          // trigger and a switcher side by side read as one family. Hover firms the hairline
          // only: the fill stays put so the key cap (surface fill) keeps its contrast.
          command: {
            root: {
              [vars.background.name]: t.color.background.subtle.var,
              [vars.border.name]: t.color.border.subtle.var,
              cursor: 'pointer',
              '&:hover': {
                borderColor: t.color.border.default.var,
              },
            },
            trigger: {
              width: '100%',
            },
          },
        },
        size: controlSizeVariants((size) => ({
          root: {
            ...controlSurfaceSize(size, { inset: 'compact' }),
            // The shortcut key cap gets the same inset on every side (centered vertically).
            '&[data-variant="command"]': {
              paddingInlineEnd: `calc((${controlSizeMetrics[size].height} - ${shortcutHeight}) / 2)`,
            },
          },
          input: { fontSize: controlSizeMetrics[size].fontSize },
          triggerLabel: { fontSize: controlSizeMetrics[size].fontSize },
        })),
        // After `size` so the collapsed square wins over the size insets.
        collapseBelow: {
          none: {},
          sm: collapseAt('sm', vars.iconColor.name),
          md: collapseAt('md', vars.iconColor.name),
          lg: collapseAt('lg', vars.iconColor.name),
          xl: collapseAt('xl', vars.iconColor.name),
        },
      },
    };
  },
});

export type SearchInputVariantProps = RecipeVariants<typeof searchInput>;
