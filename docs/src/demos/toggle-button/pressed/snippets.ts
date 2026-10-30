import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HStack, ToggleButton } from '@var-ui/react';
import { useState } from 'react';

const [italic, setItalic] = useState(true);

<HStack gap="sm">
  <ToggleButton defaultSelected>Bold</ToggleButton>
  <ToggleButton selected={italic} onSelectedChange={setItalic}>
    Italic
  </ToggleButton>
  <ToggleButton>Underline</ToggleButton>
</HStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
