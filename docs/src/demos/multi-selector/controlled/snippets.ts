import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { MultiSelector } from '@var-ui/react';
import { useState } from 'react';

const [value, setValue] = useState(['design', 'ops']);

<MultiSelector
  label="Teams"
  description="Selection stays in React state"
  options={options}
  value={value}
  onValueChange={setValue}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
