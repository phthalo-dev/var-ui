import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { LoadingOverlay } from '@var-ui/react';

<LoadingOverlay visible label="Loading">
  <div style={{ width: '12.5rem', height: '5rem' }}>Content</div>
</LoadingOverlay>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
