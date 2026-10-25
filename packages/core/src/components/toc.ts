import { atProperty } from 'typestyles';
import { breakpoint, typestyles } from '../runtime';
import { atReducedMotion } from '../theme/conditions';
import { duration } from '../tokens/defaults/duration';
import { easing } from '../tokens/defaults/easing';
import { transition } from '../tokens/defaults/transition';
import { designTokens as t } from '../tokens';
import { focusRing } from './focusRing';
const belowXl = breakpoint('xl', 'max');
const listIndent = t.space[3].var;
const nestedIndent = t.space[2].var;
const indicatorTransition = `transform ${duration.medium} ${easing.standard}, height ${duration.fast} ${easing.standard}, opacity ${duration.fast} ${easing.standard}`;

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const tocVarDefinitions = {
  stickyTop: {
    ...atProperty.length,
    value: t.space[5].var,
  },
  stickyMaxHeightOffset: {
    ...atProperty.length,
    value: t.space[6].var,
  },
  titleColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
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
  indicatorY: {
    ...atProperty.length,
    value: '0px',
  },
  indicatorHeight: {
    ...atProperty.length,
    value: '0px',
  },
  indicatorOpacity: {
    ...atProperty.number,
    value: '0',
  },
  linkColor: {
    ...atProperty.color,
    value: t.color.text.secondary.var,
  },
  linkHoverColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  linkSelectedColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
  linkSelectedIndicator: {
    ...atProperty.color,
    value: t.color.text.primary.var,
  },
} as const;

/**
 * In-page table of contents for long-form docs. Pair with the React `Toc`
 * compound or Astro `Toc` / `TocItem` bindings. Active items use
 * `data-selected` on links; nested `h3` rows use `data-nested` on items.
 * The active-row indicator is the list `::after` pseudo, positioned via
 * `positionTocIndicator`.
 */
export const toc = typestyles.recipe({
  name: 'toc',
  layer: 'components',
  slots: ['root', 'title', 'list', 'item', 'link'],
  vars: tocVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          position: 'sticky',
          top: vars.stickyTop.var,
          padding: `${t.space[6].var} ${t.space[5].var} ${t.space[8].var} ${t.space[4].var}`,
          maxHeight: `calc(100dvh - ${vars.stickyTop.var} - ${vars.stickyMaxHeightOffset.var})`,
          overflow: 'auto',
          [belowXl]: {
            display: 'none',
          },
        },
        title: {
          margin: `0 0 ${t.space[4].var}`,
          fontSize: t.fontSize.sm.var,
          fontWeight: t.fontWeight.medium.var,
          color: vars.titleColor.var,
        },
        list: {
          position: 'relative',
          margin: 0,
          padding: 0,
          paddingInlineStart: listIndent,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          [vars.indicatorY.name]: '0px',
          [vars.indicatorHeight.name]: '0px',
          [vars.indicatorOpacity.name]: '0',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            insetInlineStart: 0,
            width: vars.railWidth.var,
            borderRadius: vars.railRadius.var,
            backgroundColor: vars.railColor.var,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            insetInlineStart: 0,
            width: vars.railWidth.var,
            height: vars.indicatorHeight.var,
            borderRadius: vars.railRadius.var,
            backgroundColor: vars.linkSelectedIndicator.var,
            pointerEvents: 'none',
            opacity: vars.indicatorOpacity.var,
            zIndex: 1,
            transform: `translateY(${vars.indicatorY.var})`,
            transition: indicatorTransition,
            ...atReducedMotion({ transition: 'none' }),
          },
        },
        item: {
          '&[data-nested]': {
            paddingInlineStart: nestedIndent,
          },
        },
        link: {
          display: 'block',
          paddingBlock: t.space[1].var,
          fontSize: t.fontSize.sm.var,
          lineHeight: t.lineHeight.normal.var,
          fontWeight: t.fontWeight.normal.var,
          color: vars.linkColor.var,
          textDecoration: 'none',
          transition: transition.colorShift,
          '&:hover': {
            color: vars.linkHoverColor.var,
          },
          '&:focus-visible': {
            ...focusRing,
          },
          '&[data-selected]': {
            color: vars.linkSelectedColor.var,
            fontWeight: t.fontWeight.semibold.var,
          },
        },
      },
    };
  },
});
