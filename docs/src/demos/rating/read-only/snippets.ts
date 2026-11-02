import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Rating } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Rating readOnly value={3.5} label="Average rating" />
      <Rating readOnly value={4.2} tone="warning" size="sm" aria-label="Reviews" />
    </div>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (read-only display: see the Rating Astro component) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
