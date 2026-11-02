import { HStack, ToggleGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ToggleGroup key={size} aria-label={'Size ' + size} size={size} defaultValue="a">
          <ToggleGroup.Item value="a">One</ToggleGroup.Item>
          <ToggleGroup.Item value="b">Two</ToggleGroup.Item>
        </ToggleGroup>
      ))}
      <ToggleGroup aria-label="Vertical" orientation="vertical" tone="success" defaultValue="b">
        <ToggleGroup.Item value="a">Top</ToggleGroup.Item>
        <ToggleGroup.Item value="b">Middle</ToggleGroup.Item>
        <ToggleGroup.Item value="c">Bottom</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="Ghost" appearance="ghost" multiple defaultValue={['a']}>
        <ToggleGroup.Item value="a">Ghost</ToggleGroup.Item>
        <ToggleGroup.Item value="b">Group</ToggleGroup.Item>
      </ToggleGroup>
    </HStack>
  );
}
