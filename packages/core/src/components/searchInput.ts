import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import {
  controlSizeMetrics,
  controlSizeVariants,
  controlSurfaceSize,
} from '../internal/controlSize';
import { controlSize } from '../shared/variantAxes';

/** Command-trigger chrome collapses to an icon button below this width. */
const belowXl = breakpoint('xl', 'max');

/** `default` — inline search input; `command` — read-only command-palette trigger. */
const searchInputVariant = variant.enum(['default', 'command'], { default: 'default' });

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
  variants: { variant: searchInputVariant, size: controlSize },
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
          gap: t.space[2].var,
          minWidth: 'min(220px, 100%)',
          maxWidth: '100%',
          boxSizing: 'border-box',
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.border.var,
          borderRadius: t.radius.md.var,
          backgroundColor: vars.background.var,
          color: vars.foreground.var,
          transition: 'border-color 140ms ease',
          '&:hover': {
            borderColor: t.color.border.strong.var,
          },
          '&:focus-within': focusRing,
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
    };
  },
});

export type SearchInputVariantProps = RecipeVariants<typeof searchInput>;
