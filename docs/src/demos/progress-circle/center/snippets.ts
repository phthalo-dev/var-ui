import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ProgressCircle } from '@var-ui/react';

<ProgressCircle label="Uploading assets" value={72} size="lg">
  {({ valueText }) => valueText}
</ProgressCircle>`,
  astro: `---
import { ProgressCircle } from '@var-ui/astro';
---

<ProgressCircle label="Uploading assets" value={72} size="lg">72%</ProgressCircle>`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
