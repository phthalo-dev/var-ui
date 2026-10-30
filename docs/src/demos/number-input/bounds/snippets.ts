import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { NumberInput } from '@var-ui/react';

<NumberInput
  label="Quantity"
  defaultValue={1}
  min={0}
  max={10}
  step={1}
  description="Between 0 and 10"
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
