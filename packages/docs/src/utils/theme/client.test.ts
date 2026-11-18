import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Every module `client.ts` reaches through relative imports. */
function moduleGraph(entry: string, seen = new Set<string>()): Set<string> {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  const source = readFileSync(entry, 'utf8');
  for (const match of source.matchAll(/^(?:import|export)[^'"]*from\s+['"](\.[^'"]+)['"]/gm)) {
    moduleGraph(path.resolve(path.dirname(entry), `${match[1]}.ts`), seen);
  }
  return seen;
}

describe('@var-ui/docs/theme-client', () => {
  it('reaches no Node built-ins or Node-only kit modules', () => {
    const graph = [...moduleGraph(path.join(here, 'client.ts'))];
    expect(graph.length).toBeGreaterThan(1);
    for (const file of graph) {
      const specifiers = [
        ...readFileSync(file, 'utf8').matchAll(/^(?:import|export)[^'"]*from\s+['"]([^'"]+)['"]/gm),
      ].map((match) => match[1]);
      for (const specifier of specifiers) {
        expect(specifier, path.basename(file)).not.toMatch(/^(node:|fs$|path$|url$)/);
        expect(specifier, path.basename(file)).not.toMatch(/extract-theme-css|markdown-views/);
      }
    }
  });

  it('exports the loader, the controller and the preset helpers', async () => {
    const client = await import('./client');
    expect(Object.keys(client).sort()).toEqual(
      [
        'createDocsThemeController',
        'createThemeClassMap',
        'ensureDocsThemeStyles',
        'getAllThemeClassNames',
        'getDocsThemeStylesHref',
        'getLazyThemePresets',
        'resolveThemePresets',
      ].sort(),
    );
  });
});
