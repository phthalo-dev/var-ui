import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CopyButton } from '@var-ui/react';

<CopyButton
  value="npm i @var-ui/react"
  copyLabel="Copy install command"
  copiedLabel="Copied to clipboard"
/>`,
  astro: `---
import { CopyButton } from '@var-ui/astro';
---

<CopyButton
  value="npm i @var-ui/react"
  copyLabel="Copy install command"
  copiedLabel="Copied to clipboard"
/>`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
