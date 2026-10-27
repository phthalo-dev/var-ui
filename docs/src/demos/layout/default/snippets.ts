import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { useState } from 'react';
import {
  Button,
  Layout,
  LayoutContent,
  LayoutPanel,
  useResizable,
} from '@var-ui/react';

const { end } = useResizable({
  regions: { end: { defaultWidth: 280, minWidth: 220, maxWidth: 400 } },
});

<Layout
  height="auto"
  padding={0}
  content={<LayoutContent padding={0}>{/* list */}</LayoutContent>}
  end={
    <LayoutPanel resizable={end} hasResizeHandle label="Details" role="complementary">
      Inspector
    </LayoutPanel>
  }
/>`,
  astro: `---
import { Layout, LayoutContent, LayoutPanel } from '@var-ui/astro';
---

<Layout height="auto" padding={0}>
  <LayoutPanel slot="start" side="start" width={180} hasDivider>Nav</LayoutPanel>
  <LayoutContent>Main</LayoutContent>
  <LayoutPanel slot="end" side="end" width={240} hasDivider>Inspector</LayoutPanel>
</Layout>`,
  html: `<!-- Static shell — resize requires React -->`,
} satisfies DemoSnippets;
