import { describe, expect, it } from 'vite-plus/test';
import { initDocsTopBar, syncDocsTopBarSelection } from './docsTopBarClient';

function mountBar(): HTMLElement {
  document.body.innerHTML = `
    <nav data-docs-top-bar>
      <a href="/docs" data-docs-top-nav-match="/docs" data-selected aria-current="page">Docs</a>
      <a href="/components" data-docs-top-nav-match="/components">Components</a>
    </nav>
  `;
  return document.querySelector('[data-docs-top-bar]') as HTMLElement;
}

describe('syncDocsTopBarSelection', () => {
  it('moves the selection to the link matching the new path', () => {
    const bar = mountBar();
    syncDocsTopBarSelection('/components/button/');

    const [docs, components] = Array.from(bar.querySelectorAll('a'));
    expect(components.hasAttribute('data-selected')).toBe(true);
    expect(components.getAttribute('aria-current')).toBe('page');
    expect(docs.hasAttribute('data-selected')).toBe(false);
    expect(docs.hasAttribute('aria-current')).toBe(false);
  });

  it('clears the selection on a page no link matches (e.g. the homepage)', () => {
    const bar = mountBar();
    syncDocsTopBarSelection('/');
    expect(bar.querySelectorAll('[data-selected]')).toHaveLength(0);
  });
});

describe('initDocsTopBar', () => {
  it('moves the selection when navigation starts, before the page swap', () => {
    const bar = mountBar();
    initDocsTopBar();
    const event = Object.assign(new Event('astro:before-preparation'), {
      to: new URL('/components/button', window.location.origin),
    });
    document.dispatchEvent(event);
    const [docs, components] = Array.from(bar.querySelectorAll('a'));
    expect(components.hasAttribute('data-selected')).toBe(true);
    expect(docs.hasAttribute('data-selected')).toBe(false);
    expect(bar.querySelectorAll('[data-selected]')).toHaveLength(1);
  });

  it('a late page-load from the previous navigation does not undo a newer click', () => {
    const bar = mountBar();
    initDocsTopBar();
    const go = (path: string) =>
      document.dispatchEvent(
        Object.assign(new Event('astro:before-preparation'), {
          to: new URL(path, window.location.origin),
        }),
      );
    go('/components/button');
    // The page-load of the page we are leaving fires while the new navigation is in flight.
    document.dispatchEvent(new Event('astro:page-load'));
    const [docs, components] = Array.from(bar.querySelectorAll('a'));
    expect(components.hasAttribute('data-selected')).toBe(true);
    expect(docs.hasAttribute('data-selected')).toBe(false);
  });
});

describe('nested matches (#339)', () => {
  it('selects only the longest matching prefix', () => {
    document.body.innerHTML = `
      <nav data-docs-top-bar>
        <a href="/docs" data-docs-top-nav-match="/docs">Docs</a>
        <a href="/docs/changelog" data-docs-top-nav-match="/docs/changelog">Changelog</a>
        <a href="https://github.com/x" target="_blank">GitHub</a>
      </nav>
    `;
    const [docs, changelog, github] = Array.from(document.querySelectorAll('a'));
    syncDocsTopBarSelection('/docs/changelog/0-14/');
    expect(changelog.hasAttribute('data-selected')).toBe(true);
    expect(docs.hasAttribute('data-selected')).toBe(false);
    expect(docs.hasAttribute('aria-current')).toBe(false);
    expect(github.hasAttribute('data-selected')).toBe(false);

    syncDocsTopBarSelection('/docs/getting-started/');
    expect(docs.hasAttribute('data-selected')).toBe(true);
    expect(changelog.hasAttribute('data-selected')).toBe(false);
  });
});
