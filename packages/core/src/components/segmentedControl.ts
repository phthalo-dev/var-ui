import { typestyles } from '../runtime';
import { atDarkMode, atReducedMotion } from '../theme/conditions';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { designTokens as t } from '../tokens';
import { controlSizeVariants, segmentedControlSize } from './controlSize';
import { themeableVars } from './themeableVars';

const indicatorTransition = `transform ${duration.medium} ${easing.emphasized}, width ${duration.medium} ${easing.emphasized}, opacity ${duration.fast} ${easing.standard}`;

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
export const segmentedControlVarDefinitions = {
  trackBackground: {
    value: t.color.border.subtle.var,
    syntax: '<color>' as const,
  },
  indicatorBackground: {
    value: t.color.background.surface.var,
    syntax: '<color>' as const,
  },
  segmentColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  segmentSelectedColor: {
    value: t.color.text.primary.var,
    syntax: '<color>' as const,
  },
  indicatorX: {
    value: '0px',
    syntax: '<length>' as const,
  },
  indicatorWidth: {
    value: '0px',
    syntax: '<length>' as const,
  },
  indicatorOpacity: {
    value: '0',
    syntax: '<number>' as const,
  },
} as const;

/**
 * Segmented toggle group with a sliding surface indicator behind the active segment.
 */
const segmentedControlRecipe = typestyles.recipe(
  'segmented-control',
  (c) => {
    const v = c.vars(segmentedControlVarDefinitions);
    return {
      vars: segmentedControlVarDefinitions,
      slots: ['root'],
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
            transition: indicatorTransition,
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
      defaultVariants: { size: 'md' },
    };
  },
  { layer: 'components' },
);

export const segmentedControl = themeableVars(
  segmentedControlRecipe,
  segmentedControlVarDefinitions,
);
