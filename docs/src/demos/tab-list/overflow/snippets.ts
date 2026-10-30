import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TabList } from '@var-ui/react';

<TabList value={tab} onValueChange={setTab} label="Sections">
  <TabList.Tab value="overview" label="Overview" />
  <TabList.Tab value="activity" label="Activity" />
  <TabList.Tab value="members" label="Members" />
  <TabList.Menu
    label="More"
    options={[
      { value: 'settings', label: 'Settings' },
      { value: 'billing', label: 'Billing' },
      { value: 'audit', label: 'Audit log' },
    ]}
  />
</TabList>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
