import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter autoSaveId="docs-splitter-demo" defaultSizes={[40, 60]} style={{ height: '12.5rem' }}>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>Resize me, then reload the page.</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: '0.75rem' }}>The sizes are saved in localStorage.</div>
      </Splitter.Panel>
    </Splitter>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (a splitter needs client state) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
