import { ColorInput, Text, VStack } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [color, setColor] = useState('#e11d48');

  return (
    <VStack gap="sm">
      <ColorInput label="Accent" value={color} onValueChange={setColor} />
      <Text size="sm" tone="secondary">
        Value: {color}
      </Text>
    </VStack>
  );
}
