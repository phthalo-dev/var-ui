import { describe, expect, it } from 'vite-plus/test';
import { commandMetaSnippet, rankCommandItems } from '@var-ui/core/shared/commandSearch';
import { buildDocsSearchIndex, guideHeadings } from './search-index';

describe('buildDocsSearchIndex', () => {
  it('includes getting started, theming, and at least one component', () => {
    const items = buildDocsSearchIndex();
    expect(items.some((i) => i.id === '/docs/getting-started')).toBe(true);
    expect(items.some((i) => i.id === '/docs/overlay-lifecycle')).toBe(true);
    expect(items.some((i) => i.id.startsWith('/components/'))).toBe(true);
    expect(items.some((i) => i.id.startsWith('/theming/'))).toBe(true);
  });

  it('subtitles guide pages with their frontmatter description, not a raw path', () => {
    const items = buildDocsSearchIndex();
    const guides = items.filter((i) => !i.id.startsWith('/components/'));
    expect(guides.length).toBeGreaterThan(0);
    for (const item of guides) {
      expect(item.meta, item.id).toBeTruthy();
      expect(item.meta?.startsWith('/'), item.id).toBe(false);
    }
  });
});

describe('buildDocsSearchIndex headings and keywords', () => {
  const items = buildDocsSearchIndex();
  const top = (query: string) => rankCommandItems(items, query)[0];

  it('indexes guide h2/h3 headings, without code fences or inline-code ticks', () => {
    const cssVariables = items.find((item) => item.id === '/theming/css-variables');
    expect(cssVariables?.headings).toContain('Light and dark mode');
    expect(guideHeadings('## `Button` props\n```md\n## not a heading\n```\n### Next')).toEqual([
      'Button props',
      'Next',
    ]);
  });

  it('finds a page by a heading and shows that heading as the subtitle', () => {
    const hit = rankCommandItems(items, 'dark mode').find((item) => item.headings);
    expect(hit?.id).toMatch(/^\/theming\//);
    expect(commandMetaSnippet(hit!, 'dark mode')).toMatch(/dark mode/i);
    expect(rankCommandItems(items, 'providers').map((item) => item.id)).toContain(
      '/docs/getting-started',
    );
  });

  it('finds a page by its frontmatter keywords ("accent" → Colors)', () => {
    expect(top('accent')?.id).toBe('/theming/colors');
  });
});
