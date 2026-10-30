import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Avatar, HStack, Select } from '@var-ui/react';

const PEOPLE = [
  { id: 'ada', name: 'Ada Lovelace' },
  { id: 'grace', name: 'Grace Hopper' },
];

<Select.Root>
  <Select.Label>Assignee</Select.Label>
  <Select.Trigger>
    <Select.Value>
      {({ selectedText, isPlaceholder }) =>
        isPlaceholder ? (
          'Select a person…'
        ) : (
          <HStack gap="sm">
            <Avatar name={selectedText} size="sm" />
            {selectedText}
          </HStack>
        )
      }
    </Select.Value>
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      {PEOPLE.map((person) => (
        <Select.Item key={person.id} value={person.id} textValue={person.name}>
          <HStack gap="sm">
            <Avatar name={person.name} size="sm" />
            {person.name}
          </HStack>
        </Select.Item>
      ))}
    </Select.ListBox>
  </Select.Popover>
</Select.Root>`,
  astro: `<!-- Custom item rows are React-only — use @var-ui/react -->`,
  html: `<!-- Custom item rows are React-only — use @var-ui/react -->`,
} satisfies DemoSnippets;
