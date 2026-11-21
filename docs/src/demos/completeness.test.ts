import { describe, expect, it } from 'vite-plus/test';
import { collectMdxDemoIds } from './mdxDemoIds';
import { DEMO_IDS } from './registry';

describe('MDX demo completeness gate', () => {
  it('every <Demo id> in active MDX has a folder under src/demos/', () => {
    const ids = collectMdxDemoIds();
    expect(ids.length).toBeGreaterThan(0);
    const missing = ids.filter((id) => !(DEMO_IDS as string[]).includes(id));
    expect(missing, 'add src/demos/<component>/<name>/ for each').toEqual([]);
  });
});
