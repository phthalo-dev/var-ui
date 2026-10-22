import { describe, expect, it } from 'vite-plus/test';
import { demoSnippets } from '../demos/registry';
import { htmlDemoMap } from '../demos/htmlDemoMap';

describe('SSR smoke — alert html cookie row', () => {
  it('html framework renders alert markup with public classes', () => {
    const render = htmlDemoMap['alert.default'];
    if (!render) throw new Error('missing HTML renderer for alert.default');
    const html = render();
    expect(html).toContain('data-alert');
    expect(html).toContain('var-ui-alert');
  });

  it('alert html snippet is distinct from react snippet', () => {
    expect(demoSnippets['alert.default'].html).not.toBe(demoSnippets['alert.default'].react);
    expect(demoSnippets['alert.default'].html.length).toBeGreaterThan(0);
  });
});
