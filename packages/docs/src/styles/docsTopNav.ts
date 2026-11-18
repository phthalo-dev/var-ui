import { designTokens as t, typestyles } from '@var-ui/core';

const belowLg = typestyles.breakpoint('lg', 'max');
const belowMd = typestyles.breakpoint('md', 'max');
const belowSm = typestyles.breakpoint('sm', 'max');

/**
 * Docs kit header chrome (`DocsTopBar`): brand, section links, then one calm cluster on the
 * right: search, optional tools (e.g. a framework switcher), a hairline, the appearance menu.
 *
 * Responsive plan:
 * - `>= md`: everything, full search field (narrower below `lg`).
 * - `sm`–`md`: the search collapses to its icon (`SearchInput` default `collapseBelow="md"`),
 *   tools move into the mobile drawer and the hamburger appears (docs sidebars live in the
 *   drawer below `md`). Section links stay visible.
 * - `< sm`: section links move into the drawer too.
 */
export const docsTopNav = typestyles.recipe({
  name: 'docs-top-nav',
  layer: 'components',
  slots: [
    'root',
    'tools',
    'toolbarExtra',
    'divider',
    'mobileNavBody',
    'mobileNavSection',
    'mobileNavSectionTitle',
  ],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        flexWrap: 'nowrap',
        gap: t.space.lg.var,
        [belowLg]: {
          gap: t.space.md.var,
        },
        '& [data-var-ui-top-nav-heading]': {
          // Optical: the wordmark's bracket sits on the same centre line as the nav labels.
          paddingInlineEnd: t.space.xs.var,
        },
        '& [data-var-ui-top-nav-start]': {
          flexShrink: 0,
          [belowSm]: {
            display: 'none',
          },
        },
        '& [data-var-ui-mobile-nav-toggle]': {
          display: 'none',
          flexShrink: 0,
          [belowMd]: {
            display: 'inline-flex',
          },
        },
      },
      tools: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: t.space.xs.var,
        minWidth: 0,
        '& .docs-search': {
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          marginInlineEnd: t.space.xxs.var,
        },
        '& .docs-search [data-var-ui-search-input]': {
          width: '15rem',
          [belowLg]: {
            width: '12rem',
          },
          [belowMd]: {
            width: 'auto',
          },
        },
      },
      toolbarExtra: {
        display: 'inline-flex',
        alignItems: 'center',
        [belowMd]: {
          display: 'none',
        },
      },
      // Hairline between content controls (search, tools) and preferences.
      divider: {
        alignSelf: 'center',
        width: '0.0625rem',
        height: t.space.md.var,
        marginInline: t.space.xxs.var,
        backgroundColor: t.color.border.default.var,
        [belowMd]: {
          display: 'none',
        },
      },
      mobileNavBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
        padding: t.space.sm.var,
      },
      mobileNavSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.space.xs.var,
        paddingBlockStart: t.space.md.var,
        paddingInline: t.space.xs.var,
        borderBlockStart: `0.0625rem solid ${t.color.border.subtle.var}`,
      },
      mobileNavSectionTitle: {
        margin: 0,
        fontSize: t.fontSize.xs.var,
        fontWeight: t.fontWeight.semibold.var,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: t.color.text.secondary.var,
      },
    },
  }),
});
