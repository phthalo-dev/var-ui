import { categoryLabels, componentRegistry } from '@/data/components';
import { docsSidebar, playgroundSidebar, themingSidebar } from '@/data/navigation';
import type { DocsSearchItem } from '@var-ui/docs/utils';
import { extractHeadings } from './extract-headings';

export type { DocsSearchItem };

// Guide sources, read raw for their frontmatter and headings.
const guideSources = import.meta.glob<string>(
  '../../content/{docs,theming,playground}/*.{md,mdx}',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
);

type GuideSearchData = { description?: string; keywords: string[]; headings: string[] };

/** Frontmatter `keywords: [a, b]` (inline YAML list). */
function frontmatterKeywords(frontmatter: string): string[] {
  const list = /^keywords:\s*\[(.*)\]\s*$/m.exec(frontmatter)?.[1];
  if (!list) return [];
  return list
    .split(',')
    .map((entry) => entry.trim().replace(/^(['"])(.*)\1$/, '$2'))
    .filter(Boolean);
}

/** h2/h3 text outside fenced code, without inline-code backticks or markdown emphasis. */
export function guideHeadings(source: string): string[] {
  const prose = source.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
  return extractHeadings(prose).map((heading) => heading.text.replace(/[`*_]/g, '').trim());
}

// Description, keywords and h2/h3 headings per guide URL. The description subtitles every result
// with what the page is about (not a raw path); headings let a query find a page by its sections.
const guides = new Map<string, GuideSearchData>(
  Object.entries(guideSources).flatMap(([file, source]): [string, GuideSearchData][] => {
    const [, section = '', slug = ''] = /content\/([^/]+)\/([^/]+)\.mdx?$/.exec(file) ?? [];
    if (!section) return [];
    const url = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
    const frontmatter = /^---\r?\n([\s\S]*?)^---/m.exec(source)?.[1] ?? '';
    const description = /^description:\s*(.+?)\s*$/m.exec(frontmatter)?.[1];
    return [
      [
        url,
        {
          description: description?.replace(/^(['"])(.*)\1$/, '$2'),
          keywords: frontmatterKeywords(frontmatter),
          headings: guideHeadings(source),
        },
      ],
    ];
  }),
);

function sidebarItems(
  items: ReadonlyArray<{ text: string; link: string }>,
  group: string,
  icon: DocsSearchItem['icon'],
): DocsSearchItem[] {
  return items.map((item) => {
    const guide = guides.get(item.link);
    return {
      id: item.link,
      title: item.text,
      meta: guide?.description,
      keywords: [group, ...(guide?.keywords ?? [])],
      headings: guide?.headings.length ? guide.headings : undefined,
      group,
      icon,
    };
  });
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
