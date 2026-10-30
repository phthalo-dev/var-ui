import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorInput } from '@var-ui/react';
import { useState } from 'react';

const [color, setColor] = useState('#e11d48');

<ColorInput label="Accent" value={color} onValueChange={setColor} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
