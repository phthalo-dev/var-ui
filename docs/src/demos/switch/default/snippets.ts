import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Switch } from '@var-ui/react';

<Switch>Enable notifications</Switch>`,
  astro: `---
// No @var-ui/astro Switch — core recipe + native checkbox (role="switch").
import { switchStyles } from '@var-ui/core';
import { mergeProps } from '@var-ui/astro';

const sw = switchStyles();
---

<label {...mergeProps(sw.root)}>
  <input type="checkbox" role="switch" class="sr-only" />
  <span {...mergeProps(sw.track)}>
    <span {...mergeProps(sw.thumb)}></span>
  </span>
  <span {...mergeProps(sw.label)}>Enable notifications</span>
</label>`,
  html: `<label data-size="md" class="var-ui-switch"><input type="checkbox" role="switch" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span data-size="md" class="var-ui-switch__track"><span data-size="md" class="var-ui-switch__thumb"></span></span><span data-size="md" class="var-ui-switch__label">Enable notifications</span></label>`,
} satisfies DemoSnippets;
