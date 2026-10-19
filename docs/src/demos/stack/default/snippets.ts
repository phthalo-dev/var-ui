import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm">
  <Button>Cancel</Button>
  <Button>Save</Button>
</HStack>`,
  astro: `---
import { Button, HStack } from '@var-ui/astro';
---

<HStack gap="sm">
  <Button>Cancel</Button>
  <Button>Save</Button>
</HStack>`,
  html: `<div data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="nowrap" class="var-ui-stack">
  <button type="button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default" class="var-ui-button">Cancel</button>
  <button type="button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default" class="var-ui-button">Save</button>
</div>`,
} satisfies DemoSnippets;
