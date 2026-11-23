import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Timeline } from '@var-ui/react';

<Timeline activeIndex={1} tone="accent">
  <Timeline.Item
    title="Created"
    timestamp="2 hours ago"
    description="Issue opened"
    icon="check"
  />
  <Timeline.Item
    title="In review"
    timestamp="1 hour ago"
    description="Waiting on approval"
    icon="clock"
  />
  <Timeline.Item title="Merged" timestamp="Just now" description="PR #42" tone="success" icon="success" />
</Timeline>`,
  astro: `---
import { Timeline, TimelineItem } from '@var-ui/astro';
---

<Timeline tone="accent">
  <TimelineItem title="Created" timestamp="2 hours ago" description="Issue opened" />
  <TimelineItem title="In review" timestamp="1 hour ago" description="Waiting on approval" />
  <TimelineItem title="Merged" timestamp="Just now" description="PR #42" tone="success" />
</Timeline>`,
  html: `<ol class="var-ui-timeline">
  <li class="var-ui-timeline__item" data-active>
  ...
</ol>`,
} satisfies DemoSnippets;
