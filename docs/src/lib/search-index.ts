import { categoryLabels, componentRegistry } from '@/data/components';
import { docsSidebar, playgroundSidebar, themingSidebar } from '@/data/navigation';
import type { DocsSearchItem } from '@var-ui/docs/utils';

export type { DocsSearchItem };

function sidebarItems(
  items: ReadonlyArray<{ text: string; link: string }>,
  group: string,
  icon: DocsSearchItem['icon'],
): DocsSearchItem[] {
  // The group heading already says the section; the subtitle shows where the page lives.
  return items.map((item) => ({
    id: item.link,
    title: item.text,
    meta: item.link,
    keywords: [group],
    group,
    icon,
  }));
}

/** Flat CommandPalette index from docs/theming sidebars and the component registry. */
export function buildDocsSearchIndex(): DocsSearchItem[] {
  const docs = sidebarItems(docsSidebar, 'Docs', 'page');
  const theming = sidebarItems(themingSidebar, 'Theming', 'palette');
  const playground = sidebarItems(playgroundSidebar, 'Playground', 'wrench');
  const components = componentRegistry.map((entry): DocsSearchItem => ({
    id: `/components/${entry.slug}`,
    title: entry.name,
    meta: entry.description,
    group: 'Components',
    icon: 'component',
    keywords: [entry.slug, entry.category, categoryLabels[entry.category]],
  }));

  return [...docs, ...theming, ...playground, ...components];
}
