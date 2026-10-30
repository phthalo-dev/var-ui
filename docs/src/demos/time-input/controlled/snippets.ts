import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Time } from '@internationalized/date';
import { TimeInput } from '@var-ui/react';

<TimeInput label="Start" value={value} onValueChange={setValue} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
