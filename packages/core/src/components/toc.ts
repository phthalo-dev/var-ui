import { atProperty } from 'typestyles';
import { typestyles } from '../runtime';
import { atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { transitionOf } from '../internal/motion';
import { designTokens as t } from '../tokens';
import { focusRing } from '../internal/focusRing';
const listIndent = t.space.sm.var;
const nestedIndent = t.space.xs.var;
const indicatorTransition = `${transitionOf('transform')}, ${transitionOf(['height', 'opacity'], 'fast')}`;

/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const tocVarDefinitions = {
  stickyTop: {
    ...atProperty.length,
    value: t.space.lg.var,
  },
  stickyMaxHeightOffset: {
    ...atProperty.length,
    value: t.space.xl.var,
  },
  titleColor: {
    ...atProperty.color,
    value: t.color.text.primary.var,
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
    value: '0rem',
  },
  indicatorHeight: {
    ...atProperty.length,
    value: '0rem',
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
    value: t.color.tone.accent.foreground.var,
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
          paddingBlock: `${t.space.xl.var} ${t.space.xxxl.var}`,
          paddingInlineStart: t.space.md.var,
          paddingInlineEnd: t.space.lg.var,
          maxHeight: `calc(100dvh - ${vars.stickyTop.var} - ${vars.stickyMaxHeightOffset.var})`,
          overflow: 'auto',
          // No viewport breakpoint of its own: the layout that holds the rail decides when it
          // shows (an `AppShell` aside below its mobile breakpoint, a docs frame by its width).
        },
        title: {
          margin: `0 0 ${t.space.sm.var}`,
          fontSize: t.fontSize.xs.var,
          fontWeight: t.fontWeight.semibold.var,
          letterSpacing: t.letterSpacing.caps.var,
          textTransform: 'uppercase',
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
          [vars.indicatorY.name]: '0rem',
          [vars.indicatorHeight.name]: '0rem',
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
            ...atForcedColors({ backgroundColor: 'GrayText' }),
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
            zIndex: t.zIndex.raised.var,
            transform: `translateY(${vars.indicatorY.var})`,
            transition: indicatorTransition,
            ...atForcedColors(forced.fill),
          },
        },
        item: {
          '&[data-nested]': {
            paddingInlineStart: nestedIndent,
          },
        },
        link: {
          display: 'block',
          paddingBlock: '0.3125rem',
          fontSize: t.fontSize.sm.var,
          lineHeight: '1.125rem',
          fontWeight: t.fontWeight.normal.var,
          color: vars.linkColor.var,
          textDecoration: 'none',
          transition: t.transition.colorShift.var,
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
