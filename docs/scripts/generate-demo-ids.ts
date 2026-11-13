import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const typesPath = path.join(docsRoot, '../src/demos/types.ts');
const outPath = path.join(docsRoot, '../src/demos/demoIds.ts');

const source = fs.readFileSync(typesPath, 'utf8');
const union = source.match(/export type DemoId =([\s\S]*?);/)?.[1];
if (!union) throw new Error('DemoId union not found in src/demos/types.ts');

const ids = [...union.matchAll(/'([^']+)'/g)].map((match) => match[1]!);
if (ids.length === 0) throw new Error('No ids parsed from the DemoId union');

const body = ids.map((id) => `  '${id}': true,`).join('\n');

const output = `import type { DemoId } from './types';

/**
 * Runtime demo-id checklist, mirroring the \`DemoId\` union one-to-one.
 *
 * \`satisfies Record<DemoId, true>\` makes drift a compile error in both directions: an id
 * missing here (a demo with no gallery test) or an id in the union that does not exist
 * fails \`astro check\`. The smoke suite (\`docs/e2e/smoke.spec.ts\`) iterates these keys, so
 * adding a \`DemoId\` forces adding it here — and therefore to the browser suite.
 *
 * Kept free of demo imports on purpose: Playwright's spec transform mishandles the
 * workspace-source import graph (\`@var-ui/react\` via tsconfig paths), while the \`/e2d\`
 * Astro route renders demos fine on the server.
 *
 * GENERATED FILE — regenerate with: node --experimental-strip-types scripts/generate-demo-ids.ts
 */
export const demoIdChecklist = {
${body}
} satisfies Record<DemoId, true>;

export const DEMO_IDS = Object.keys(demoIdChecklist) as DemoId[];
`;

fs.writeFileSync(outPath, output);
console.log(`demoIds.ts regenerated with ${ids.length} ids`);
