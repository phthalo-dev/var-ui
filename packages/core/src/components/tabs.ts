import { typestyles } from '../runtime';
import { atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';
import { themeableVars } from './themeableVars';

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
export const tabsVarDefinitions = {
  railColor: {
    value: t.color.border.subtle.var,
    syntax: '<color>' as const,
  },
  railWidth: {
    value: t.borderWidth.thick.var,
    syntax: '<length>' as const,
  },
  railRadius: {
    value: t.borderWidth.thick.var,
    syntax: '<length>' as const,
  },
  tabColor: {
    value: t.color.text.secondary.var,
    syntax: '<color>' as const,
  },
  tabSelectedColor: {
    value: t.color.text.primary.var,
    syntax: '<color>' as const,
  },
  tabIndicatorColor: {
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
  panelBackground: {
    value: t.color.background.subtle.var,
    syntax: '<color>' as const,
  },
  panelBorder: {
    value: t.color.border.default.var,
    syntax: '<color>' as const,
  },
} as const;

/**
 * Tab panels for in-page content switching. Pair with the React `Tabs` compound
 * or Astro `Tabs` binding. Active tabs use `data-selected` and
 * `aria-selected="true"`; the sliding indicator is the list `::after` pseudo,
 * positioned via `positionTabsIndicator`.
 */
const tabsRecipe = typestyles.recipe(
  'tabs',
  (c) => {
    const v = c.vars(tabsVarDefinitions);

    // const indicatorTransition = `transform ${t.duration.medium.var} ${t.easing.standard.var}, width ${t.duration.fast.var} ${t.easing.standard.var}, opacity ${t.duration.fast.var} ${t.easing.standard.var}`;

    return {
      vars: tabsVarDefinitions,
      slots: ['root', 'list', 'tab', 'panel'],
      root: {
        display: 'grid',
        gap: t.space[3].var,
      },
      list: {
        position: 'relative',
        display: 'inline-flex',
        gap: t.space[1].var,
        [v.indicatorX.name]: '0px',
        [v.indicatorWidth.name]: '0px',
        [v.indicatorOpacity.name]: '0',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInlineStart: 0,
          insetInlineEnd: 0,
          bottom: 0,
          height: v.railWidth.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.railColor.var,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          insetInlineStart: 0,
          width: v.indicatorWidth.var,
          height: v.railWidth.var,
          borderRadius: v.railRadius.var,
          backgroundColor: v.tabIndicatorColor.var,
          pointerEvents: 'none',
          opacity: v.indicatorOpacity.var,
          zIndex: 1,
          transform: `translateX(${v.indicatorX.var})`,
          // transition: indicatorTransition,
          ...atReducedMotion({ transition: 'none' }),
        },
      },
      tab: {
        border: 'none',
        backgroundColor: 'transparent',
        padding: `${t.space[2].var} ${t.space[3].var}`,
        color: v.tabColor.var,
        cursor: 'pointer',
        fontSize: t.fontSize.md.var,
        '&[data-selected]': {
          color: v.tabSelectedColor.var,
          fontWeight: t.fontWeight.semibold.var,
        },
      },
      panel: {
        padding: t.space[3].var,
      },
    };
  },
  { layer: 'components' },
);

export const tabs = themeableVars(tabsRecipe, tabsVarDefinitions);
