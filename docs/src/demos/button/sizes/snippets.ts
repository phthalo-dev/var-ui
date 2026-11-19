import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm" align="center" wrap>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra large</Button>
</HStack>`,
  astro: `---
import { Button, HStack } from '@var-ui/astro';
---

<HStack gap="sm" align="center" wrap>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra large</Button>
</HStack>`,
  html: `<div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="xs" data-layout="default">Extra small</button>
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="sm" data-layout="default">Small</button>
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="md" data-layout="default">Medium</button>
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="lg" data-layout="default">Large</button>
  <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="subtle" data-size="xl" data-layout="default">Extra large</button>
</div>`,
} satisfies DemoSnippets;
