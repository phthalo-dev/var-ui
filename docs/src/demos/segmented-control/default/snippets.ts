import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SegmentedControl } from '@var-ui/react';

<SegmentedControl
  defaultValue="list"
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
