/**
 * Manual / CI helper — `varDocs()` also runs this on `astro:build:start`.
 * Usage: `node --experimental-strip-types scripts/build-theme-styles.mjs`
 */
import { fileURLToPath } from 'node:url';
import { buildDocsThemeStyles } from '@var-ui/docs/theme-css';
import { docsThemePresets } from '../src/themes/presets.ts';

const docsRoot = fileURLToPath(new URL('..', import.meta.url));

await buildDocsThemeStyles({
  root: docsRoot,
  presets: [...docsThemePresets],
  typestylesEntry: 'typestyles-entry.ts',
});
