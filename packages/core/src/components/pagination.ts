import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

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
export const pagination = typestyles.recipe(
  'pagination',
  (c) => {
    const v = c.vars({
      textColor: { value: t.color.text.secondary.var, syntax: '<color>' },
      dotColor: { value: t.color.border.default.var, syntax: '<color>' },
    });
    return {
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
          color: v.textColor.var,
          fontSize: t.fontSize.sm.var,
          userSelect: 'none',
        },
        infoText: {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: t.fontSize.sm.var,
          color: v.textColor.var,
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
          backgroundColor: v.dotColor.var,
          cursor: 'pointer',
          transition: `background-color ${t.duration.fast.var} ${t.easing.standard.var}`,
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.5,
          },
        },
        dotActive: {
          backgroundColor: t.color.tone.accent.background.var,
        },
        pageSizeGroup: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[2].var,
          fontSize: t.fontSize.sm.var,
          color: v.textColor.var,
        },
      },
      variants: {
        size: {
          sm: {
            ellipsis: { minWidth: '1.5rem', height: '1.5rem', fontSize: t.fontSize.xs.var },
            dot: { width: t.space[1].var, height: t.space[1].var },
          },
          md: {},
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
