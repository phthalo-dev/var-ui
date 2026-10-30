import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Alert } from '@var-ui/react';

<Alert tone="info" title="Registry icons">
  Alerts pull their tone glyph from IconProvider automatically.
</Alert>`,
  astro: `---
import { Alert } from '@var-ui/astro';
---

<Alert tone="info" title="Registry icons">
  Alerts pull their tone glyph from IconProvider automatically.
</Alert>`,
  html: `<div data-tone="info" data-appearance="subtle" data-content-gap="spaced" class="var-ui-alert" data-alert data-alert-tone="info" data-alert-appearance="subtle"><div data-tone="info" data-appearance="subtle" data-content-gap="spaced" class="var-ui-alert__body"><p data-tone="info" data-appearance="subtle" data-content-gap="spaced" class="var-ui-alert__title">Registry icons</p><div data-tone="info" data-appearance="subtle" data-content-gap="spaced" class="var-ui-alert__content" data-alert-content>Alerts pull their tone glyph from IconProvider automatically.</div></div></div>`,
} satisfies DemoSnippets;
