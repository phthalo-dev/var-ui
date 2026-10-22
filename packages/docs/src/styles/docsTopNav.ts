import { designTokens as t, breakpoint, typestyles } from '@var-ui/core';

const belowXl = breakpoint('xl', 'max');
const belowMd = breakpoint('md', 'max');
const belowSm = breakpoint('sm', 'max');

const toolsCluster = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: t.space[3].var,
  minWidth: 0,
  [belowXl]: {
    gap: t.space[2].var,
  },
  [belowSm]: {
    gap: t.space[1].var,
  },
} as const;

/**
 * Docs kit header chrome: one nowrap row. Section links hide below `md`
 * (hamburger + MobileNav), search compact is owned by `searchInput`, and
 * optional toolbar extras hide below `sm`.
 */
export const docsTopNav = typestyles.recipe({
  name: 'docs-top-nav',
  layer: 'components',
  slots: ['root', 'tools', 'toolsPersist', 'toolbar', 'toolbarExtra', 'mobileNavBody'],
  styles: () => ({
    base: {
      root: {
        minWidth: 0,
        flexWrap: 'nowrap',
        '& [data-var-ui-top-nav-start]': {
          flexShrink: 0,
          [belowMd]: {
            display: 'none',
          },
        },
        '& [data-var-ui-top-nav-start] a, & [data-var-ui-top-nav-start] button': {
          [belowXl]: {
            paddingInline: t.space[2].var,
          },
        },
        '& [data-var-ui-mobile-nav-toggle]': {
          display: 'none',
          flexShrink: 0,
          [belowMd]: {
            display: 'inline-flex',
          },
        },
        '& .docs-search': {
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
        },
      },
      tools: toolsCluster,
      toolsPersist: {
        ...toolsCluster,
        flexShrink: 0,
      },
      toolbar: {
        ...toolsCluster,
        flexShrink: 0,
        [belowSm]: {
          gap: t.space[1].var,
          '& [role="group"] button': {
            paddingInline: t.space[1].var,
          },
        },
      },
      toolbarExtra: {
        [belowSm]: {
          display: 'none',
        },
      },
      mobileNavBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[2].var,
        padding: t.space[3].var,
      },
    },
  }),
});
