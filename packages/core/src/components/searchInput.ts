import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { controlFocusStyles } from './controlFocus';
import { controlSizeMetrics, controlSizeVariants, controlSurfaceSize } from './controlSize';
import type { ControlSize } from './semanticTone';

/** Command-trigger chrome collapses to an icon button below this width. */
const belowXl = breakpoint('xl', 'max');

/**
 * Compact search field for toolbars and nav chrome.
 *
 * - `default` — a real `<input type="search">` for inline filtering.
 * - `command` — read-only trigger chrome with a shortcut hint; pair with
 *   `CommandPalette` via `data-command-palette` on the Astro component.
 */
export const searchInput = typestyles.recipe(
  'search-input',
  (c) => {
    const v = c.vars({
      background: {
        value: t.color.background.surface.var,
        syntax: '<color>',
      },
      border: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      foreground: {
        value: t.color.text.primary.var,
        syntax: '<color>',
      },
      placeholder: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      iconColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'icon', 'input', 'trigger', 'triggerLabel', 'shortcut'],
      base: {
        root: {
          [v.background.name]: t.color.background.surface.var,
          [v.border.name]: t.color.border.default.var,
          [v.foreground.name]: t.color.text.primary.var,
          [v.placeholder.name]: t.color.text.secondary.var,
          [v.iconColor.name]: t.color.text.secondary.var,
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[2].var,
          minWidth: 'min(220px, 100%)',
          maxWidth: '100%',
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: v.border.var,
          borderRadius: t.radius.md.var,
          backgroundColor: v.background.var,
          color: v.foreground.var,
          transition: 'border-color 140ms ease, box-shadow 140ms ease',
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          '&:focus-within': controlFocusStyles(),
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          color: v.iconColor.var,
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
          color: v.foreground.var,
          outline: 'none',
          '&::placeholder': {
            color: v.placeholder.var,
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
        },
        triggerLabel: {
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: v.placeholder.var,
        },
        shortcut: {
          flexShrink: 0,
        },
      },
      variants: {
        variant: {
          default: {},
          command: {
            root: {
              cursor: 'pointer',
              [belowXl]: {
                position: 'relative',
                minWidth: 0,
                width: 'auto',
                justifyContent: 'center',
                aspectRatio: '1 / 1',
                paddingInline: t.space[2].var,
                flexShrink: 0,
              },
            },
            trigger: {
              [belowXl]: {
                position: 'absolute',
                inset: 0,
              },
            },
            triggerLabel: {
              [belowXl]: {
                display: 'none',
              },
            },
            shortcut: {
              [belowXl]: {
                display: 'none',
              },
            },
          },
        },
        size: controlSizeVariants((size) => ({
          root: controlSurfaceSize(size, { inset: 'compact' }),
          input: { fontSize: controlSizeMetrics[size].fontSize },
          triggerLabel: { fontSize: controlSizeMetrics[size].fontSize },
        })),
      },
      defaultVariants: { variant: 'default', size: 'md' },
    };
  },
  { layer: 'components' },
);

export type SearchInputVariantProps = {
  variant?: 'default' | 'command';
  size?: ControlSize;
};
