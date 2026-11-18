import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Types a component module exports for its siblings, not for apps. Everything else a component
 * module exports is part of a public prop surface (a prop's type, a part's props, an option
 * shape), so apps need it from the package root instead of `ComponentProps<...>['x']`.
 */
const INTERNAL_TYPES = new Set([
  // Shared field plumbing for the field components.
  'FieldFrameSlots',
  'FieldFrameState',
  'UseFieldFrameOptions',
  'FieldFrameDescriptionProps',
  'FieldFrameErrorProps',
  'FieldFrameProps',
  'RacFieldFrameProps',
  'RacTextFieldReplacedKeys',
]);

function exportedTypes(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(/^export (?:type|interface) ([A-Za-z0-9_]+)/gm)].map((m) => m[1]!);
}

function componentModules(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.tsx') && !name.includes('.test.'))
    .map((name) => path.join(dir, name));
}

describe('@var-ui/react public types', () => {
  it('re-exports every type a component module exports from the package root', () => {
    const barrels = ['components/index.ts', 'components/chat/index.ts', 'index.ts']
      .map((file) => readFileSync(path.join(here, file), 'utf8'))
      .join('\n');
    const modules = [
      ...componentModules(path.join(here, 'components')),
      ...componentModules(path.join(here, 'components/chat')),
    ];
    const missing = modules.flatMap((file) =>
      exportedTypes(file)
        .filter((name) => !INTERNAL_TYPES.has(name))
        .filter((name) => !new RegExp(`\\b${name}\\b`).test(barrels))
        .map((name) => `${path.relative(here, file)}: ${name}`),
    );
    expect(missing).toEqual([]);
  });
});
