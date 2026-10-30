import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atDarkMode, atForcedColors } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { controlSizeMetrics, controlSizeVariants } from '../internal/controlSize';
import { controlSize, type ControlSize } from '../shared/variantAxes';

const segmentedSegmentPaddingInline: Record<ControlSize, string> = {
  sm: t.space[3].var,
  md: t.space[4].var,
  lg: t.space[4].var,
};

/** Track + segment metrics for segmented controls (icon-friendly square segments). */
function segmentedControlSize(size: ControlSize) {
  const height = controlSizeMetrics[size].height;
  const trackPadding = t.space[1].var;
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
      height: '100%',
      minHeight: 0,
      paddingInline: segmentedSegmentPaddingInline[size],
      fontSize: controlSizeMetrics[size].fontSize,
      lineHeight: 1,
    },
    indicatorInset: trackPadding,
    segmentMinWidth: `calc(${height} - 2 * ${trackPadding})`,
  };
}

/**
 * Segmented toggle group with a sliding surface indicator behind the active segment.
 */
export const segmentedControl = typestyles.recipe({
  name: 'segmented-control',
  layer: 'components',
  slots: ['root'],
  variants: { size: controlSize },
  vars: {
    trackBackground: {
      ...atProperty.color,
      value: t.color.border.subtle.var,
    },
    indicatorBackground: {
      ...atProperty.color,
      value: t.color.background.surface.var,
    },
    segmentColor: { ...atProperty.color, value: t.color.text.secondary.var },
    segmentSelectedColor: {
      ...atProperty.color,
      value: t.color.text.primary.var,
    },
    indicatorX: { ...atProperty.length, value: '0px' },
    indicatorWidth: { ...atProperty.length, value: '0px' },
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
          padding: t.space[1].var,
          gap: 0,
          borderRadius: t.radius.lg.var,
          border: 'none',
          backgroundColor: vars.trackBackground.var,
          isolation: 'isolate',
          ...atForcedColors(forced.boundary),
          ...atDarkMode({
            '&::after': {
              boxShadow: 'none',
            },
          }),
          '&::after': {
            content: '""',
            position: 'absolute',
            top: t.space[1].var,
            bottom: t.space[1].var,
            insetInlineStart: 0,
            width: vars.indicatorWidth.var,
            borderRadius: t.radius.lg.var,
            backgroundColor: vars.indicatorBackground.var,
            boxShadow: t.shadow.xs.var,
            pointerEvents: 'none',
            opacity: vars.indicatorOpacity.var,
            zIndex: t.zIndex.base.var,
            transform: `translateX(${vars.indicatorX.var})`,
            transition: `${transitionOf(['transform', 'width'], 'medium', 'emphasized')}, ${transitionOf('opacity', 'fast')}`,
          },
          '& > *': {
            position: 'relative',
            zIndex: t.zIndex.raised.var,
            flex: '1 1 auto',
            border: 'none',
            borderRadius: t.radius.lg.var,
            backgroundColor: 'transparent',
            color: vars.segmentColor.var,
            fontWeight: t.fontWeight.normal.var,
            boxShadow: 'none',
            transition: transitionOf(['color', 'font-weight'], 'fast'),
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            },
            '&:focus-visible': {
              ...focusRing,
            },
            '&[data-selected], &[aria-pressed="true"]': {
              color: vars.segmentSelectedColor.var,
              fontWeight: t.fontWeight.semibold.var,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              ...atForcedColors(forced.selected),
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              },
            },
          },
        },
      },
      variants: {
        size: controlSizeVariants((size) => {
          const metrics = segmentedControlSize(size);
          return {
            root: {
              ...metrics.root,
              '& > *': {
                ...metrics.segment,
                minWidth: metrics.segmentMinWidth,
              },
            },
          };
        }),
      },
    };
  },
});

/** Visual props derived from the schema. */
export type SegmentedControlVariantProps = RecipeVariants<typeof segmentedControl>;
