import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TabList } from '@var-ui/react';

<TabList value={tab} onValueChange={setTab} label="Sections">
  <TabList.Tab value="overview" label="Overview" />
  <TabList.Tab value="activity" label="Activity" />
</TabList>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
