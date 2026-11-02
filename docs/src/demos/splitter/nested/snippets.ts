import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter defaultSizes={[30, 70]} style={{ height: 280 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Files</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <Splitter orientation="vertical" defaultSizes={[65, 35]} style={{ height: '100%' }}>
          <Splitter.Panel>
            <div style={{ padding: 12 }}>Editor</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 12 }}>Console</div>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (a splitter needs client state) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
