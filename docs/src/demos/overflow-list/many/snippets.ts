import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { OverflowList } from '@var-ui/react';

<div style={{ width: '13.75rem' }}>
  <OverflowList fillParent renderOverflow={(hidden) => <span>+{hidden.length}</span>}>
    <OverflowList.Item>Alpha</OverflowList.Item>
    <OverflowList.Item>Beta</OverflowList.Item>
    {/* …more items… */}
    <OverflowList.Item>Kappa</OverflowList.Item>
  </OverflowList>
</div>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
