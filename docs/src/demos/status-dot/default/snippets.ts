import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { StatusDot } from '@var-ui/react';

<StatusDot tone="success" appearance="solid" aria-label="Online" />`,
  astro: `---
import { StatusDot } from '@var-ui/astro';
---
<StatusDot tone="success" appearance="solid" aria-label="Online" />`,
  html: `<span class="var-ui-status-dot" data-tone="success" data-appearance="solid" role="img" aria-label="Online"></span>`,
} satisfies DemoSnippets;
