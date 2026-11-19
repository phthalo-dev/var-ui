import type { DocsFramework } from '@var-ui/docs-components/framework';

/**
 * `<component>.<name>`: the demo's folder under `src/demos/`. Ids come from the folder
 * layout, not a hand-kept union; `completeness.test.ts` checks every `<Demo id>` in MDX.
 */
export type DemoId = `${string}.${string}`;

export type DemoSnippets = Record<DocsFramework, string>;
