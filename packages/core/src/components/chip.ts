import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
  type SurfaceAppearance,
} from './semanticTone';

/**
 * Compact pill-shaped label for filters, tags, and removable tokens.
 *
 * ```ts
 * const c = chip({ tone: 'accent', appearance: 'subtle' });
 * <span className={c.root}><span className={c.label}>React</span></span>
 * ```
 */
export const chip = typestyles.recipe(
  'chip',
  (c) => {
    const v = c.vars({
      semantic: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      solidBg: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      solidFg: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      borderColor: {
        value: t.color.border.default.var,
        syntax: '<color>',
      },
      backgroundColor: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      textColor: {
        value: t.color.text.secondary.var,
        syntax: '<color>',
      },
      removeHoverBackground: {
        value: t.color.background.elevated.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'label', 'removeButton'],
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
          borderColor: v.borderColor.var,
          backgroundColor: v.backgroundColor.var,
          color: v.textColor.var,
          '&[data-interactive]': {
            cursor: 'pointer',
            transition: 'background-color 140ms ease, border-color 140ms ease, color 140ms ease',
            '&:hover:not([data-disabled])': {
              backgroundColor: t.color.background.elevated.var,
            },
            '&:focus-visible': {
              outline: `2px solid ${t.color.border.focus.var}`,
              outlineOffset: '2px',
            },
          },
          '&[data-selected]': {
            [v.borderColor.name]: v.solidBg.var,
            [v.backgroundColor.name]: v.solidBg.var,
            [v.textColor.name]: v.solidFg.var,
          },
          '&[data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
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
          '&:hover': {
            backgroundColor: v.removeHoverBackground.var,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: {
          neutral: {
            root: {
              [v.semantic.name]: t.color.text.secondary.var,
              [v.solidBg.name]: t.color.text.primary.var,
              [v.solidFg.name]: t.color.background.surface.var,
            },
          },
          accent: { root: semanticChannelAssignments(v, 'accent') },
          success: { root: semanticChannelAssignments(v, 'success') },
          warning: { root: semanticChannelAssignments(v, 'warning') },
          danger: { root: semanticChannelAssignments(v, 'danger') },
          tip: { root: semanticChannelAssignments(v, 'info') },
        },
        appearance: {
          subtle: {
            root: {
              [v.borderColor.name]: subtleBorderColor(v.semantic.var),
              [v.backgroundColor.name]: subtleBackgroundColor(v.semantic.var),
              [v.textColor.name]: v.semantic.var,
            },
          },
          solid: {
            root: {
              [v.borderColor.name]: v.solidBg.var,
              [v.backgroundColor.name]: v.solidBg.var,
              [v.textColor.name]: v.solidFg.var,
            },
          },
          outline: {
            root: {
              [v.borderColor.name]: v.semantic.var,
              [v.backgroundColor.name]: 'transparent',
              [v.textColor.name]: v.semantic.var,
            },
          },
        },
      },
      defaultVariants: { tone: 'neutral', appearance: 'subtle' },
    };
  },
  { layer: 'components' },
);

export type ChipRecipeProps = NonNullable<Parameters<typeof chip>[0]>;
export type ChipTone = NonNullable<ChipRecipeProps['tone']>;
export type ChipVariantProps = {
  tone?: ChipTone;
  appearance?: SurfaceAppearance;
};

export const chipVariantPropDocs = [
  { name: 'tone', type: 'ChipTone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof ChipVariantProps;
  type: string;
  required: false;
}>;
