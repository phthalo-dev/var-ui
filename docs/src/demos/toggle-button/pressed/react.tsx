import { HStack, ToggleButton } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [italic, setItalic] = useState(true);

  return (
    <HStack gap="sm">
      <ToggleButton defaultSelected>Bold</ToggleButton>
      <ToggleButton selected={italic} onSelectedChange={setItalic}>
        Italic
      </ToggleButton>
      <ToggleButton>Underline</ToggleButton>
    </HStack>
  );
}
