import { designTokens as t, focusRing, typestyles } from '@var-ui/core';

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
    'mobileNavBrand',
    'mobileNavBody',
    'mobileNavPrimary',
    'mobileNavSection',
    'mobileNavSectionTitle',
  ],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        flexWrap: 'nowrap',
        // One 24px gap after the brand at every width (the only gap the bar shows: `end`
        // pushes itself right with an auto margin).
        gap: t.space.lg.var,
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
          // Collapsed to an icon button: one even 8px rhythm with its icon neighbours.
          [belowMd]: {
            marginInlineEnd: 0,
          },
        },
        '& .docs-search [data-var-ui-search-input]': {
          width: '15rem',
          // Tablet widths: the full nav, switcher and appearance controls share the bar.
          [belowLg]: {
            width: '10rem',
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
      // Drawer header: the brand lockup, linked home.
      mobileNavBrand: {
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: t.size.control.md.var,
        color: 'inherit',
        textDecoration: 'none',
        borderRadius: t.radius.sm.var,
        outline: 'none',
        '&:focus-visible': focusRing,
      },
      // Rows inset 4px (`xxs`) plus their own 12px padding: the list text lands on the drawer's
      // 16px header/footer inset, so brand, links and preferences share one left edge.
      mobileNavBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space.md.var,
        paddingBlock: t.space.sm.var,
        paddingInline: t.space.xxs.var,
      },
      // Site sections (Docs, Components, …): a hair heavier than the page tree, with a divider
      // before it (`data-divided`) so the two lists do not run together.
      mobileNavPrimary: {
        display: 'flex',
        flexDirection: 'column',
        '& a': { fontWeight: t.fontWeight.medium.var },
        // Full-bleed like the drawer's header and footer rules: step out over the body's 4px inset
        // and pad back in, so the links stay on the shared left edge.
        '&[data-divided]': {
          marginInline: `calc(-1 * ${t.space.xxs.var})`,
          paddingInline: t.space.xxs.var,
          paddingBlockEnd: t.space.md.var,
          borderBlockEnd: `0.0625rem solid ${t.color.border.subtle.var}`,
        },
      },
      // Preferences, pinned in the drawer footer (`MobileNav` draws the top border). Controls
      // stretch to the footer's width.
      mobileNavSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: t.space.xs.var,
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
