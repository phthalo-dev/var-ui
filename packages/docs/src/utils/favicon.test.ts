import { describe, expect, it } from 'vite-plus/test';
import { faviconLink } from './favicon';

describe('faviconLink', () => {
  it('returns null when no favicon is configured', () => {
    expect(faviconLink(undefined)).toBeNull();
  });

  it('prefixes root-relative paths with the Astro base and infers the type', () => {
    expect(faviconLink('/favicon.svg', '/docs/')).toEqual({
      href: '/docs/favicon.svg',
      type: 'image/svg+xml',
    });
    expect(faviconLink('/favicon.png')).toEqual({ href: '/favicon.png', type: 'image/png' });
  });

  it('leaves absolute URLs alone', () => {
    expect(faviconLink('https://cdn.example.com/icon.ico?v=2', '/docs/')).toEqual({
      href: 'https://cdn.example.com/icon.ico?v=2',
      type: 'image/x-icon',
    });
  });
});
