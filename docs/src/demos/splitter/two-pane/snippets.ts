import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter defaultSizes={[30, 70]} minSizes={[15, 30]} style={{ height: '12.5rem' }}>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>Sidebar</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>Content. Drag the divider, or focus it and use the arrow keys.</div>
      </Splitter.Panel>
    </Splitter>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (a splitter needs client state) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
