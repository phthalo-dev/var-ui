import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Portal } from '@var-ui/react';

<Portal>
  <div className="floating-note">I live in document.body</div>
</Portal>`,
  astro: `<!-- Client-only: use @var-ui/react -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
