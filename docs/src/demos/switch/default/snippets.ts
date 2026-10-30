import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Switch } from '@var-ui/react';

<Switch>Enable notifications</Switch>`,
  astro: `---
// No @var-ui/astro Switch — core recipe + native checkbox (role="switch").
import { switchStyles } from '@var-ui/core';

const sw = switchStyles();
---

<label class:list={[sw.root]}>
  <input type="checkbox" role="switch" class="sr-only" />
  <span class:list={[sw.track]}>
    <span class:list={[sw.thumb]}></span>
  </span>
  <span class:list={[sw.label]}>Enable notifications</span>
</label>`,
  html: `<label class="var-ui-switch"><input type="checkbox" role="switch" style="position:absolute;width:1px;height:1px;opacity:0"></input><span class="var-ui-switch__track"><span class="var-ui-switch__thumb"></span></span><span class="var-ui-switch__label">Enable notifications</span></label>`,
} satisfies DemoSnippets;
