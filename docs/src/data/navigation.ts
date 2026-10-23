import { categoryLabels, componentRegistry, type ComponentCategory } from './components';
import type { SidebarItem, SidebarSection } from '@var-ui/docs/utils';

export type { SidebarItem, SidebarSection };

export const githubUrl = 'https://github.com/phthalo-dev/var-ui';

export const topNav = [
  { text: 'Docs', link: '/docs/getting-started', match: '/docs' },
  { text: 'Components', link: '/components', match: '/components' },
  { text: 'Theming', link: '/theming', match: '/theming' },
  { text: 'Playground', link: '/playground', match: '/playground' },
] as const;

export const docsSidebarSections: readonly SidebarSection[] = [
  {
    title: 'Guides',
    items: [
      { text: 'Getting started', link: '/docs/getting-started' },
      { text: 'Installation', link: '/docs/installation' },
      { text: 'Overlay lifecycle', link: '/docs/overlay-lifecycle' },
    ],
  },
];

export const docsSidebar = docsSidebarSections.flatMap((section) => section.items);

export const themingSidebarSections: readonly SidebarSection[] = [
  {
    title: 'Theming',
    items: [
      { text: 'Overview', link: '/theming' },
      { text: 'Customize', link: '/theming/customize' },
      { text: 'Themes', link: '/theming/themes' },
      { text: 'Design tokens', link: '/theming/tokens' },
      { text: 'CSS variables', link: '/theming/css-variables' },
      { text: 'Colors', link: '/theming/colors' },
      { text: 'Shadows', link: '/theming/shadows' },
    ],
  },
] as const;

export const playgroundSidebarSections: readonly SidebarSection[] = [
  {
    title: 'Playground',
    items: [{ text: 'Theme editor', link: '/playground' }],
  },
] as const;

const componentCategoryOrder = [
  'action',
  'data-input',
  'feedback',
  'overlay',
  'layout',
  'content',
  'container',
  'chat',
] as const satisfies readonly ComponentCategory[];

export const componentSidebarSections: readonly SidebarSection[] = componentCategoryOrder
  .map((category) => ({
    title: categoryLabels[category],
    items: componentRegistry
      .filter((entry) => entry.category === category)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({
        text: entry.name,
        link: `/components/${entry.slug}`,
      })),
  }))
  .filter((section) => section.items.length > 0);

export const themingSidebar = themingSidebarSections[0]?.items ?? [];

export const playgroundSidebar = playgroundSidebarSections.flatMap((section) => section.items);

export const sidebar = {
  '/components': componentSidebarSections,
  '/docs': docsSidebarSections,
  '/theming': themingSidebarSections,
  '/playground': playgroundSidebarSections,
} as const;
