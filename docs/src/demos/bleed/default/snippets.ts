import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Bleed, Stack, Text } from '@var-ui/react';

<div style={{ containerType: 'inline-size', paddingInline: '1.5rem', border: '0.0625rem dashed var(--var-ui-color-border-default)' }}>
  <Stack gap="sm" style={{ maxWidth: '20rem', marginInline: 'auto' }}>
    <Text>The column</Text>
    <Bleed gutter="1.5rem" style={{ background: 'var(--var-ui-color-background-subtle)', paddingBlock: '0.75rem' }}>
      <Text>A full-bleed band, content on the column</Text>
    </Bleed>
    <Text>The column again</Text>
  </Stack>
</div>`,
  astro: `---
import { Bleed, Stack, Text } from '@var-ui/astro';
---

<div style="container-type: inline-size; padding-inline: 1.5rem; border: 0.0625rem dashed var(--var-ui-color-border-default)">
  <Stack gap="sm" style="max-width: 20rem; margin-inline: auto">
    <Text>The column</Text>
    <Bleed gutter="1.5rem" style="background: var(--var-ui-color-background-subtle); padding-block: 0.75rem">
      <Text>A full-bleed band, content on the column</Text>
    </Bleed>
    <Text>The column again</Text>
  </Stack>
</div>`,
  html: `<div style="container-type: inline-size; padding-inline: 1.5rem; border: 0.0625rem dashed var(--var-ui-color-border-default)">
  <div class="var-ui-stack" data-direction="column" data-gap="sm" data-align="stretch" data-justify="start" data-wrap="nowrap" style="max-width: 20rem; margin-inline: auto">
    <p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">The column</p>
    <div class="var-ui-bleed" data-align="content" style="--var-ui-bleed-gutter: 1.5rem; background: var(--var-ui-color-background-subtle); padding-block: 0.75rem">
      <p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">A full-bleed band, content on the column</p>
    </div>
    <p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">The column again</p>
  </div>
</div>`,
} satisfies DemoSnippets;
