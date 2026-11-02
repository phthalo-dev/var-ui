import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox, Fieldset, TextField } from '@var-ui/react';

<Fieldset legend="Billing address" description="Locked while the plan is archived." disabled>
  <TextField label="Street" />
  <Checkbox>Same as shipping</Checkbox>
</Fieldset>`,
  astro: `<!-- No Astro demo yet: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
