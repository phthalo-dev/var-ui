import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import { Icon, Text, UnstyledButton } from '@var-ui/react';

const [open, setOpen] = useState(false);

<UnstyledButton aria-expanded={open} onClick={() => setOpen(!open)}>
  <Icon name={open ? 'chevronDown' : 'chevronRight'} size="sm" />
  <Text as="span" size="sm" weight="medium">Build details</Text>
</UnstyledButton>`,
  astro: `---
import { UnstyledButton } from '@var-ui/astro';
import { svg as chevronRightSvg } from '@var-ui/icons/glyphs/chevronRight';
---

<UnstyledButton aria-expanded="false">
  <Fragment set:html={chevronRightSvg} />
  Build details
</UnstyledButton>`,
  html: `<button type="button" aria-expanded="false" class="var-ui-unstyled-button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9.5 6l6 6-6 6" /></svg>Build details</button>`,
} satisfies DemoSnippets;
