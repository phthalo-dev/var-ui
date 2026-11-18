import { atProperty, variant, type VariantOptions } from 'typestyles';
import { focusRing } from '../internal/focusRing';
import { transitionOf } from '../internal/motion';
import { inlineScrollFade } from '../internal/scrollFade';
import { typestyles } from '../runtime';
import { atDarkMode, atForcedColors } from '../theme/conditions';
import { forced } from '../internal/forcedColors';
import { designTokens as t } from '../tokens';
/** Internal CSS variables for theme overrides (`vars` on `createDesignTheme`). */
const tabsVarDefinitions = {
  railColor: {
    ...atProperty.color,
    value: t.color.border.default.var,
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
    value: t.color.tone.accent.foreground.var,
  },
  indicatorX: {
    ...atProperty.length,
    value: '0rem',
  },
  indicatorWidth: {
    ...atProperty.length,
    value: '0rem',
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
  /** Trailing-edge fade width for a horizontally scrolling pill row (scroll-driven; 0 at the end). */
  scrollFadeEnd: {
    ...atProperty.length,
    value: '0px',
  },
} as const;

const tabsAppearance = variant.enum(['underline', 'pill'], { default: 'underline' });

/** `tabs` `appearance`: a sliding underline on a rail, or a row of pill buttons. */
export type TabsAppearance = VariantOptions<typeof tabsAppearance>;

const tabsSize = variant.enum(['sm', 'md'], { default: 'md' });

/** `tabs` `size`: `sm` is a compact row for side panels and toolbars. */
export type TabsSize = VariantOptions<typeof tabsSize>;

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
  variants: { appearance: tabsAppearance, size: tabsSize },
  vars: tabsVarDefinitions,
  styles: ({ vars }) => {
    return {
      base: {
        root: {
          display: 'grid',
          // A shrinkable track: wide panel content (code, tables) scrolls inside the panel
          // instead of widening the tabs past their container.
          gridTemplateColumns: 'minmax(0, 1fr)',
          minWidth: 0,
          gap: t.space.sm.var,
        },
        // Underline tabs: a hairline rail the full width of the list, and a 2px accent indicator
        // that slides to the selected tab. The row scrolls sideways (with a trailing fade) when it
        // is wider than its container.
        list: {
          position: 'relative',
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          minWidth: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          // Room for focus rings inside the scroll container's clip box.
          paddingBlockStart: '0.1875rem',
          paddingInline: '0.1875rem',
          marginInline: '-0.1875rem',
          ...inlineScrollFade('var-ui-tabs-underline-fade', { end: vars.scrollFadeEnd }),
          [vars.indicatorX.name]: '0rem',
          [vars.indicatorWidth.name]: '0rem',
          [vars.indicatorOpacity.name]: '0',
          // The rail spans the content box (inside the focus-ring padding), so it ends flush
          // with the container edge rather than 3px past it.
          '&::before': {
            content: '""',
            position: 'absolute',
            insetInlineStart: '0.1875rem',
            insetInlineEnd: '0.1875rem',
            bottom: 0,
            height: t.borderWidth.default.var,
            backgroundColor: vars.railColor.var,
            pointerEvents: 'none',
            ...atForcedColors({ backgroundColor: 'GrayText' }),
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            insetInlineStart: 0,
            width: vars.indicatorWidth.var,
            height: vars.railWidth.var,
            borderRadius: `${vars.railRadius.var} ${vars.railRadius.var} 0 0`,
            backgroundColor: vars.tabIndicatorColor.var,
            pointerEvents: 'none',
            opacity: vars.indicatorOpacity.var,
            zIndex: t.zIndex.raised.var,
            transform: `translateX(${vars.indicatorX.var})`,
            transition: `${transitionOf('transform')}, ${transitionOf('width')}`,
            ...atForcedColors(forced.fill),
          },
        },
        tab: {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: t.space.xs.var,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          border: 'none',
          backgroundColor: 'transparent',
          minHeight: '2.75rem',
          paddingBlock: 0,
          paddingInline: t.space.sm.var,
          color: vars.tabColor.var,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: t.fontSize.md.var,
          fontWeight: t.fontWeight.medium.var,
          borderRadius: `${t.radius.md.var} ${t.radius.md.var} 0 0`,
          transition: transitionOf(['color', 'background-color', 'box-shadow'], 'fast'),
          '& svg': {
            width: '1rem',
            height: '1rem',
            flexShrink: 0,
            opacity: 0.8,
          },
          // Hover: text firms up and a neutral underline previews the move.
          '&:hover:not([data-selected])': {
            color: vars.tabSelectedColor.var,
            boxShadow: `inset 0 calc(-1 * ${vars.railWidth.var}) 0 ${t.color.border.strong.var}`,
          },
          '&:focus-visible': {
            ...focusRing,
            outlineOffset: '-0.125rem',
          },
          '&[data-selected]': {
            color: vars.tabSelectedColor.var,
          },
          '&[data-selected] svg': {
            opacity: 1,
            color: vars.tabIndicatorColor.var,
          },
        },
        panel: {
          minWidth: 0,
          // Block padding only: panel content lines up with the tab list's edges.
          paddingBlock: t.space.sm.var,
          paddingInline: 0,
        },
      },
      variants: {
        size: {
          sm: {
            tab: {
              minHeight: '2.25rem',
              paddingInline: t.space.xs.var,
              fontSize: t.fontSize.sm.var,
            },
          },
          md: {},
        },
        appearance: {
          underline: {},
          // Pill tabs: a row of bordered buttons; the selected one is an inverse (ink) fill.
          // Used for page-level view switches (Documentation / Props / Styles).
          pill: {
            // One row that scrolls sideways on narrow screens. The 4px inset keeps focus rings
            // inside the scroll container's clip box.
            list: {
              flexWrap: 'nowrap',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              scrollSnapType: 'x proximity',
              // While more tabs sit off an edge, that edge fades out (scroll-driven).
              ...inlineScrollFade('var-ui-tabs-scroll-fade', { end: vars.scrollFadeEnd }),
              maxWidth: '100%',
              padding: '0.25rem',
              margin: '-0.25rem',
              gap: t.space.xs.var,
              '&::before': { display: 'none' },
              '&::after': { display: 'none' },
            },
            tab: {
              flexShrink: 0,
              scrollSnapAlign: 'start',
              whiteSpace: 'nowrap',
              minHeight: 0,
              height: t.size.control.md.var,
              paddingBlock: 0,
              paddingInline: t.space.md.var,
              borderRadius: t.radius.md.var,
              border: `${t.borderWidth.default.var} solid ${t.color.border.default.var}`,
              backgroundColor: t.color.background.surface.var,
              fontSize: t.fontSize.md.var,
              fontWeight: t.fontWeight.medium.var,
              '&:hover:not([data-selected])': {
                boxShadow: 'none',
                backgroundColor: t.color.background.subtle.var,
              },
              // Selected: ink fill in light mode; in dark mode a raised surface with an accent
              // edge, so the active tab never becomes the brightest thing on screen.
              '&[data-selected]': {
                fontWeight: t.fontWeight.semibold.var,
                color: t.color.background.surface.var,
                backgroundColor: t.color.text.primary.var,
                borderColor: t.color.text.primary.var,
                ...atDarkMode({
                  color: t.color.text.primary.var,
                  backgroundColor: t.color.background.secondary.var,
                  borderColor: `color-mix(in oklab, ${t.color.tone.accent.foreground.var} 55%, transparent)`,
                }),
                ...atForcedColors(forced.selected),
              },
            },
          },
        },
      },
    };
  },
});
