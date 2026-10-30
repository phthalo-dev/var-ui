import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { size } from '../shared/variantAxes';
import { border } from '../internal/border';
import { forced } from '../internal/forcedColors';
import { atForcedColors } from '../theme/conditions';

/**
 * Identity avatar: image with initials fallback and an optional status well
 * (bottom-right, sized for a `statusDot`).
 *
 * ```tsx
 * const a = avatar({ size: 'lg' });
 * <span className={a.root}><img className={a.image} … /></span>
 * ```
 */
export const avatar = typestyles.recipe({
  name: 'avatar',
  layer: 'components',
  slots: ['root', 'image', 'initials', 'status'],
  variants: { size },
  vars: {
    size: { ...atProperty.length, value: '32px' },
    background: {
      ...atProperty.color,
      value: t.color.tone.accent.subtleBackground.var,
    },
    foreground: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          width: vars.size.var,
          height: vars.size.var,
          borderRadius: '50%',
          backgroundColor: vars.background.var,
          color: vars.foreground.var,
          flexShrink: 0,
          verticalAlign: 'middle',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          objectFit: 'cover',
        },
        initials: {
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          fontSize: `calc(${vars.size.var} * 0.4)`,
          fontWeight: t.fontWeight.semibold.var,
          textTransform: 'uppercase',
          userSelect: 'none',
        },
        status: {
          position: 'absolute',
          insetInlineEnd: '-1px',
          bottom: '-1px',
          display: 'inline-flex',
          borderRadius: '50%',
          ...border(t.color.background.surface.var, t.borderWidth.thick.var),
          ...atForcedColors(forced.swatch),
        },
      },
      variants: {
        size: {
          xs: { root: { [vars.size.name]: '20px' } },
          sm: { root: { [vars.size.name]: '24px' } },
          md: { root: { [vars.size.name]: '32px' } },
          lg: { root: { [vars.size.name]: '40px' } },
          xl: { root: { [vars.size.name]: '56px' } },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type AvatarVariantProps = RecipeVariants<typeof avatar>;

/**
 * Overlapping avatar row with a "+N" overflow chip.
 *
 * ```tsx
 * const g = avatarGroup();
 * <span className={g.root}>{avatars.map(a => <span className={g.item}>{a}</span>)}</span>
 * ```
 */
export const avatarGroup = typestyles.recipe({
  name: 'avatar-group',
  layer: 'components',
  slots: ['root', 'item', 'overflow'],
  vars: {
    ringColor: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: { display: 'inline-flex', alignItems: 'center' },
        item: {
          marginInlineStart: `calc(${t.space[2].var} * -1)`,
          borderRadius: '50%',
          boxShadow: `0 0 0 2px ${vars.ringColor.var}`,
          '&:first-child': { marginInlineStart: 0 },
        },
        overflow: {
          marginInlineStart: `calc(${t.space[2].var} * -1)`,
          display: 'grid',
          placeItems: 'center',
          minWidth: '32px',
          height: '32px',
          padding: `0 ${t.space[1].var}`,
          borderRadius: '50%',
          backgroundColor: t.color.background.subtle.var,
          boxShadow: `0 0 0 2px ${vars.ringColor.var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          color: t.color.text.secondary.var,
        },
      },
    };
  },
});
