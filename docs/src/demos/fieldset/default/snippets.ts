import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox, Fieldset } from '@var-ui/react';

<Fieldset legend="Notifications" description="Choose how we reach you.">
  <Checkbox defaultChecked>Email</Checkbox>
  <Checkbox>SMS</Checkbox>
  <Checkbox>Push</Checkbox>
</Fieldset>`,
  astro: `<!-- No Astro demo yet: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
