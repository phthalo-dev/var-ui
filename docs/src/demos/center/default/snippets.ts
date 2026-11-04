import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Center, Text } from '@var-ui/react';

<Center style={{ height: '7.5rem', border: '0.0625rem dashed var(--color-border)' }}>
  <Text>Centered</Text>
</Center>`,
  astro: `---
import { Center, Text } from '@var-ui/astro';
---

<Center className="center-demo">
  <Text>Centered</Text>
</Center>

<style>
  .center-demo {
    height: 7.5rem;
    border: 0.0625rem dashed var(--color-border);
  }
</style>`,
  html: `<div class="var-ui-center" style="height: 7.5rem; border: 0.0625rem dashed var(--color-border)">
  <p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Centered</p>
</div>`,
} satisfies DemoSnippets;
