import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Skeleton } from '@var-ui/react';

<Skeleton shape="text" style={{ width: '7.5rem', height: '1rem' }} />`,
  astro: `---
import { Skeleton } from '@var-ui/astro';
---
<Skeleton shape="text" style="width: 7.5rem; height: 1rem;" />`,
  html: `<div class="var-ui-skeleton" data-shape="text" aria-hidden style="width: 7.5rem; height: 1rem;"></div>`,
} satisfies DemoSnippets;
