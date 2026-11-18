import { categoryLabels, componentRegistry, type ComponentCategory } from '@/data/components';
import { docsSidebar, playgroundSidebar, themingSidebar } from '@/data/navigation';
import type { DocsSearchItem } from '@var-ui/docs/utils';

export type { DocsSearchItem };

// Page descriptions from guide frontmatter, keyed by URL, so every result has the same kind of
// subtitle (what the page is about) rather than some showing descriptions and others raw paths.
const guideSources = import.meta.glob<string>(
  '../../content/{docs,theming,playground}/*.{md,mdx}',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
);

const descriptions = new Map<string, string>(
  Object.entries(guideSources).flatMap(([file, source]) => {
    const match = /^---\r?\n[\s\S]*?^description:\s*(.+?)\s*$[\s\S]*?^---/m.exec(source);
    if (!match?.[1]) return [];
    const [, section = '', slug = ''] = /content\/([^/]+)\/([^/]+)\.mdx?$/.exec(file) ?? [];
    const url = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
    return [[url, match[1].replace(/^(['"])(.*)\1$/, '$2')]];
  }),
);

function sidebarItems(
  items: ReadonlyArray<{ text: string; link: string }>,
  group: string,
  icon: DocsSearchItem['icon'],
): DocsSearchItem[] {
  return items.map((item) => ({
    id: item.link,
    title: item.text,
    meta: descriptions.get(item.link),
    keywords: [group],
    group,
    icon,
  }));
}

/** One glyph per component category, so the palette's icon column tells result types apart. */
const categoryIcons = {
  action: 'pointer',
  'data-input': 'textInput',
  feedback: 'bell',
  overlay: 'layers',
  layout: 'layout',
  content: 'text',
  container: 'component',
  chat: 'message',
} as const satisfies Record<ComponentCategory, DocsSearchItem['icon']>;

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
    icon: categoryIcons[entry.category],
    keywords: [entry.slug, entry.category, categoryLabels[entry.category]],
  }));

  return [...docs, ...theming, ...playground, ...components];
}
