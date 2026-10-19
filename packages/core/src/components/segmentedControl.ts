import { atProperty, type RecipeVariants } from 'typestyles';
import { typestyles } from '../runtime';
import { atDarkMode, atReducedMotion } from '../theme/conditions';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, segmentedControlSize } from './controlSize';
import { controlSize } from './variantAxes';

/**
 * Segmented toggle group with a sliding surface indicator behind the active segment.
 */
export const segmentedControl = typestyles.recipe(
  'segmented-control',
  {
    slots: ['root'],
    variants: { size: controlSize },
  },
  (c) => {
    const v = c.vars({
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
    });
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
          backgroundColor: v.trackBackground.var,
          isolation: 'isolate',
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
            width: v.indicatorWidth.var,
            borderRadius: t.radius.lg.var,
            backgroundColor: v.indicatorBackground.var,
            boxShadow: t.shadow.xs.var,
            pointerEvents: 'none',
            opacity: v.indicatorOpacity.var,
            zIndex: 0,
            transform: `translateX(${v.indicatorX.var})`,
            transition: `transform ${duration.medium} ${easing.emphasized}, width ${duration.medium} ${easing.emphasized}, opacity ${duration.fast} ${easing.standard}`,
            ...atReducedMotion({ transition: 'none' }),
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
            flex: '1 1 auto',
            border: 'none',
            borderRadius: t.radius.lg.var,
            backgroundColor: 'transparent',
            color: v.segmentColor.var,
            fontWeight: t.fontWeight.normal.var,
            boxShadow: 'none',
            transition: `color ${duration.fast} ${easing.standard}, font-weight ${duration.fast} ${easing.standard}`,
            '&:hover': {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            },
            '&:focus-visible': {
              outline: `2px solid ${t.color.border.focus.var}`,
              outlineOffset: '1px',
            },
            '&[data-selected], &[aria-pressed="true"]': {
              color: v.segmentSelectedColor.var,
              fontWeight: t.fontWeight.semibold.var,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
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
  { layer: 'components' },
);

/** Visual props derived from the schema. */
export type SegmentedControlVariantProps = RecipeVariants<typeof segmentedControl>;
