import { ToggleGroup } from '@var-ui/react';
import { useState } from 'react';

export default function Preview() {
  const [value, setValue] = useState<string[]>(['bold']);

  return (
    <div>
      <ToggleGroup aria-label="Text style" multiple value={value} onValueChange={setValue}>
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup>
      <p>Pressed: {value.join(', ') || 'none'}</p>
    </div>
  );
}
