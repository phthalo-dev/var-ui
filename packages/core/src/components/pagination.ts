import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';
import { controlSize } from '../shared/variantAxes';
import { atProperty, type RecipeVariants } from 'typestyles';

/**
 * Pagination chrome. Page-number and prev/next buttons reuse the existing
 * `button`/`IconButton` recipes — this recipe only covers the chrome those
 * don't already provide (ellipsis text, count/compact text, dot indicators,
 * page-size grouping).
 *
 * ```ts
 * const p = pagination({ size: 'sm' });
 * <nav className={p.root}>…</nav>
 * ```
 */
export const pagination = typestyles.recipe({
  name: 'pagination',
  layer: 'components',
  slots: [
    'root',
    'controls',
    'ellipsis',
    'infoText',
    'dotsContainer',
    'dot',
    'dotActive',
    'pageSizeGroup',
  ],
  variants: { size: controlSize },
  vars: {
    textColor: { ...atProperty.color, value: t.color.text.secondary.var },
    dotColor: { ...atProperty.color, value: t.color.border.default.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.space[4].var,
          flexWrap: 'wrap',
        },
        controls: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1].var,
        },
        ellipsis: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          height: '2rem',
          color: vars.textColor.var,
          fontSize: t.fontSize.sm.var,
          userSelect: 'none',
        },
        infoText: {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.sm.var,
          color: vars.textColor.var,
        },
        dotsContainer: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1].var,
        },
        dot: {
          width: t.space[2].var,
          height: t.space[2].var,
          borderWidth: 0,
          padding: 0,
          borderRadius: '50%',
          backgroundColor: vars.dotColor.var,
          cursor: 'pointer',
          transition: t.transition.surfaceFast.var,
          ...atForcedColors(forced.track),
          '&:focus-visible': {
            ...focusRing,
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: t.opacity.disabled.var,
          },
        },
        dotActive: {
          backgroundColor: t.color.tone.accent.background.var,
          ...atForcedColors(forced.fill),
        },
        pageSizeGroup: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          fontSize: t.fontSize.sm.var,
          color: vars.textColor.var,
        },
      },
      variants: {
        size: {
          sm: {
            ellipsis: { minWidth: '1.5rem', height: '1.5rem', fontSize: t.fontSize.xs.var },
            dot: { width: t.space[1].var, height: t.space[1].var },
          },
          md: {},
          lg: {
            ellipsis: { minWidth: '2.5rem', height: '2.5rem', fontSize: t.fontSize.md.var },
            dot: { width: t.space[2].var, height: t.space[2].var },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type PaginationVariantProps = RecipeVariants<typeof pagination>;
