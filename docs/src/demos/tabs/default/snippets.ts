import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Tabs, Text } from '@var-ui/react';

<Tabs
  tabs={[
    { value: 'overview', label: 'Overview', content: <Text>First panel content.</Text> },
    { value: 'details', label: 'Details', content: <Text>Second panel content.</Text> },
  ]}
/>`,
  astro: `---
import { Tabs, Text } from '@var-ui/astro';

const tabDefs = [
  { value: 'overview', label: 'Overview' },
  { value: 'details', label: 'Details' },
];
---

<Tabs tabs={tabDefs} defaultValue="overview">
  <div slot="overview">
    <Text>First panel content.</Text>
  </div>
  <div slot="details">
    <Text>Second panel content.</Text>
  </div>
</Tabs>`,
  html: `<div data-var-ui-tabs class="var-ui-tabs"><div role="tablist" class="var-ui-tabs__list"><button type="button" role="tab" id="tab-overview" aria-controls="panel-overview" aria-selected="true" tabindex="0" data-selected class="var-ui-tabs__tab">Overview</button><button type="button" role="tab" id="tab-details" aria-controls="panel-details" aria-selected="false" tabindex="-1" class="var-ui-tabs__tab">Details</button></div><div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" class="var-ui-tabs__panel"><p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">First panel content.</p></div><div role="tabpanel" id="panel-details" aria-labelledby="tab-details" hidden class="var-ui-tabs__panel"><p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Second panel content.</p></div></div>`,
} satisfies DemoSnippets;
