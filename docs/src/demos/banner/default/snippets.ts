import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Banner } from '@var-ui/react';

<Banner tone="success" appearance="solid">
  Deploy finished in 42s.
</Banner>`,
  astro: `---
import { Banner } from '@var-ui/astro';
---

<Banner tone="success" appearance="solid">
  Deploy finished in 42s.
</Banner>`,
  html: `<div data-tone="success" data-appearance="solid" class="var-ui-banner" data-var-ui-banner role="status"><div data-tone="success" data-appearance="solid" class="var-ui-banner__content"><span>Deploy finished in 42s.</span></div></div>`,
} satisfies DemoSnippets;
