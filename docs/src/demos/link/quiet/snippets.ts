import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Link } from '@var-ui/react';

<Link href="/runs" tone="secondary" size="sm" startIcon="chevronLeft">
  Back to runs
</Link>`,
  astro: `---
import { Link } from '@var-ui/astro';
import { svg as chevronLeftSvg } from '@var-ui/icons/glyphs/chevronLeft';
---

<Link href="/runs" tone="secondary" size="sm">
  <Fragment slot="start-icon" set:html={chevronLeftSvg} />
  Back to runs
</Link>`,
  html: `<a href="/runs" data-tone="secondary" data-size="sm" class="var-ui-link"><span data-tone="secondary" data-size="sm" class="var-ui-link__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14.5 6l-6 6 6 6" /></svg></span>Back to runs</a>`,
} satisfies DemoSnippets;
