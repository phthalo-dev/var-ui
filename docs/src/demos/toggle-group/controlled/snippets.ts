import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ToggleGroup } from '@var-ui/react';
import { useState } from 'react';

const [value, setValue] = useState<string[]>(['bold']);

<ToggleGroup aria-label="Text style" multiple value={value} onValueChange={setValue}>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup>
<p>Pressed: {value.join(', ') || 'none'}</p>`,
  astro: `<!-- No Astro binding: ToggleGroup holds client state, use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
