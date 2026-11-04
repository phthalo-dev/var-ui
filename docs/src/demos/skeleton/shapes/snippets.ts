import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Skeleton } from '@var-ui/react';

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
  <Skeleton shape="circle" style={{ width: '2.5rem', height: '2.5rem' }} />
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <Skeleton shape="text" style={{ width: '8.75rem', height: '0.875rem' }} />
    <Skeleton shape="rect" style={{ width: '12.5rem', height: '3rem' }} />
  </div>
</div>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
