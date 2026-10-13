import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/**
 * Bordered surface region with an optional title — the page-section building
 * block (named-export promotion of the `layout.section` utility).
 *
 * ```tsx
 * const s = section();
 * <section className={s.root}><h2 className={s.title}>Forms</h2>…</section>
 * ```
 */
export const section = typestyles.recipe(
  'section',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default.var, syntax: '<color>' },
      background: { value: t.color.background.surface.var, syntax: '<color>' },
    });
    return {
      slots: ['root', 'title'],
      root: {
        display: 'grid',
        gap: t.space[3].var,
        padding: t.space[4].var,
        borderWidth: t.borderWidth.default.var,
        borderStyle: 'solid',
        borderColor: v.border.var,
        borderRadius: t.radius.lg.var,
        backgroundColor: v.background.var,
        boxShadow: t.shadow.xs.var,
      },
      title: {
        margin: 0,
        fontSize: t.fontSize.xl.var,
        fontWeight: t.fontWeight.semibold.var,
      },
    };
  },
  { layer: 'components' },
);
