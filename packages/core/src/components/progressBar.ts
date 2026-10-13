import { keyframes } from 'typestyles';
import { typestyles } from '../runtime';
import { atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { semanticTone, type ProgressBarAppearance, type ProgressBarTone } from './semanticTone';

const slide = keyframes.create('var-ui-progress-slide', {
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(400%)' },
});

const toneKeys: ProgressBarTone[] = ['accent', 'success', 'warning', 'danger'];

/**
 * Linear progress. Fill width is set inline by the React wrapper
 * (percentage); the `indeterminate` variant animates a sliding segment.
 */
export const progressBar = typestyles.recipe(
  'progress-bar',
  (c) => {
    const v = c.vars({
      trackColor: {
        value: t.color.background.subtle.var,
        syntax: '<color>',
      },
      fillColor: {
        value: t.color.tone.accent.foreground.var,
        syntax: '<color>',
      },
    });
    return {
      slots: ['root', 'header', 'label', 'valueText', 'track', 'fill'],
      base: {
        root: { display: 'grid', gap: t.space[1].var, minWidth: '160px' },
        header: { display: 'flex', justifyContent: 'space-between', gap: t.space[3].var },
        label: { fontSize: t.fontSize.sm.var, fontWeight: t.fontWeight.medium.var },
        valueText: { fontSize: t.fontSize.sm.var, color: t.color.text.secondary.var },
        track: {
          height: '6px',
          borderRadius: t.radius.full.var,
          backgroundColor: v.trackColor.var,
          overflow: 'hidden',
        },
        fill: {
          height: '100%',
          borderRadius: 'inherit',
          backgroundColor: v.fillColor.var,
          transition: `width ${t.duration.medium.var} ${t.easing.standard.var}`,
        },
      },
      variants: {
        tone: Object.fromEntries(
          toneKeys.map((key) => [
            key,
            { root: { [v.fillColor.name]: semanticTone[key].background } },
          ]),
        ) as Record<ProgressBarTone, { root: Record<string, string> }>,
        appearance: {
          solid: {},
          subtle: {
            fill: {
              backgroundColor: `color-mix(in srgb, ${v.fillColor.var} 55%, ${t.color.background.subtle.var})`,
            },
          },
        },
        indeterminate: {
          true: {
            fill: {
              width: '25%',
              animation: `${slide} 1200ms ease-in-out infinite`,
              ...atReducedMotion({
                animation: 'none',
                width: '100%',
                opacity: 0.5,
              }),
            },
          },
          false: {},
        },
      },
      defaultVariants: { tone: 'accent', appearance: 'solid', indeterminate: 'false' },
    };
  },
  { layer: 'components' },
);

export type ProgressBarRecipeProps = NonNullable<Parameters<typeof progressBar>[0]>;

export type ProgressBarVariantProps = {
  tone?: ProgressBarTone;
  appearance?: ProgressBarAppearance;
};

export const progressBarVariantPropDocs = [
  { name: 'tone', type: 'ProgressBarTone', required: false },
  { name: 'appearance', type: 'ProgressBarAppearance', required: false },
] as const satisfies ReadonlyArray<{
  name: keyof ProgressBarVariantProps;
  type: string;
  required: false;
}>;
