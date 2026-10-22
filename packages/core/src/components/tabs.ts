import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { atReducedMotion } from '../theme/conditions';
import { designTokens as t } from '../tokens';
/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const tabsVarDefinitions = {
  railColor: {
    ...atProperty.color,
    value: t.color.border.subtle.var,
  },
  railWidth: {
    ...atProperty.length,
    value: t.borderWidth.thick.var,
  },
  railRadius: {
    ...atProperty.length,
    value: t.borderWidth.thick.var,
  },
  tabColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  tabSelectedColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  tabIndicatorColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  indicatorX: {
    ...atProperty.length,
    value: '0px',
  },
  indicatorWidth: {
    ...atProperty.length,
    value: '0px',
  },
  indicatorOpacity: {
    ...atProperty.number,
    value: '0',
  },
  panelBackground: {
    ...atProperty.color,
    value: t.color.background.subtle.var,
  },
  panelBorder: {
    ...atProperty.color,
    value: t.color.border.default.var,
  },
} as const;

/**
 * Tab panels for in-page content switching. Pair with the React `Tabs` compound
 * or Astro `Tabs` binding. Active tabs use `data-selected` and
 * `aria-selected="true"`; the sliding indicator is the list `::after` pseudo,
 * positioned via `positionTabsIndicator`.
 */
export const tabs = typestyles.recipe({
  name: 'tabs',
  layer: 'components',
  slots: ['root', 'list', 'tab', 'panel'],
  vars: tabsVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'grid',
          gap: t.space[3].var,
        },
        list: {
          position: 'relative',
          display: 'inline-flex',
          gap: t.space[1].var,
          [vars.indicatorX.name]: '0px',
          [vars.indicatorWidth.name]: '0px',
          [vars.indicatorOpacity.name]: '0',
          '&::before': {
            content: '""',
            position: 'absolute',
            insetInlineStart: 0,
            insetInlineEnd: 0,
            bottom: 0,
            height: vars.railWidth.var,
            borderRadius: vars.railRadius.var,
            backgroundColor: vars.railColor.var,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            insetInlineStart: 0,
            width: vars.indicatorWidth.var,
            height: vars.railWidth.var,
            borderRadius: vars.railRadius.var,
            backgroundColor: vars.tabIndicatorColor.var,
            pointerEvents: 'none',
            opacity: vars.indicatorOpacity.var,
            zIndex: 1,
            transform: `translateX(${vars.indicatorX.var})`,
            // transition: indicatorTransition,
            ...atReducedMotion({ transition: 'none' }),
          },
        },
        tab: {
          border: 'none',
          backgroundColor: 'transparent',
          padding: `${t.space[2].var} ${t.space[3].var}`,
          color: vars.tabColor.var,
          cursor: 'pointer',
          fontSize: t.fontSize.md.var,
          '&[data-selected]': {
            color: vars.tabSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
        },
        panel: {
          padding: t.space[3].var,
        },
      },
    };
  },
});
