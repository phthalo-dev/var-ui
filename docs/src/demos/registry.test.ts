import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { astroDemoIds } from './astroDemoMap';
import { demoIdFromPath } from './demoPath';
import { htmlDemoIds } from './htmlDemoMap';
import { reactDemoIds } from './reactDemoMap';
import { DEMO_IDS, demoSnippets, getDemoSnippets } from './registry';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderHiddenHideMd } from './hidden/hide-md/html';
import { render as renderHiddenShowMd } from './hidden/show-md/html';

// jsdom gives `import.meta.url` a non-file scheme; Vitest still sets `dirname`.
const demosDir = import.meta.dirname;

describe('demo registry', () => {
  it('has a demo for every folder under src/demos/<component>/<name>/', () => {
    const folders = readdirSync(demosDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((component) =>
        readdirSync(path.join(demosDir, component.name), { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((demo) => `${component.name}.${demo.name}`),
      )
      .sort();
    expect(DEMO_IDS).toEqual(folders);
  });

  it('gives every demo react/astro/html snippets and a React preview', () => {
    for (const id of DEMO_IDS) {
      expect(demoSnippets[id].react.length, id).toBeGreaterThan(0);
      expect(demoSnippets[id].astro.length, id).toBeGreaterThan(0);
      expect(demoSnippets[id].html.length, id).toBeGreaterThan(0);
    }
    expect([...reactDemoIds].sort()).toEqual(DEMO_IDS);
  });

  it('pairs astro.astro and html.ts: a demo has both static previews or neither', () => {
    expect([...astroDemoIds].sort()).toEqual([...htmlDemoIds].sort());
  });

  it('names the folder to add for an unknown id', () => {
    expect(() => getDemoSnippets('table.nope')).toThrow('src/demos/table/nope/');
  });

  it('rejects files outside the <component>/<name>/ layout', () => {
    expect(demoIdFromPath('./table/bordered/react.tsx')).toBe('table.bordered');
    expect(() => demoIdFromPath('./table/react.tsx')).toThrow('src/demos/<component>/<name>/');
  });

  it('keeps Hidden HTML snippets aligned with live hide classes', () => {
    const hideMdClass = renderHiddenHideMd().match(/<aside class="([^"]+)"/)?.[1];
    const showMdClass = renderHiddenShowMd().match(/<aside class="([^"]+)"/)?.[1];
    expect(hideMdClass).toBeTruthy();
    expect(showMdClass).toBeTruthy();
    expect(demoSnippets['hidden.hide-md'].html).toContain(`class="${hideMdClass}"`);
    expect(demoSnippets['hidden.show-md'].html).toContain(`class="${showMdClass}"`);
  });

  it('serializes HTML button previews with class + data attrs', () => {
    const html = renderButtonDefault();
    expect(html).toMatch(/^<button /);
    expect(html).toContain('class="var-ui-button"');
    expect(html).toContain('data-tone="neutral"');
    expect(html).toContain('data-appearance="subtle"');
    expect(html).toContain('>Click me</button>');
    expect(html).not.toContain('className=');
  });
});
