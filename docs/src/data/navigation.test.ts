import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from './components';
import {
  componentSidebarSections,
  docsSidebar,
  playgroundSidebar,
  playgroundSidebarSections,
  themingSidebar,
  themingSidebarSections,
  topNav,
} from './navigation';

describe('navigation', () => {
  it('exposes top-nav destinations', () => {
    expect(topNav.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/components',
      '/theming',
      '/playground',
    ]);
  });

  it('lists all component registry entries in grouped sidebar sections', () => {
    expect(docsSidebar.map((item) => item.link)).toEqual([
      '/docs/getting-started',
      '/docs/installation',
      '/docs/overlay-lifecycle',
    ]);
    const flatItems = componentSidebarSections.flatMap((section) => section.items);
    const expectedItems = componentRegistry.map((entry) => ({
      text: entry.name,
      link: `/components/${entry.slug}`,
    }));
    expect(flatItems).toEqual(expect.arrayContaining(expectedItems));
    expect(flatItems).toHaveLength(expectedItems.length);
  });

  it('alphabetizes component sidebar items within each group', () => {
    for (const section of componentSidebarSections) {
      const names = section.items.map((item) => item.text);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });

  it('lists theming guide pages', () => {
    expect(themingSidebarSections[0]?.items.map((item) => item.link)).toEqual([
      '/theming',
      '/theming/customize',
      '/theming/themes',
      '/theming/tokens',
      '/theming/css-variables',
      '/theming/colors',
      '/theming/shadows',
    ]);
    expect(themingSidebar.map((item) => item.link)).toEqual([
      '/theming',
      '/theming/customize',
      '/theming/themes',
      '/theming/tokens',
      '/theming/css-variables',
      '/theming/colors',
      '/theming/shadows',
    ]);
  });

  it('lists playground editor pages', () => {
    expect(playgroundSidebarSections[0]?.items.map((item) => item.link)).toEqual(['/playground']);
    expect(playgroundSidebar.map((item) => item.link)).toEqual(['/playground']);
  });
});
