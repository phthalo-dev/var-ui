import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  appearanceSurface,
  mapTone,
  surfaceAppearance,
  toneChannelAssignments,
  toneWithDefault,
  type SurfaceAppearance,
  type Tone,
} from './semanticTone';

/**
 * Page-level announcement bar. Same tone system as `alert`, but full-width
 * with horizontal layout, inline actions, and an optional dismiss control.
 *
 * ```tsx
 * const b = banner({ tone: 'warning' });
 * <div className={b.root} role="alert">…</div>
 * ```
 */
export const banner = typestyles.recipe(
  'banner',
  {
    slots: ['root', 'icon', 'content', 'title', 'actions', 'dismiss'],
    variants: {
      tone: toneWithDefault('info'),
      appearance: surfaceAppearance,
    },
  },
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.tone.accent.foreground.var, syntax: '<color>' },
      solidBg: { value: t.color.tone.accent.background.var, syntax: '<color>' },
      solidFg: { value: t.color.tone.accent.foregroundOnBackground.var, syntax: '<color>' },
    });
    return {
      base: {
        root: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[3].var,
          width: '100%',
          padding: `${t.space[3].var} ${t.space[4].var}`,
          fontSize: t.fontSize.md.var,
          lineHeight: 1.5,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          color: v.semantic.var,
        },
        content: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: t.space[2].var,
        },
        title: {
          fontWeight: t.fontWeight.semibold.var,
          color: v.semantic.var,
        },
        actions: {
          display: 'flex',
          gap: t.space[2].var,
          flexShrink: 0,
        },
        dismiss: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1].var,
          borderRadius: t.radius.sm.var,
          '&:hover': { backgroundColor: appearanceSurface(v, 'subtle').backgroundColor },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: mapTone((key) => ({ root: toneChannelAssignments(v, key) })),
        appearance: {
          subtle: {
            root: appearanceSurface(v, 'subtle', { includeBorder: false }),
          },
          solid: {
            root: appearanceSurface(v, 'solid', { includeBorder: false }),
            icon: { color: 'inherit' },
            title: { color: 'inherit' },
          },
          outline: {
            root: appearanceSurface(v, 'outline', { includeBorder: false }),
          },
        },
      },
    };
  },
  { layer: 'components' },
);

export type BannerRecipeProps = NonNullable<Parameters<typeof banner>[0]>;
export type BannerVariantProps = {
  tone?: Tone;
  appearance?: SurfaceAppearance;
};

export const bannerVariantPropDocs = [
  { name: 'tone', type: 'Tone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof BannerVariantProps;
  type: string;
  required: false;
}>;
