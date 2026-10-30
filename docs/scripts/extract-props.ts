import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeComponentProps } from '../src/lib/extract-component-props.ts';
import { writeStylingHooks } from '../src/lib/extract-styling-hooks.ts';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(docsRoot, '../src/generated/props');

writeComponentProps(outputDir);
await writeStylingHooks(path.join(docsRoot, '../src/generated/styling'));
