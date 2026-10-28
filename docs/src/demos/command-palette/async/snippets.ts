import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `<CommandPalette
  isOpen={open}
  onOpenChange={setOpen}
  filter={false}            // items already are the server's results
  highlightMatches
  isLoading={loading}
  onQueryChange={setQuery}  // debounce + fetch, then setItems
  items={items}
/>`,
  astro: `<!-- React-only secondary demo — see default for Astro -->`,
  html: `<!-- React-only secondary demo — see default for HTML -->`,
} satisfies DemoSnippets;
