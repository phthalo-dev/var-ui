import {
  atProperty,
  keyframes,
  variant,
  type RecipeVariants,
  type VariantOptions,
} from 'typestyles';
import { typestyles } from '../runtime';
import { designTokens as t } from '../tokens';

const scrollFadeIn = keyframes.create('var-ui-scroll-fade-in', {
  from: { opacity: '0' },
  to: { opacity: '1' },
});

const scrollFadeOut = keyframes.create('var-ui-scroll-fade-out', {
  from: { opacity: '1' },
  to: { opacity: '0' },
});

/** Edge-mask axis. `none` hides every fade; `both` paints block and inline edges. */
export const scrollAreaFade = variant.enum(['none', 'vertical', 'horizontal', 'both'], {
  default: 'none',
});

/** Scroll-axis. `both` allows overflow on block and inline. */
export const scrollAreaOrientation = variant.enum(['vertical', 'horizontal', 'both'], {
  default: 'vertical',
});

/** Which physical edges a fade option paints. Exhaustive over `scrollAreaFade`. */
const scrollAreaFadeEdges = {
  none: { block: false, inline: false },
  vertical: { block: true, inline: false },
  horizontal: { block: false, inline: true },
  both: { block: true, inline: true },
} as const satisfies Record<
  VariantOptions<typeof scrollAreaFade>,
  { readonly block: boolean; readonly inline: boolean }
>;

/**
 * Scroll container with optional edge fade masks driven by CSS scroll-driven
 * animations on sticky overlays inside the viewport.
 *
 * ```tsx
 * const s = scrollArea({ fade: 'vertical', orientation: 'vertical' });
 * <div className={s.root}>
 *   <div className={s.viewport}>
 *     <div className={s.fadeTop} />
 *     …
 *     <div className={s.fadeBottom} />
 *   </div>
 * </div>
 * ```
 */
export const scrollArea = typestyles.recipe(
  'scroll-area',
  {
    slots: ['root', 'viewport', 'fadeTop', 'fadeBottom', 'fadeStart', 'fadeEnd'],
    variants: {
      fade: scrollAreaFade,
      orientation: scrollAreaOrientation,
    },
  },
  (c) => {
    const v = c.vars({
      fadeSize: { ...atProperty.length, value: '24px' },
      fadeColor: { ...atProperty.color, value: t.color.background.surface.var },
    });

    const fadeAnimationBase = {
      animationDuration: '1ms',
      animationFillMode: 'both' as const,
      animationTimeline: 'scroll(nearest)',
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 0,
      },
    };

    const verticalFadeStart = {
      position: 'sticky' as const,
      top: 0,
      alignSelf: 'stretch' as const,
      width: '100%',
      flexShrink: 0,
      height: v.fadeSize.var,
      marginBlockEnd: `calc(-1 * ${v.fadeSize.var})`,
      pointerEvents: 'none' as const,
      zIndex: 1,
      opacity: 0,
      backgroundImage: `linear-gradient(to bottom, ${v.fadeColor.var}, transparent)`,
      ...fadeAnimationBase,
      animationName: scrollFadeIn,
      animationTimeline: 'scroll(nearest block)',
      animationRange: `1px ${v.fadeSize.var}`,
    };

    const verticalFadeEnd = {
      position: 'sticky' as const,
      bottom: 0,
      alignSelf: 'stretch' as const,
      width: '100%',
      flexShrink: 0,
      height: v.fadeSize.var,
      marginBlockStart: `calc(-1 * ${v.fadeSize.var})`,
      pointerEvents: 'none' as const,
      zIndex: 1,
      opacity: 0,
      backgroundImage: `linear-gradient(to top, ${v.fadeColor.var}, transparent)`,
      ...fadeAnimationBase,
      animationName: scrollFadeOut,
      animationTimeline: 'scroll(nearest block)',
      animationRange: 'exit 0% exit 100%',
    };

    const horizontalFadeStart = {
      position: 'sticky' as const,
      insetInlineStart: 0,
      alignSelf: 'flex-start' as const,
      flexShrink: 0,
      width: v.fadeSize.var,
      minHeight: '100%',
      marginInlineEnd: `calc(-1 * ${v.fadeSize.var})`,
      pointerEvents: 'none' as const,
      zIndex: 1,
      opacity: 0,
      backgroundImage: `linear-gradient(to right, ${v.fadeColor.var}, transparent)`,
      ...fadeAnimationBase,
      animationName: scrollFadeIn,
      animationTimeline: 'scroll(nearest inline)',
      animationRange: `1px ${v.fadeSize.var}`,
    };

    const horizontalFadeEnd = {
      position: 'sticky' as const,
      insetInlineEnd: 0,
      alignSelf: 'flex-end' as const,
      flexShrink: 0,
      width: v.fadeSize.var,
      minHeight: '100%',
      marginInlineStart: `calc(-1 * ${v.fadeSize.var})`,
      pointerEvents: 'none' as const,
      zIndex: 1,
      opacity: 0,
      backgroundImage: `linear-gradient(to left, ${v.fadeColor.var}, transparent)`,
      ...fadeAnimationBase,
      animationName: scrollFadeOut,
      animationTimeline: 'scroll(nearest inline)',
      animationRange: 'exit 0% exit 100%',
    };

    return {
      base: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          [v.fadeSize.name]: '24px',
          '@supports not (animation-timeline: scroll())': {
            [`& .var-ui-scroll-area__fadeTop,
              & .var-ui-scroll-area__fadeBottom,
              & .var-ui-scroll-area__fadeStart,
              & .var-ui-scroll-area__fadeEnd`]: {
              opacity: 0.45,
            },
          },
        },
        viewport: {
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        },
        fadeTop: verticalFadeStart,
        fadeBottom: verticalFadeEnd,
        fadeStart: horizontalFadeStart,
        fadeEnd: horizontalFadeEnd,
      },
      variants: {
        fade: {
          none: {
            fadeTop: { display: 'none' },
            fadeBottom: { display: 'none' },
            fadeStart: { display: 'none' },
            fadeEnd: { display: 'none' },
          },
          vertical: {
            fadeStart: { display: 'none' },
            fadeEnd: { display: 'none' },
          },
          horizontal: {
            fadeTop: { display: 'none' },
            fadeBottom: { display: 'none' },
          },
          both: {},
        },
        orientation: {
          vertical: {
            viewport: {
              overflowX: 'hidden',
              overflowY: 'auto',
            },
          },
          horizontal: {
            viewport: {
              flexDirection: 'row',
              overflowX: 'auto',
              overflowY: 'hidden',
            },
          },
          both: {
            viewport: {
              overflow: 'auto',
            },
          },
        },
      },
    };
  },
  { layer: 'components' },
);

export type ScrollAreaVariantProps = RecipeVariants<typeof scrollArea>;

/** Map a boolean `fade` prop onto `scrollAreaFade`. `true` follows `orientation`. */
export function resolveScrollAreaFade(
  fade: boolean | VariantOptions<typeof scrollAreaFade> | undefined,
  orientation: VariantOptions<typeof scrollAreaOrientation> = scrollAreaOrientation.default,
): VariantOptions<typeof scrollAreaFade> {
  if (!fade || fade === scrollAreaFade.default) return scrollAreaFade.default;
  if (fade === true) return orientation;
  return fade;
}

/** Block (top/bottom) and inline (start/end) fade edges for a resolved fade option. */
export function scrollAreaFadeEdgesFor(fade: VariantOptions<typeof scrollAreaFade>): {
  readonly block: boolean;
  readonly inline: boolean;
} {
  return scrollAreaFadeEdges[fade];
}
