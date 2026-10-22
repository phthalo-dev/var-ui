import { typestyles } from '@var-ui/core';

// Docs site globals (extracted via typestyles-entry.ts).
// CSS reset, color-scheme, and base element styles ship with @var-ui/core/styles.

// Offset fixed docs header when following in-page anchor links.
typestyles.global.rule('article :is(h2, h3)[id]', {
  scrollMarginTop: 'calc(var(--docs-header-height, 3.5rem) + 1rem)',
});
