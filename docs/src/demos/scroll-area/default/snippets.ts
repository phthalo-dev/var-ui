import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ScrollArea } from '@var-ui/react';

<ScrollArea style={{ height: '7.5rem', width: '15rem' }}>
  <p>Long content…</p>
</ScrollArea>`,
  astro: `---
import { ScrollArea } from '@var-ui/astro';
---
<ScrollArea className="demo-scroll">…</ScrollArea>`,
  html: `<div class="var-ui-scroll-area" style="height: 7.5rem; width: 15rem;">…</div>`,
} satisfies DemoSnippets;
