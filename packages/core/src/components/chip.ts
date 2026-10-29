import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import {
  mapTone,
  subtleBackgroundColor,
  subtleBorderColor,
  surfaceAppearance,
  tone,
  toneChannelAssignments,
} from '../shared/semanticTone';

/**
 * Compact pill-shaped label for filters, tags, and removable tokens.
 *
 * ```ts
 * const c = chip({ tone: 'accent', appearance: 'subtle' });
 * <span className={c.root}><span className={c.label}>React</span></span>
 * ```
 */
export const chip = typestyles.recipe({
  name: 'chip',
  layer: 'components',
  slots: ['root', 'label', 'removeButton', 'wrapper'],
  variants: {
    tone,
    appearance: surfaceAppearance,
  },
  vars: {
    semantic: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    solidBg: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    solidFg: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    borderColor: {
      ...atProperty.color,
      value: t.color.border.default.var,
    },
    backgroundColor: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    textColor: {
      ...atProperty.color,
      value: t.color.text.secondary.var,
    },
    removeHoverBackground: {
      ...atProperty.color,
      value: t.color.background.elevated.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space[1].var,
          maxWidth: '100%',
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          lineHeight: 1,
          padding: `${t.space[1].var} ${t.space[2].var}`,
          borderRadius: t.radius.full.var,
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: vars.borderColor.var,
          backgroundColor: vars.backgroundColor.var,
          color: vars.textColor.var,
          '&[data-interactive]': {
            cursor: 'pointer',
            transition: 'background-color 140ms ease, border-color 140ms ease, color 140ms ease',
            '&:hover:not([data-disabled])': {
              backgroundColor: t.color.background.elevated.var,
            },
            '&:focus-visible': {
              ...focusRing,
            },
          },
          '&[data-removable]': {
            // Room for the sibling remove button overlaid on the trailing edge.
            paddingInlineEnd: `calc(${t.space[2].var} + ${t.space[1].var} + 1.25rem)`,
          },
          '&[data-selected]': {
            [vars.borderColor.name]: vars.solidBg.var,
            [vars.backgroundColor.name]: vars.solidBg.var,
            [vars.textColor.name]: vars.solidFg.var,
          },
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        wrapper: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
        },
        label: {
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        removeButton: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          borderRadius: t.radius.full.var,
          padding: '2px',
          marginInlineEnd: `calc(${t.space[1].var} * -0.5)`,
          '&[data-overlay]': {
            position: 'absolute',
            insetInlineEnd: t.space[2].var,
            insetBlockStart: '50%',
            transform: 'translateY(-50%)',
            marginInlineEnd: 0,
          },
          '&[data-disabled]': {
            cursor: 'not-allowed',
          },
          '&:hover': {
            backgroundColor: vars.removeHoverBackground.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        tone: mapTone((key) => ({ root: toneChannelAssignments(vars, key) })),
        appearance: {
          subtle: {
            root: {
              [vars.borderColor.name]: subtleBorderColor(vars.semantic.var),
              [vars.backgroundColor.name]: subtleBackgroundColor(vars.semantic.var),
              [vars.textColor.name]: vars.semantic.var,
            },
          },
          solid: {
            root: {
              [vars.borderColor.name]: vars.solidBg.var,
              [vars.backgroundColor.name]: vars.solidBg.var,
              [vars.textColor.name]: vars.solidFg.var,
            },
          },
          outline: {
            root: {
              [vars.borderColor.name]: vars.semantic.var,
              [vars.backgroundColor.name]: 'transparent',
              [vars.textColor.name]: vars.semantic.var,
            },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type ChipVariantProps = RecipeVariants<typeof chip>;
