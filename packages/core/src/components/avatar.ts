import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { size } from '../shared/variantAxes';

/**
 * Identity avatar: image with initials fallback and an optional `statusDot`
 * positioned on the bottom-right rim via the `status` slot.
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
    size: { ...atProperty.length, value: t.size.control.md.var },
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
          insetInlineEnd: '-0.0625rem',
          bottom: '-0.0625rem',
        },
      },
      variants: {
        size: {
          xs: { root: { [vars.size.name]: t.size.control.xs.var } },
          sm: { root: { [vars.size.name]: t.size.control.sm.var } },
          md: { root: { [vars.size.name]: t.size.control.md.var } },
          lg: { root: { [vars.size.name]: t.size.control.lg.var } },
          xl: { root: { [vars.size.name]: t.size.control.xl.var } },
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
          marginInlineStart: `calc(${t.space.xs.var} * -1)`,
          borderRadius: '50%',
          boxShadow: `0 0 0 0.125rem ${vars.ringColor.var}`,
          '&:first-child': { marginInlineStart: 0 },
        },
        overflow: {
          marginInlineStart: `calc(${t.space.xs.var} * -1)`,
          display: 'grid',
          placeItems: 'center',
          minWidth: t.size.control.md.var,
          height: t.size.control.md.var,
          padding: `0 ${t.space.xxs.var}`,
          borderRadius: '50%',
          backgroundColor: t.color.background.subtle.var,
          boxShadow: `0 0 0 0.125rem ${vars.ringColor.var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          color: t.color.text.secondary.var,
        },
      },
    };
  },
});
