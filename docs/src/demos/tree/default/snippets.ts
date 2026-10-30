import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Tree } from '@var-ui/react';

<Tree
  aria-label="Files"
  defaultExpanded={['src']}
  items={[{ id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] }]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
