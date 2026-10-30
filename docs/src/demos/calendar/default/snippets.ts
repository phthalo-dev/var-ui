import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CalendarDate } from '@internationalized/date';
import { Calendar } from '@var-ui/react';

<Calendar aria-label="Pick a day" value={value} onValueChange={setValue} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
