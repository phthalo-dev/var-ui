import { Button, ToggleGroup, Toolbar } from '@var-ui/react';

export default function Preview() {
  return (
    <Toolbar
      label="Formatting"
      startContent={
        <ToggleGroup aria-label="Text style" multiple>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
      }
      endContent={<Button>Share</Button>}
    />
  );
}
