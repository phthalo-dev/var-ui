import { describe, expect, it } from 'vite-plus/test';
import { buildDocsSearchIndex } from './search-index';

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
