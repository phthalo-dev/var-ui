import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Toc } from '@var-ui/react';

<Toc title="On this page">
  <Toc.Item label="Examples" href="#examples" selected />
  <Toc.Item label="Props" href="#props" />
</Toc>`,
  astro: `---
import { Toc, TocItem } from '@var-ui/astro';
---
<Toc title="On this page">
  <TocItem label="Examples" href="#examples" selected />
  <TocItem label="Props" href="#props" />
</Toc>`,
  html: `<nav class="var-ui-toc" aria-label="On this page">…</nav>`,
} satisfies DemoSnippets;
