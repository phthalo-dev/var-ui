// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { persistDisclosures } from './disclosureState';

const KEY = 'test-sections';

function mount(html: string): HTMLElement {
  const root = document.createElement('nav');
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

const flushToggle = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('persistDisclosures', () => {
  it('restores stored state and writes back toggles', async () => {
    localStorage.setItem(KEY, JSON.stringify({ guides: false }));
    const root = mount(`
      <details data-section-id="guides" open><summary>Guides</summary></details>
      <details data-section-id="api"><summary>API</summary></details>
      <details open><summary>Untracked</summary></details>`);
    const [guides, api, untracked] = root.querySelectorAll('details');
    const cleanup = persistDisclosures(root, KEY);
    expect(guides!.open).toBe(false);
    expect(api!.open).toBe(false);
    expect(untracked!.open).toBe(true);

    api!.open = true;
    await flushToggle();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({ guides: false, api: true });

    cleanup();
    api!.open = false;
    await flushToggle();
    expect(JSON.parse(localStorage.getItem(KEY)!).api).toBe(true);
  });

  it('keeps the section holding the current page open, whatever was stored', () => {
    localStorage.setItem(KEY, JSON.stringify({ guides: false }));
    const root = mount(`
      <details data-section-id="guides"><summary>Guides</summary>
        <a href="/x" aria-current="page">X</a>
      </details>`);
    persistDisclosures(root, KEY);
    expect(root.querySelector('details')!.open).toBe(true);
  });

  it('ignores corrupt storage', () => {
    localStorage.setItem(KEY, '{not json');
    const root = mount(`<details data-section-id="a" open><summary>A</summary></details>`);
    expect(() => persistDisclosures(root, KEY)).not.toThrow();
    expect(root.querySelector('details')!.open).toBe(true);
  });
});
