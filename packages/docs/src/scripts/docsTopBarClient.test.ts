import { describe, expect, it } from 'vite-plus/test';
import { syncDocsTopBarSelection } from './docsTopBarClient';

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
