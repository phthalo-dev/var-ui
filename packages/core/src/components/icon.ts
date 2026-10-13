import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

/** Opt-in horizontal flip for directional icons in RTL. */
export const iconMirrorStyle = {
  '&[data-mirror]': { transform: 'scaleX(-1)' },
} as const;

/**
 * Styling-only icon shell: sizes the em-box and colors the glyph via
 * `currentColor`. No SVG markup lives in core — the React `<Icon>` renders
 * provider-resolved glyphs inside this class.
 *
 * ```tsx
 * <span className={icon({ size: 'md' })}>{svg}</span>
 * ```
 */
export const icon = typestyles.recipe(
  'icon',
  (c) => {
    const v = c.vars({
      size: { value: t.size.icon.md.var, syntax: '<length>' },
      color: { value: 'currentColor', syntax: '*' },
    });
    return {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: v.size.var,
        height: v.size.var,
        color: v.color.var,
        '& svg': {
          width: '100%',
          height: '100%',
        },
        ...iconMirrorStyle,
      },
      variants: {
        size: {
          sm: { [v.size.name]: t.size.icon.sm.var },
          md: { [v.size.name]: t.size.icon.md.var },
          lg: { [v.size.name]: t.size.icon.lg.var },
          inherit: { [v.size.name]: '1em' },
        },
      },
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);
