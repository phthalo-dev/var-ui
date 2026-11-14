import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Stack, Text } from '@var-ui/react';

<Stack gap="sm">
  <Text eyebrow size="xs" tone="secondary">Agent output</Text>
  <Text whiteSpace="pre-wrap">{'Step 1: index rebuilt\\nStep 2: pending review'}</Text>
  <Text lineClamp={2} tone="secondary">The migration stalls whenever a shard…</Text>
  <Text lineClamp={20}>The migration stalls whenever a shard…</Text>
</Stack>`,
  astro: `---
import { Text } from '@var-ui/astro';
---

<Text eyebrow size="xs" tone="secondary">Agent output</Text>
<Text whiteSpace="pre-wrap">Step 1: index rebuilt{'\\n'}Step 2: pending review</Text>
<Text lineClamp={2} tone="secondary">The migration stalls whenever a shard…</Text>
<Text lineClamp={20}>The migration stalls whenever a shard…</Text>`,
  html: `<p data-size="xs" data-tone="secondary" data-weight="normal" data-eyebrow class="var-ui-text-block">Agent output</p>
<p data-size="md" data-tone="primary" data-weight="normal" data-white-space="pre-wrap" class="var-ui-text-block">Step 1: index rebuilt
Step 2: pending review</p>
<p data-size="md" data-tone="secondary" data-weight="normal" data-line-clamp="2" class="var-ui-text-block">The migration stalls whenever a shard…</p>
<p data-size="md" data-tone="primary" data-weight="normal" data-line-clamp="n" style="--var-ui-text-block-lineclamp: 20" class="var-ui-text-block">The migration stalls whenever a shard…</p>`,
} satisfies DemoSnippets;
