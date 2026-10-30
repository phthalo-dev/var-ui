import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorPicker, ColorSwatch, HStack } from '@var-ui/react';

<ColorPicker value={color} onValueChange={setColor} swatches={[]} />
<HStack gap="sm">
  <ColorSwatch
    color="#228be6"
    selected={color === '#228be6'}
    aria-label="Blue"
    onClick={() => setColor('#228be6')}
  />
  <ColorSwatch
    color="#40c057"
    selected={color === '#40c057'}
    aria-label="Green"
    onClick={() => setColor('#40c057')}
  />
</HStack>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
