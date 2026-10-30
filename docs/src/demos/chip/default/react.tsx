import { useState } from 'react';
import { Chip, ChipGroup, HStack, Pill } from '@var-ui/react';

export default function Preview() {
  const [frameworks, setFrameworks] = useState<string[]>(['react']);
  const [tags, setTags] = useState(['Docs', 'API']);

  return (
    <HStack gap="md" wrap align="start">
      <ChipGroup
        tone="accent"
        multiple
        value={frameworks}
        onValueChange={setFrameworks}
        aria-label="Frameworks"
      >
        <Chip value="react">React</Chip>
        <Chip value="vue">Vue</Chip>
        <Chip value="svelte">Svelte</Chip>
      </ChipGroup>
      <HStack gap="sm" wrap align="center">
        {tags.map((tag) => (
          <Pill
            key={tag}
            tone="neutral"
            onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
          >
            {tag}
          </Pill>
        ))}
      </HStack>
    </HStack>
  );
}
