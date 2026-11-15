import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

/**
 * Components and providers that were removed and must not reappear in docs
 * copy, demos, or the registry. When one is removed, add its name here — docs
 * and demo updates routinely miss a mention, and published catalogs then
 * advertise an export that no longer exists (#132, #126).
 */
const REMOVED = ['VStack', 'LayerProvider', 'useLayer', 'SimpleGrid', /\bOutline\b/];

const docsDir = join(dirname(fileURLToPath(import.meta.url)), '../../content');

function listFiles(dir: string, extension: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(join(entry.parentPath, entry.name));
    }
  }
  return files;
}

const mdxFiles = listFiles(docsDir, '.mdx');
const demoFiles = [
  ...listFiles(join(docsDir, '../src/demos'), '.ts'),
  ...listFiles(join(docsDir, '../src/demos'), '.tsx'),
  ...listFiles(join(docsDir, '../src/demos'), '.astro'),
];
const registry = readFileSync(join(docsDir, '../src/data/components.ts'), 'utf8');

describe('docs copy', () => {
  it('never references removed components', () => {
    for (const file of [...mdxFiles, ...demoFiles]) {
      const source = readFileSync(file, 'utf8');
      for (const removed of REMOVED) {
        const name = typeof removed === 'string' ? removed : removed.source.replaceAll('\\b', '');
        expect(source, `${file} references removed ${name}`).not.toMatch(new RegExp(removed));
      }
    }
  });

  it('registry import lines and descriptions never reference removed components', () => {
    for (const removed of REMOVED) {
      const name = typeof removed === 'string' ? removed : removed.source.replaceAll('\\b', '');
      expect(registry, `component registry references removed ${name}`).not.toMatch(
        new RegExp(removed),
      );
    }
  });
});
