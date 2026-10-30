import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CalendarDate } from '@internationalized/date';
import { DateRangeInput } from '@var-ui/react';

<DateRangeInput
  label="Trip"
  value={{ start: new CalendarDate(2026, 8, 10), end: new CalendarDate(2026, 8, 20) }}
  onValueChange={setValue}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
