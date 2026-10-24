import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Stack, Text } from '@var-ui/react';

<Stack gap="xs">
  <Text>Primary text is the default.</Text>
  <Text tone="secondary">Secondary text for supporting copy.</Text>
  <Text tone="accent">Accent text for emphasis.</Text>
  <Text tone="success">Success text for confirmations.</Text>
  <Text tone="warning">Warning text for cautions.</Text>
  <Text tone="danger">Danger text for errors and validation messages.</Text>
  <Text tone="info">Info text for neutral notices.</Text>
</Stack>`,
  astro: `---
import { Text } from '@var-ui/astro';
---

<Text>Primary text is the default.</Text>
<Text tone="secondary">Secondary text for supporting copy.</Text>
<Text tone="accent">Accent text for emphasis.</Text>
<Text tone="success">Success text for confirmations.</Text>
<Text tone="warning">Warning text for cautions.</Text>
<Text tone="danger">Danger text for errors and validation messages.</Text>
<Text tone="info">Info text for neutral notices.</Text>`,
  html: `<p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Primary text is the default.</p>
<p data-size="md" data-tone="secondary" data-weight="normal" class="var-ui-text-block">Secondary text for supporting copy.</p>
<p data-size="md" data-tone="accent" data-weight="normal" class="var-ui-text-block">Accent text for emphasis.</p>
<p data-size="md" data-tone="success" data-weight="normal" class="var-ui-text-block">Success text for confirmations.</p>
<p data-size="md" data-tone="warning" data-weight="normal" class="var-ui-text-block">Warning text for cautions.</p>
<p data-size="md" data-tone="danger" data-weight="normal" class="var-ui-text-block">Danger text for errors and validation messages.</p>
<p data-size="md" data-tone="info" data-weight="normal" class="var-ui-text-block">Info text for neutral notices.</p>`,
} satisfies DemoSnippets;
