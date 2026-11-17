import { keyframes } from 'typestyles';
import { atReducedMotion, designTokens as t, typestyles } from '@var-ui/core';

const belowMd = typestyles.breakpoint('md', 'max');

/**
 * Ring colors, innermost to outermost: the brand's phthalo ramp walking out to the
 * wordmark's amber ramp, as `[family, step]` palette tokens. Tonal steps of two families,
 * not a rainbow.
 */
export const SPECTRUM_STEPS = [
  ['phthalo', 6],
  ['phthalo', 5],
  ['phthalo', 5],
  ['phthalo', 4],
  ['amber', 4],
  ['amber', 4],
  ['amber', 5],
  ['amber', 6],
] as const;

const swatch = ([family, step]: (typeof SPECTRUM_STEPS)[number]) =>
  t.color.palette[`${family}-${step}` as keyof typeof t.color.palette].var;

const rise = keyframes.create('home-spectrum-rise', {
  // Scale only: opacity stays with the ring (an animated opacity would override it).
  from: { scale: '0.97' },
  to: { scale: '1' },
});

/**
 * The closing band's illustration: the palette as a sunrise. Concentric arcs of palette
 * tokens rise behind the CTA, desaturated toward the page background and faded out at the
 * band's edges (never hard-cropped). Scroll-driven entrance; still under reduced motion.
 * Hidden on phones, where the arcs would run behind the stacked CTAs.
 */
export const homeSpectrum = typestyles.recipe({
  name: 'home-spectrum',
  layer: 'components',
  slots: ['root', 'anchor', 'ring'],
  styles: () => {
    // Wide enough that the headline and CTAs sit inside the innermost arc.
    const inner = 'min(76rem, 120vw)';
    const band = 'clamp(0.625rem, 1.4vw, 1.25rem)';
    const rings = Object.fromEntries(
      SPECTRUM_STEPS.map((entry, index) => [
        `&:nth-child(${index + 1})`,
        {
          width: `calc(${inner} + ${index} * 3 * ${band})`,
          // Pull each step toward the page background: tonal, not neon.
          borderColor: `color-mix(in srgb, ${swatch(entry)} 72%, ${t.color.background.app.var})`,
          animationRange: `entry 0% entry ${30 + index * 3}%`,
        },
      ]),
    );

    return {
      base: {
        root: {
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
          // Fade at every edge (top border, footer divider, viewport sides): never cropped.
          maskImage: [
            'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
            'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          ].join(', '),
          maskComposite: 'intersect',
          [belowMd]: { display: 'none' },
        },
        anchor: {
          position: 'absolute',
          left: '50%',
          bottom: '-2rem',
          width: 0,
          height: 0,
        },
        ring: {
          position: 'absolute',
          left: 0,
          top: 0,
          aspectRatio: '1',
          boxSizing: 'border-box',
          borderRadius: t.radius.full.var,
          borderWidth: band,
          borderStyle: 'solid',
          translate: '-50% -50%',
          ...rings,
          '@supports (animation-timeline: view())': {
            animationName: rise,
            animationTimingFunction: 'ease-out',
            animationFillMode: 'both',
            animationTimeline: 'view()',
          },
          ...atReducedMotion({ animation: 'none' }),
        },
      },
    };
  },
});
