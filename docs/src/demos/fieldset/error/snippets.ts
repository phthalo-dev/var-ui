import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Checkbox, Fieldset } from '@var-ui/react';

<Fieldset legend="Interests" errorMessage="Pick at least one topic.">
  <Checkbox>Design</Checkbox>
  <Checkbox>Engineering</Checkbox>
  <Checkbox>Research</Checkbox>
</Fieldset>`,
  astro: `<!-- No Astro demo yet: see the Astro peer in the page text -->`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
