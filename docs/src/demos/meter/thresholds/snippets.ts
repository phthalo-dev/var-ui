import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Meter, Stack } from '@var-ui/react';

<Stack gap="md">
  <Meter label="Disk usage" value={30} low={50} high={80} optimum={0} />
  <Meter label="Disk usage" value={65} low={50} high={80} optimum={0} />
  <Meter label="Disk usage" value={92} low={50} high={80} optimum={0} />
  <Meter label="Password strength" value={85} low={40} high={70} optimum={100} valueLabel="Strong" />
</Stack>`,
  astro: `---
import { Meter } from '@var-ui/astro';
---

<Meter label="Disk usage" value={92} low={50} high={80} optimum={0} />`,
  html: `<!-- No HTML demo yet: use @var-ui/react -->`,
} satisfies DemoSnippets;
