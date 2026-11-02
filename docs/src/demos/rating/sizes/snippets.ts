import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Rating } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Rating size="sm" defaultValue={2} aria-label="Small" />
      <Rating size="md" defaultValue={3} aria-label="Medium" />
      <Rating size="lg" defaultValue={4} aria-label="Large" />
    </div>
  );
}`,
  astro: `<!-- No Astro binding for this demo — use @var-ui/react (read-only display: see the Rating Astro component) -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
