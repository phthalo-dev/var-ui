import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack, Stack } from '@var-ui/react';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['filled', 'outline', 'subtle', 'ghost'] as const;

<Stack gap="lg">
  {appearances.map((appearance) => (
    <HStack key={appearance} gap="sm" wrap>
      {tones.map((tone) => (
        <Button key={tone} tone={tone} appearance={appearance}>
          {tone}
        </Button>
      ))}
    </HStack>
  ))}
</Stack>`,
  astro: `---
import { Button, HStack, Stack } from '@var-ui/astro';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['filled', 'outline', 'subtle', 'ghost'] as const;
---

<Stack gap="lg">
  {appearances.map((appearance) => (
    <HStack gap="sm" wrap>
      {tones.map((tone) => (
        <Button tone={tone} appearance={appearance}>{tone}</Button>
      ))}
    </HStack>
  ))}
</Stack>`,
  html: `<div class="var-ui-stack" data-direction="column" data-gap="lg" data-align="stretch" data-justify="start" data-wrap="nowrap">
  <div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
    <button type="button" class="var-ui-button" data-tone="neutral" data-appearance="filled" data-size="md" data-layout="default">neutral</button>
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default">accent</button>
    <button type="button" class="var-ui-button" data-tone="success" data-appearance="filled" data-size="md" data-layout="default">success</button>
    <button type="button" class="var-ui-button" data-tone="warning" data-appearance="filled" data-size="md" data-layout="default">warning</button>
    <button type="button" class="var-ui-button" data-tone="danger" data-appearance="filled" data-size="md" data-layout="default">danger</button>
    <button type="button" class="var-ui-button" data-tone="info" data-appearance="filled" data-size="md" data-layout="default">info</button>
  </div>
  <!-- outline, subtle, and ghost rows follow the same pattern -->
</div>`,
} satisfies DemoSnippets;
