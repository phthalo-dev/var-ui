import { ToggleGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <ToggleGroup aria-label="Text style" multiple defaultValue={['bold']}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      <ToggleGroup.Item value="strike" disabled>
        Strike
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
