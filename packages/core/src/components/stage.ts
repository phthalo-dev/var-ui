import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const stagePattern = variant.enum(['dots', 'grid', 'none'], { default: 'dots' });
const stageTone = variant.enum(['neutral', 'accent'], { default: 'neutral' });
const stageFade = variant.enum(['none', 'start', 'end'], { default: 'none' });

/**
 * Showcase surface for live examples: a barely tinted plane with a faint dot (or line) field,
 * so components read as objects placed on a stage. The Var UI demo motif, shared by docs demo
 * frames, playgrounds and page hero bands.
 *
 * `fade` masks the pattern toward an edge (`start` keeps it at the start edge, `end` at the end),
 * so text can sit on the quiet side.
 *
 * ```tsx
 * <div {...mergeProps(stage({ tone: 'accent', fade: 'end' }))}>…</div>
 * ```
 */
export const stage = typestyles.recipe({
  name: 'stage',
  layer: 'components',
  variants: { pattern: stagePattern, tone: stageTone, fade: stageFade },
  vars: {
    ink: { ...atProperty.color, value: t.color.text.primary.var },
    inkStrength: { syntax: '*', initial: '13%', value: '13%' },
    surface: {
      ...atProperty.color,
      value: `color-mix(in oklab, ${t.color.background.subtle.var} 55%, ${t.color.background.surface.var})`,
    },
    spacing: { ...atProperty.length, value: '1rem' },
  },
  styles: ({ vars }) => ({
    base: {
      position: 'relative',
      isolation: 'isolate',
      backgroundColor: vars.surface.var,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundSize: `${vars.spacing.var} ${vars.spacing.var}`,
        backgroundPosition: `calc(${vars.spacing.var} / 2) calc(${vars.spacing.var} / 2)`,
      },
    },
    variants: {
      pattern: {
        dots: {
          '&::before': {
            backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklab, ${vars.ink.var} ${vars.inkStrength.var}, transparent) 1px, transparent 0)`,
          },
        },
        grid: {
          '&::before': {
            backgroundImage: `linear-gradient(to right, color-mix(in oklab, ${vars.ink.var} ${vars.inkStrength.var}, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, ${vars.ink.var} ${vars.inkStrength.var}, transparent) 1px, transparent 1px)`,
          },
        },
        none: {
          '&::before': { display: 'none' },
        },
      },
      tone: {
        neutral: {},
        accent: {
          [vars.ink.name]: t.color.tone.accent.foreground.var,
          [vars.inkStrength.name]: '32%',
          [vars.surface.name]:
            `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 5%, ${t.color.background.surface.var})`,
        },
      },
      fade: {
        none: {},
        start: {
          '&::before': {
            maskImage: 'linear-gradient(to right, black, rgb(0 0 0 / 55%) 35%, transparent 75%)',
          },
        },
        end: {
          '&::before': {
            maskImage: 'linear-gradient(to left, black, rgb(0 0 0 / 55%) 35%, transparent 75%)',
          },
        },
      },
    },
  }),
});

/** Visual props derived from the schema. */
export type StageVariantProps = RecipeVariants<typeof stage>;
