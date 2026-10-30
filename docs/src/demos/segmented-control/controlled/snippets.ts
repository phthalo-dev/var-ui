import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SegmentedControl } from '@var-ui/react';
import { useState } from 'react';

const [value, setValue] = useState<string | null>('list');

<SegmentedControl
  value={value}
  onValueChange={setValue}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
