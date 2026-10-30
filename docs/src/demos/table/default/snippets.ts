import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Table } from '@var-ui/react';

<Table
  columns={[
    { key: 'name', header: 'Name', rowHeader: true },
    { key: 'role', header: 'Role' },
  ]}
  data={[{ name: 'Ada', role: 'Admin' }]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
