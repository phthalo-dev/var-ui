import { ToggleGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <ToggleGroup aria-label="View" defaultValue="list">
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    </ToggleGroup>
  );
}
