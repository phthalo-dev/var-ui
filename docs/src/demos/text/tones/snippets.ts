import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Stack, Text } from '@var-ui/react';

<Stack gap="xs">
  <Text>Primary text is the default.</Text>
  <Text tone="secondary">Secondary text for supporting copy.</Text>
  <Text tone="danger">Danger text for errors and validation messages.</Text>
</Stack>`,
  astro: `---
import { Text } from '@var-ui/astro';
---

<Text>Primary text is the default.</Text>
<Text tone="secondary">Secondary text for supporting copy.</Text>
<Text tone="danger">Danger text for errors and validation messages.</Text>`,
  html: `<p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Primary text is the default.</p>
<p data-size="md" data-tone="secondary" data-weight="normal" class="var-ui-text-block">Secondary text for supporting copy.</p>
<p data-size="md" data-tone="danger" data-weight="normal" class="var-ui-text-block">Danger text for errors and validation messages.</p>`,
} satisfies DemoSnippets;
