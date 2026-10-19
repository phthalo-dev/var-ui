import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { size } from '../shared/variantAxes';

/**
 * Identity avatar: image with initials fallback and an optional status well
 * (bottom-right, sized for a `statusDot`).
 *
 * ```tsx
 * const a = avatar({ size: 'lg' });
 * <span className={a.root}><img className={a.image} … /></span>
 * ```
 */
export const avatar = typestyles.recipe(
  'avatar',
  {
    slots: ['root', 'image', 'initials', 'status'],
    variants: { size },
  },
  (c) => {
    const v = c.vars({
      size: { ...atProperty.length, value: '32px' },
      background: {
        ...atProperty.color,
        value: t.color.tone.accent.subtleBackground.var,
      },
      foreground: {
        ...atProperty.color,
        value: t.color.text.primary.var,
      },
    });
    return {
      vars: v,
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          width: v.size.var,
          height: v.size.var,
          borderRadius: '50%',
          backgroundColor: v.background.var,
          color: v.foreground.var,
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
          fontSize: `calc(${v.size.var} * 0.4)`,
          fontWeight: t.fontWeight.semibold.var,
          textTransform: 'uppercase',
          userSelect: 'none',
        },
        status: {
          position: 'absolute',
          right: '-1px',
          bottom: '-1px',
          display: 'inline-flex',
          borderRadius: '50%',
          borderWidth: t.borderWidth.thick.var,
          borderStyle: 'solid',
          borderColor: t.color.background.surface.var,
        },
      },
      variants: {
        size: {
          xs: { root: { [v.size.name]: '20px' } },
          sm: { root: { [v.size.name]: '24px' } },
          md: { root: { [v.size.name]: '32px' } },
          lg: { root: { [v.size.name]: '40px' } },
          xl: { root: { [v.size.name]: '56px' } },
        },
      },
    };
  },
  { layer: 'components' },
);

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
export const avatarGroup = typestyles.recipe(
  'avatar-group',
  (c) => {
    const v = c.vars({
      ringColor: {
        ...atProperty.color,
        value: t.color.background.surface.var,
      },
    });
    return {
      slots: ['root', 'item', 'overflow'],
      root: { display: 'inline-flex', alignItems: 'center' },
      item: {
        marginLeft: `calc(${t.space[2].var} * -1)`,
        borderRadius: '50%',
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        '&:first-child': { marginLeft: 0 },
      },
      overflow: {
        marginLeft: `calc(${t.space[2].var} * -1)`,
        display: 'grid',
        placeItems: 'center',
        minWidth: '32px',
        height: '32px',
        padding: `0 ${t.space[1].var}`,
        borderRadius: '50%',
        backgroundColor: t.color.background.subtle.var,
        boxShadow: `0 0 0 2px ${v.ringColor.var}`,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        color: t.color.text.secondary.var,
      },
    };
  },
  { layer: 'components' },
);
