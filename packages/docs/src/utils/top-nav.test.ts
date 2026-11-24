import { describe, expect, it } from 'vite-plus/test';
import { selectedTopNavMatch, topNavLinkAttributes } from './top-nav';

describe('selectedTopNavMatch', () => {
  const matches = ['/docs', '/docs/changelog', undefined, '/components'];

  it('picks the longest prefix', () => {
    expect(selectedTopNavMatch(matches, '/docs/changelog/0-14/')).toBe('/docs/changelog');
    expect(selectedTopNavMatch(matches, '/docs/install/')).toBe('/docs');
  });

  it('returns undefined when nothing matches, and ignores empty matches', () => {
    expect(selectedTopNavMatch(matches, '/')).toBeUndefined();
    expect(selectedTopNavMatch(['', undefined], '/docs')).toBeUndefined();
  });
});

describe('topNavLinkAttributes', () => {
  it('opens external items in a new tab', () => {
    expect(
      topNavLinkAttributes({ text: 'GitHub', link: 'https://github.com', external: true }),
    ).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    expect(topNavLinkAttributes({ text: 'Docs', link: '/docs', match: '/docs' })).toEqual({});
  });
});
