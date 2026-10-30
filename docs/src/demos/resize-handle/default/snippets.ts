import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ResizeHandle } from '@var-ui/react';

<ResizeHandle value={width} minValue={120} maxValue={280} onValueChange={setWidth} aria-label="Resize sidebar" />`,
  astro: `---
import { ResizeHandle } from '@var-ui/astro';
---
<ResizeHandle label="Resize sidebar" />`,
  html: `<div class="var-ui-resize-handle" aria-label="Resize sidebar"><div class="var-ui-resize-handle__pill"></div></div>`,
} satisfies DemoSnippets;
