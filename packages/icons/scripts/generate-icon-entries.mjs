/**
 * Refresh per-icon React entries, the glyphs barrel, and package.json subpaths
 * from `src/glyph-data/*.ts`.
 *
 * Add an icon by creating `src/glyph-data/<name>.ts` (export `innerHtml`) and
 * adding the name to `iconNameList` in `@var-ui/core`, then run this script.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const glyphDir = join(pkgRoot, 'src/glyph-data');

const names = readdirSync(glyphDir)
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.slice(0, -3))
  .sort();

for (const name of names) {
  const react = `import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/${name}';

/** \`${name}\` glyph. Render it directly, or pass it through \`IconProvider\` via \`defaultIcons\`. */
export const ${name} = glyphFromInnerHtml(innerHtml);
`;
  writeFileSync(join(pkgRoot, 'src/icons', `${name}.tsx`), react);
}

const glyphImports = names
  .map(
    (name) =>
      `import { innerHtml as ${name}Inner, svg as ${name}Svg } from './glyph-data/${name}';`,
  )
  .join('\n');
const innerPairs = names.map((name) => `  ${name}: ${name}Inner,`).join('\n');
const svgPairs = names.map((name) => `  ${name}: ${name}Svg,`).join('\n');

writeFileSync(
  join(pkgRoot, 'src/glyphs.ts'),
  `import type { IconName } from '@var-ui/core';
${glyphImports}

/** Inner SVG markup for a default glyph (children of the root \`<svg>\`). */
export const defaultGlyphInnerHtml = {
${innerPairs}
} as const satisfies Record<IconName, string>;

export type DefaultGlyphName = keyof typeof defaultGlyphInnerHtml;

/** All default glyph SVG strings keyed by semantic icon name. */
export const defaultIconSvgs = {
${svgPairs}
} as const satisfies Record<DefaultGlyphName, string>;

/** Full inline SVG string for a default glyph (24×24, \`currentColor\`). */
export function defaultIconSvg(name: DefaultGlyphName): string {
  return defaultIconSvgs[name];
}
`,
);

const iconImports = names.map((name) => `import { ${name} } from './icons/${name}';`).join('\n');
const iconPairs = names.map((name) => `  ${name},`).join('\n');

writeFileSync(
  join(pkgRoot, 'src/default-icons.tsx'),
  `import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
${iconImports}

/** Default React glyphs — pass to \`IconProvider\`. */
export const defaultIcons: Record<IconName, ReactNode> = {
${iconPairs}
};
`,
);

const reexports = names.map((name) => `export { ${name} } from './icons/${name}';`).join('\n');
writeFileSync(
  join(pkgRoot, 'src/index.ts'),
  `export { defaultIcons } from './default-icons';
export { varUiMark, varUiMarkSmall } from './brand-mark';
${reexports}
`,
);

const pkgPath = join(pkgRoot, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
// `@var-ui/source` points in-repo consumers (docs, examples, tests) at the TypeScript source; it
// is a custom condition no published consumer sets. See SOURCE_CONDITION in source-conditions.ts.
const entry = (src, dist) => ({
  '@var-ui/source': `./src/${src}`,
  types: `./dist/${dist}.d.mts`,
  import: `./dist/${dist}.mjs`,
});
const exports = {
  '.': entry('index.ts', 'index'),
  './glyphs': entry('glyphs.ts', 'glyphs'),
  './brand': entry('brand.ts', 'brand'),
};
for (const name of names) {
  exports[`./glyphs/${name}`] = entry(`glyph-data/${name}.ts`, `glyph-data/${name}`);
  exports[`./${name}`] = entry(`icons/${name}.tsx`, `icons/${name}`);
}
pkg.exports = exports;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`wrote ${names.length} icon entries`);
