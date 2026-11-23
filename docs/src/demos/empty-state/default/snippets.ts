import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, EmptyState, Icon } from '@var-ui/react';

<EmptyState
  icon={<Icon name="search" size="lg" />}
  title="No results"
  description="Try a different filter, or clear the search."
  action={<Button tone="accent" appearance="solid">Clear filters</Button>}
/>`,
  astro: `---
import { Button, EmptyState } from '@var-ui/astro';
---

<EmptyState
  title="No results"
  description="Try a different filter, or clear the search."
>
  <svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="20" height="20">
    <circle cx="11" cy="11" r="7"></circle>
    <path d="M16.5 16.5L21 21"></path>
  </svg>
  <Button slot="action" tone="accent" appearance="solid">Clear filters</Button>
</EmptyState>`,
  html: `<div class="var-ui-empty-state"><div class="var-ui-empty-state__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg></div><h3 class="var-ui-empty-state__title">No results</h3><p class="var-ui-empty-state__description">Try a different filter, or clear the search.</p><div class="var-ui-empty-state__action"><button type="button" data-tone="accent" data-appearance="solid" data-size="md" data-layout="default" class="var-ui-button">Clear filters</button></div></div>`,
} satisfies DemoSnippets;
