import { atProperty, variant, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atDarkMode, atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { controlSizeMetrics, controlSizeVariants } from '../internal/controlSize';
import { controlSize, type ControlSize } from '../shared/variantAxes';

const segmentedSegmentPaddingInline: Record<ControlSize, string> = {
  sm: t.space.xs.var,
  md: t.space.sm.var,
  lg: t.space.md.var,
};

/** Gap between the track edge and the indicator / segments. */
const trackPadding = `calc(${t.space.xxs.var} / 2)`;
/** Nested radius: the indicator (and each segment's focus ring) is the track radius minus its inset. */
const segmentRadius = `calc(${t.radius.md.var} - ${trackPadding})`;

/** `default` — text (or icon + text) segments; `icon` — square, icon-only segments. */
const segmentedControlLayout = variant.enum(['default', 'icon'], { default: 'default' });

/** Track + segment metrics for segmented controls. */
function segmentedControlSize(size: ControlSize) {
  const height = controlSizeMetrics[size].height;
  return {
    root: {
      boxSizing: 'border-box' as const,
      height,
      minHeight: height,
    },
    segment: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.space.xxs.var,
      height: '100%',
      minHeight: 0,
      paddingInline: segmentedSegmentPaddingInline[size],
      fontSize: controlSizeMetrics[size].fontSize,
      lineHeight: 1,
    },
    segmentMinWidth: `calc(${height} - 2 * ${trackPadding})`,
  };
}

/**
 * Single-choice segmented control: a track with a sliding indicator behind the checked segment.
 *
 * Segments are direct children of `root`. React renders them as radios (`RadioGroup`), Astro as
 * `<label>`s wrapping native radio inputs; `data-selected` marks the checked one and positions
 * the indicator (see `observeSegmentedControlIndicator`).
 */
export const segmentedControl = typestyles.recipe({
  name: 'segmented-control',
  layer: 'components',
  slots: ['root'],
  variants: { size: controlSize, layout: segmentedControlLayout },
  vars: {
    trackBackground: {
      ...atProperty.color,
      value: t.color.background.subtle.var,
    },
    trackBorder: {
      ...atProperty.color,
      value: t.color.border.subtle.var,
    },
    indicatorBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    indicatorBorder: {
      ...atProperty.color,
      value: t.color.border.subtle.var,
    },
    segmentColor: { ...atProperty.color, value: t.color.text.secondary.var },
    segmentHoverColor: { ...atProperty.color, value: t.color.text.primary.var },
    segmentSelectedColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    indicatorX: { ...atProperty.length, value: '0rem' },
    indicatorWidth: { ...atProperty.length, value: '0rem' },
    indicatorOpacity: { ...atProperty.number, value: '0' },
  },
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          padding: trackPadding,
          gap: 0,
          borderRadius: t.radius.md.var,
          border: 'none',
          backgroundColor: vars.trackBackground.var,
          boxShadow: `inset 0 0 0 0.0625rem ${vars.trackBorder.var}`,
          isolation: 'isolate',
          ...atForcedColors(forced.boundary),
          // Dark mode: the thumb lifts (lighter than the track) instead of sinking into it.
          ...atDarkMode({
            [vars.indicatorBackground.name]: t.color.background.elevated.var,
            [vars.indicatorBorder.name]: t.color.border.default.var,
          }),
          '&::after': {
            content: '""',
            position: 'absolute',
            top: trackPadding,
            bottom: trackPadding,
            insetInlineStart: 0,
            width: vars.indicatorWidth.var,
            borderRadius: segmentRadius,
            backgroundColor: vars.indicatorBackground.var,
            boxShadow: `0 0 0 0.0625rem ${vars.indicatorBorder.var}, ${t.shadow.xs.var}`,
            pointerEvents: 'none',
            opacity: vars.indicatorOpacity.var,
            zIndex: t.zIndex.base.var,
            transform: `translateX(${vars.indicatorX.var})`,
          },
          // Slide only once placed (`observeSegmentedControlIndicator`), never on first paint.
          '&[data-indicator-ready]::after': {
            transition: `${transitionOf(['transform', 'width'], 'medium', 'emphasized')}, ${transitionOf('opacity', 'fast')}`,
          },
          '& > *': {
            position: 'relative',
            zIndex: t.zIndex.raised.var,
            flex: '1 1 auto',
            boxSizing: 'border-box',
            border: 'none',
            borderRadius: segmentRadius,
            backgroundColor: 'transparent',
            color: vars.segmentColor.var,
            fontWeight: t.fontWeight.medium.var,
            boxShadow: 'none',
            cursor: 'pointer',
            userSelect: 'none',
            transition: transitionOf('color', 'fast'),
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              color: vars.segmentHoverColor.var,
            },
            // React Aria marks the radio label; Astro segments are labels around a native radio.
            '&:focus-visible, &[data-focus-visible], &:has(:focus-visible)': {
              ...focusRing,
            },
            '&[data-disabled], &:has(:disabled)': {
              opacity: t.opacity.disabled.var,
              cursor: 'not-allowed',
            },
            '&[data-selected], &[aria-pressed="true"]': {
              color: vars.segmentSelectedColor.var,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              ...atForcedColors(forced.selected),
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              },
            },
            '& svg': {
              flexShrink: 0,
            },
          },
          // Native radio inside an Astro segment: visually hidden, still focusable and announced.
          '& > * > input[type="radio"]': {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            opacity: 0,
            cursor: 'inherit',
            appearance: 'none',
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => {
          const metrics = segmentedControlSize(size);
          const segment = { ...metrics.segment, minWidth: metrics.segmentMinWidth };
          return {
            root: {
              ...metrics.root,
              '& > *': segment,
              // Segments usually carry `toggleButton` classes whose size padding would win on
              // order; the attribute lifts the track's metrics above them.
              '& > [class]': segment,
            },
          };
        }),
        layout: {
          default: {},
          icon: {
            root: {
              '& > *, & > [class]': {
                flex: '0 0 auto',
                aspectRatio: '1 / 1',
                paddingInline: 0,
              },
            },
          },
        },
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SegmentedControlVariantProps = RecipeVariants<typeof segmentedControl>;
