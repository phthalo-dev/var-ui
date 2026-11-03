import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Splitter } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [sizes, setSizes] = useState([25, 75]);

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Splitter sizes={sizes} onSizesChange={setSizes} style={{ height: 200 }}>
        <Splitter.Panel collapsible minSize={15}>
          <div style={{ padding: 12 }}>Sidebar. Press Enter on the divider to collapse it.</div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 12 }}>Content</div>
        </Splitter.Panel>
      </Splitter>
      <span>Sidebar: {sizes[0]}%</span>
    </div>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (a splitter needs client state) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
