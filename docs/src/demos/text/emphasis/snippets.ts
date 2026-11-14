import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Stack, Text } from '@var-ui/react';

<Stack gap="sm">
  <Text eyebrow size="xs" tone="secondary">Steps</Text>
  <Text size="xl" weight="bold">128.4k</Text>
  <Text weight="semibold">Semibold emphasis</Text>
  <Text weight="bold">Bold emphasis</Text>
</Stack>`,
  astro: `---
import { Text } from '@var-ui/astro';
---

<Text eyebrow size="xs" tone="secondary">Steps</Text>
<Text size="xl" weight="bold">128.4k</Text>
<Text weight="semibold">Semibold emphasis</Text>
<Text weight="bold">Bold emphasis</Text>`,
  html: `<p data-size="xs" data-tone="secondary" data-weight="normal" data-eyebrow class="var-ui-text-block">Steps</p>
<p data-size="xl" data-tone="primary" data-weight="bold" class="var-ui-text-block">128.4k</p>
<p data-size="md" data-tone="primary" data-weight="semibold" class="var-ui-text-block">Semibold emphasis</p>
<p data-size="md" data-tone="primary" data-weight="bold" class="var-ui-text-block">Bold emphasis</p>`,
} satisfies DemoSnippets;
