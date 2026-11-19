import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Table } from '@var-ui/react';

<Table
  bordered
  highlightOnHover
  minWidth="40rem"
  caption="Recent runs"
  columns={[
    { key: 'run', header: 'Run', rowHeader: true },
    { key: 'branch', header: 'Branch' },
    { key: 'status', header: 'Status' },
    { key: 'duration', header: 'Duration', align: 'end' },
    { key: 'started', header: 'Started', align: 'end' },
  ]}
  data={runs}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
