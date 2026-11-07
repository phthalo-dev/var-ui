import { ColorPicker, ColorSwatch, HStack } from '@var-ui/react';
import { useState } from 'react';

const presets = ['#228be6', '#40c057', '#fab005', '#fa5252'] as const;

export default function Preview() {
  const [color, setColor] = useState('#228be6');

  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: '16.25rem' }}>
      <ColorPicker value={color} onValueChange={setColor} swatches={[]} />
      <HStack gap="sm">
        {presets.map((preset) => (
          <ColorSwatch
            key={preset}
            color={preset}
            selected={color.toLowerCase() === preset}
            aria-label={preset}
            onClick={() => setColor(preset)}
          />
        ))}
      </HStack>
    </div>
  );
}
