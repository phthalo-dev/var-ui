import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import {
  appearanceSurface,
  mapTone,
  surfaceAppearance,
  toneChannelAssignments,
  toneWithDefault,
} from '../shared/semanticTone';

/**
 * Page-level announcement bar. Same tone system as `alert`, but full-width
 * with horizontal layout, inline actions, and an optional dismiss control.
 *
 * ```tsx
 * const b = banner({ tone: 'warning' });
 * <div className={b.root} role="alert">…</div>
 * ```
 */
export const banner = typestyles.recipe({
  name: 'banner',
  layer: 'components',
  slots: ['root', 'icon', 'content', 'title', 'actions', 'dismiss'],
  variants: {
    tone: toneWithDefault('info'),
    appearance: surfaceAppearance,
  },
  vars: {
    semantic: { ...atProperty.color, value: t.color.tone.accent.foreground.var },
    solidBg: { ...atProperty.color, value: t.color.tone.accent.background.var },
    solidFg: { ...atProperty.color, value: t.color.tone.accent.foregroundOnBackground.var },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space.sm.var,
          width: '100%',
          padding: `${t.space.sm.var} ${t.space.md.var}`,
          fontSize: t.fontSize.md.var,
          lineHeight: 1.5,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          color: vars.semantic.var,
        },
        content: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: t.space.xs.var,
        },
        title: {
          fontWeight: t.fontWeight.semibold.var,
          color: vars.semantic.var,
        },
        actions: {
          display: 'flex',
          gap: t.space.xs.var,
          flexShrink: 0,
        },
        dismiss: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space.xxs.var,
          borderRadius: t.radius.sm.var,
          '&:hover': { backgroundColor: appearanceSurface(vars, 'subtle').backgroundColor },
          '&:focus-visible': {
            ...focusRing,
          },
        },
      },
      variants: {
        tone: mapTone((key) => ({ root: toneChannelAssignments(vars, key) })),
        appearance: {
          subtle: {
            root: appearanceSurface(vars, 'subtle', { includeBorder: false }),
          },
          solid: {
            root: appearanceSurface(vars, 'solid', { includeBorder: false }),
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
          outline: {
            root: appearanceSurface(vars, 'outline', { includeBorder: false }),
          },
        },
      },
    };
  },
});

export type BannerVariantProps = RecipeVariants<typeof banner>;
