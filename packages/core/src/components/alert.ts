import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  appearanceSurface,
  semanticChannelAssignments,
  type SurfaceAppearance,
} from './semanticTone';

/**
 * Slot component with cross-axis variants using `c.vars()`:
 *
 * - **tone** assigns semantic colors on `root` (custom properties). `title` uses
 *   `color: var(semantic)` in base styles (the var inherits from `root`).
 * - **appearance** chooses how those tokens are *applied* (tinted surface vs solid fill).
 *
 * This avoids a compound-variant grid (`appearance × tone`) while keeping each axis
 * easy to extend independently.
 *
 * **Prior step:** `badge.ts` is the same `c.vars()` idea on a single-slot (flat) component.
 *
 * **Shared:** `semanticTone.ts` — one table for tone channels; subtle mixes match badge.
 */
export const alert = typestyles.recipe(
  'alert',
  (c) => {
    const v = c.vars({
      semantic: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
      solidBg: {
        value: t.color.tone.accent.background.var,
        syntax: '<color>',
      },
      solidFg: {
        value: t.color.tone.accent.foregroundOnBackground.var,
        syntax: '<color>',
      },
    });

    return {
      slots: ['root', 'icon', 'body', 'title', 'content', 'action', 'actionLink'],
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space[3].var,
          padding: t.space[4].var,
          borderRadius: t.radius.md.var,
          lineHeight: 1.55,
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          fontSize: t.fontSize.lg.var,
          lineHeight: 1,
        },
        body: {
          flex: 1,
          minWidth: 0,
        },
        title: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.semibold.var,
          margin: 0,
          color: v.semantic.var,
        },
        content: {
          fontSize: t.fontSize.md.var,
          margin: 0,
          color: 'inherit',
        },
        action: {
          marginTop: t.space[2].var,
        },
        actionLink: {
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          color: 'inherit',
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
          '&:hover': {
            textDecoration: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus.var}`,
            outlineOffset: '2px',
            borderRadius: t.radius.sm.var,
          },
        },
      },
      variants: {
        tone: {
          info: { root: semanticChannelAssignments(v, 'accent') },
          success: { root: semanticChannelAssignments(v, 'success') },
          warning: { root: semanticChannelAssignments(v, 'warning') },
          danger: { root: semanticChannelAssignments(v, 'danger') },
          tip: { root: semanticChannelAssignments(v, 'info') },
        },
        appearance: {
          subtle: {
            root: appearanceSurface(v, 'subtle'),
          },
          solid: {
            root: appearanceSurface(v, 'solid'),
            title: { color: 'inherit' },
            icon: { color: 'inherit' },
          },
          outline: {
            root: appearanceSurface(v, 'outline'),
          },
        },
        contentGap: {
          spaced: { content: { marginTop: t.space[1].var } },
          flush: { content: { marginTop: 0 } },
        },
      },
      defaultVariants: {
        tone: 'info',
        appearance: 'subtle',
        contentGap: 'spaced',
      },
    };
  },
  { layer: 'components' },
);

export type AlertRecipeProps = NonNullable<Parameters<typeof alert>[0]>;
export type AlertTone = NonNullable<AlertRecipeProps['tone']>;
/** Public API alias — React/Astro `Alert` uses `variant` for this axis. */
export type AlertVariant = AlertTone;
export type AlertVariantProps = {
  tone?: AlertTone;
  appearance?: SurfaceAppearance;
  contentGap?: NonNullable<AlertRecipeProps['contentGap']>;
};

export const alertVariantPropDocs = [
  { name: 'tone', type: 'AlertTone', required: false },
  { name: 'appearance', type: 'SurfaceAppearance', required: false },
  { name: 'contentGap', type: "'spaced' | 'flush'", required: false },
] as const satisfies ReadonlyArray<{
  name: keyof AlertVariantProps;
  type: string;
  required: boolean;
}>;
