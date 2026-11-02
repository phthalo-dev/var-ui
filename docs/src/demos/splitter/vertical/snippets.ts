import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Splitter } from '@var-ui/react';

export default function Preview() {
  return (
    <Splitter orientation="vertical" defaultSizes={[60, 40]} style={{ height: 260 }}>
      <Splitter.Panel>
        <div style={{ padding: 12 }}>Editor</div>
      </Splitter.Panel>
      <Splitter.Panel minSize={15}>
        <div style={{ padding: 12 }}>Terminal</div>
      </Splitter.Panel>
    </Splitter>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (a splitter needs client state) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
