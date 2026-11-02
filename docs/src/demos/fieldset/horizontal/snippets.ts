import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox, Fieldset } from '@var-ui/react';

<Fieldset legend="Days" orientation="horizontal" gap="lg">
  <Checkbox>Mon</Checkbox>
  <Checkbox>Tue</Checkbox>
  <Checkbox>Wed</Checkbox>
</Fieldset>`,
  astro: `<!-- No Astro demo yet: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
