import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm" wrap>
  <Button disabled>Disabled</Button>
  <Button tone="accent" appearance="filled" disabled>
    Disabled primary
  </Button>
</HStack>`,
  astro: `---
import { Button, HStack } from '@var-ui/astro';
---

<HStack gap="sm" wrap>
  <Button disabled>Disabled</Button>
  <Button tone="accent" appearance="filled" disabled>Disabled primary</Button>
</HStack>`,
  html: `<div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default" disabled>Disabled</button>
  <button type="button" class="var-ui-button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default" disabled>Disabled primary</button>
</div>`,
} satisfies DemoSnippets;
